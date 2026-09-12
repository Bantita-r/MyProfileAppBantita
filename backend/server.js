const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const bcrypt = require("bcrypt");
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mysql = require("mysql2/promise");

const app = express();
app.set("trust proxy", 1);
const port = Number(process.env.PORT || 3026);
const jwtSecret = process.env.JWT_SECRET;
const inventoryTable = process.env.INVENTORY_TABLE || "Inventory";
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!jwtSecret) throw new Error("JWT_SECRET is required in backend/.env");
if (!/^[A-Za-z0-9_]+$/.test(inventoryTable))
  throw new Error("INVENTORY_TABLE contains invalid characters");

const uploadDirectory = path.join(__dirname, "uploads");
const publicProductImageBase =
  "https://raw.githubusercontent.com/Bantita-r/MyProfileAppBantita/main/assets/product-images/";
const publicProductImages = {
  "VANTA Stripe Maxi": "VANTA Stripe Maxi.jpg",
  "VANTA Denim Dress": "VANTA Denim Dress.jpg",
  "Distressed Denim Shorts": "Distressed Denim Shorts.jpg",
};
function toPublicProductImage(product) {
  const publishedImageName = publicProductImages[product.name];
  if (publishedImageName) {
    return `${publicProductImageBase}${encodeURIComponent(publishedImageName)}`;
  }
  return product.image?.startsWith("http") ? product.image : null;
}
fs.mkdirSync(uploadDirectory, { recursive: true });
const imageUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename(_req, file, callback) {
      const extension =
        path.extname(file.originalname).toLowerCase() ||
        (file.mimetype === "image/png" ? ".png" : ".jpg");
      callback(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype));
  },
});

app.use(
  cors({
    origin(origin, callback) {
      // Native Expo requests have no Origin header. Browser builds must be explicitly allowed.
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadDirectory));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function toProductInput(body) {
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "").trim();
  const price = Number(body.price);
  const stock = Number(body.stock);
  if (
    !name ||
    !category ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock < 0
  )
    return null;
  return {
    name,
    category,
    price,
    stock,
    image: body.image ? String(body.image).trim() : null,
    status: body.status ? String(body.status).trim() : "Available",
    brand: body.brand ? String(body.brand).trim() : "Vanta",
    sizes: body.sizes ? String(body.sizes).trim() : null,
    // The existing inventory schema requires a product code. Generate one for
    // products created from the current form, which does not ask users for it.
    productCode: body.productCode
      ? String(body.productCode).trim()
      : `VANTA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    location: body.location ? String(body.location).trim() : "Warehouse A",
    orderName: body.orderName ? String(body.orderName).trim() : "Vanta.Bantita",
  };
}

function text(value, maxLength = 255) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function runProductClustering(products) {
  if (products.length < 2)
    throw new Error("Add at least 2 products before running K-Means.");

  const points = products.map((product) => {
    const price = Number(product.price);
    const stock = Number(product.stock);
    if (!Number.isFinite(price) || !Number.isFinite(stock))
      throw new Error("Every product price and stock value must be numeric.");
    return [price, stock];
  });
  const clusterCount = Math.min(3, points.length);
  const means = [0, 1].map((column) =>
    points.reduce((sum, point) => sum + point[column], 0) / points.length,
  );
  const standardDeviations = [0, 1].map((column) => {
    const variance =
      points.reduce(
        (sum, point) => sum + (point[column] - means[column]) ** 2,
        0,
      ) / points.length;
    return Math.sqrt(variance) || 1;
  });
  const normalized = points.map((point) =>
    point.map((value, column) => (value - means[column]) / standardDeviations[column]),
  );
  let centroids = Array.from({ length: clusterCount }, (_, index) =>
    [...normalized[Math.floor((index * normalized.length) / clusterCount)]],
  );
  let labels = normalized.map(() => 0);

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const nextLabels = normalized.map((point) => {
      let closest = 0;
      let closestDistance = Infinity;
      centroids.forEach((centroid, index) => {
        const distance = point.reduce(
          (sum, value, column) => sum + (value - centroid[column]) ** 2,
          0,
        );
        if (distance < closestDistance) {
          closest = index;
          closestDistance = distance;
        }
      });
      return closest;
    });
    const nextCentroids = centroids.map((centroid, cluster) => {
      const members = normalized.filter((_, index) => nextLabels[index] === cluster);
      return members.length === 0
        ? centroid
        : [0, 1].map(
            (column) =>
              members.reduce((sum, point) => sum + point[column], 0) /
              members.length,
          );
    });
    const unchanged = nextLabels.every((label, index) => label === labels[index]);
    labels = nextLabels;
    centroids = nextCentroids;
    if (unchanged) break;
  }

  const groups = Array.from({ length: clusterCount }, (_, index) => {
    const memberIndexes = labels
      .map((label, productIndex) => (label === index ? productIndex : -1))
      .filter((productIndex) => productIndex >= 0);
    const averagePrice =
      memberIndexes.reduce((sum, productIndex) => sum + points[productIndex][0], 0) /
      memberIndexes.length;
    const averageStock =
      memberIndexes.reduce((sum, productIndex) => sum + points[productIndex][1], 0) /
      memberIndexes.length;
    return {
      id: index + 1,
      label: `${averagePrice >= means[0] ? "High value" : "Lower value"} / ${averageStock >= means[1] ? "high stock" : "low stock"}`,
      averagePrice: Number(averagePrice.toFixed(2)),
      averageStock: Number(averageStock.toFixed(2)),
      products: memberIndexes.map((productIndex) => ({
        ...products[productIndex],
        price: points[productIndex][0],
        stock: points[productIndex][1],
        cluster: index + 1,
      })),
    };
  }).sort((left, right) => right.averagePrice - left.averagePrice);

  groups.forEach((group, index) => {
    group.id = index + 1;
    group.products.forEach((product) => (product.cluster = group.id));
  });
  return {
    algorithm: "K-Means",
    features: ["price", "stock"],
    normalization: "StandardScaler",
    clusterCount,
    clusters: groups,
  };
}

function toUserProfile(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    displayName: user.display_name || user.username,
    email: user.email || "",
    store: user.store || "",
    employeeCode: user.employee_code || "",
  };
}

async function ensureUserProfileColumns() {
  const columns = [
    ["display_name", "VARCHAR(100) NULL"],
    ["email", "VARCHAR(255) NULL"],
    ["store", "VARCHAR(100) NULL"],
    ["employee_code", "VARCHAR(100) NULL"],
  ];
  for (const [name, definition] of columns) {
    const [existing] = await pool.query(
      "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
      [process.env.DB_NAME, "users", name],
    );
    if (existing.length === 0)
      await pool.query(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
  }
}

async function ensureUserRoleColumn() {
  // Earlier installations created `role` with `admin` as its default (and some
  // databases may have it as an ENUM containing only `admin`).  In that state
  // a normal account cannot be created even though /auth/register assigns the
  // correct `user` role.  Use a flexible role column and make `user` the safe
  // default; existing administrator values are preserved by MySQL.
  const [columns] = await pool.query(
    "SELECT COLUMN_TYPE, COLUMN_DEFAULT FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
    [process.env.DB_NAME, "users", "role"],
  );
  const roleColumn = columns[0];
  const isRestrictedEnum =
    /^enum/i.test(roleColumn?.COLUMN_TYPE ?? "") &&
    !roleColumn.COLUMN_TYPE.toLowerCase().includes("'user'");
  if (
    !roleColumn ||
    !/^varchar\(50\)$/i.test(roleColumn.COLUMN_TYPE) ||
    roleColumn.COLUMN_DEFAULT !== "user" ||
    isRestrictedEnum
  ) {
    await pool.query(
      "ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'",
    );
  }
}

async function bootstrap() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await ensureUserRoleColumn();
  await ensureUserProfileColumns();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminUsername && adminPassword) {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [adminUsername],
    );
    if (existing.length === 0) {
      await pool.query(
        "INSERT INTO users (username, password_hash, role, display_name) VALUES (?, ?, ?, ?)",
        [
          adminUsername,
          await bcrypt.hash(adminPassword, 12),
          "admin",
          adminUsername,
        ],
      );
      console.log(`Created initial admin account: ${adminUsername}`);
    }
  } else {
    console.warn(
      "ADMIN_USERNAME and ADMIN_PASSWORD are not set; no initial account was created.",
    );
  }
}

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "กรุณาเข้าสู่ระบบ" });
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res
      .status(401)
      .json({ error: "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่" });
  }
}

function requireAdmin(req, res, next) {
  if (String(req.user?.role ?? "").trim().toLowerCase() !== "admin")
    return res
      .status(403)
      .json({ error: "เฉพาะผู้ดูแลระบบเท่านั้นที่จัดการสินค้าได้" });
  return next();
}

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body.username ?? "").trim();
  const password = String(req.body.password ?? "");
  if (!username || !password)
    return res.status(400).json({ error: "กรุณากรอก username และ password" });
  try {
    const [rows] = await pool.query(
      "SELECT id, username, password_hash, role, display_name, email, store, employee_code FROM users WHERE username = ? LIMIT 1",
      [username],
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res
        .status(401)
        .json({ error: "Username หรือ password ไม่ถูกต้อง" });
    const token = jwt.sign(
      { sub: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: "8h" },
    );
    return res.json({ token, user: toUserProfile(user) });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถเข้าสู่ระบบได้" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const username = text(req.body.username, 100);
  const password = String(req.body.password ?? "");
  const displayName = text(req.body.displayName, 100) || username;
  const email = text(req.body.email, 255);
  if (!/^[A-Za-z0-9_.-]{3,100}$/.test(username))
    return res
      .status(400)
      .json({
        error:
          "Username ต้องมี 3-100 ตัวอักษร และใช้ได้เฉพาะ a-z, 0-9, _, ., -",
      });
  if (password.length < 8)
    return res
      .status(400)
      .json({ error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" });
  if (email && !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ error: "อีเมลไม่ถูกต้อง" });
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password_hash, role, display_name, email) VALUES (?, ?, ?, ?, ?)",
      [
        username,
        await bcrypt.hash(password, 12),
        "user",
        displayName,
        email || null,
      ],
    );
    return res
      .status(201)
      .json({
        id: result.insertId,
        username,
        role: "user",
        displayName,
        email,
      });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Username นี้ถูกใช้งานแล้ว" });
    console.error("Register error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถสมัครสมาชิกได้" });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, display_name, email, store, employee_code FROM users WHERE id = ? LIMIT 1",
      [req.user.sub],
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "ไม่พบบัญชีผู้ใช้" });
    return res.json(toUserProfile(rows[0]));
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถโหลดข้อมูลส่วนตัวได้" });
  }
});

app.put("/api/auth/me", requireAuth, async (req, res) => {
  const displayName = text(req.body.displayName, 100);
  const email = text(req.body.email, 255);
  const store = text(req.body.store, 100);
  const employeeCode = text(req.body.employeeCode, 100);
  const password = String(req.body.password ?? "");
  if (!displayName || (email && !/^\S+@\S+\.\S+$/.test(email)))
    return res.status(400).json({ error: "ข้อมูลส่วนตัวไม่ถูกต้อง" });
  if (password && password.length < 8)
    return res
      .status(400)
      .json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" });
  try {
    if (password) {
      await pool.query(
        "UPDATE users SET display_name = ?, email = ?, store = ?, employee_code = ?, password_hash = ? WHERE id = ?",
        [
          displayName,
          email || null,
          store || null,
          employeeCode || null,
          await bcrypt.hash(password, 12),
          req.user.sub,
        ],
      );
    } else {
      await pool.query(
        "UPDATE users SET display_name = ?, email = ?, store = ?, employee_code = ? WHERE id = ?",
        [
          displayName,
          email || null,
          store || null,
          employeeCode || null,
          req.user.sub,
        ],
      );
    }
    const [rows] = await pool.query(
      "SELECT id, username, role, display_name, email, store, employee_code FROM users WHERE id = ? LIMIT 1",
      [req.user.sub],
    );
    return res.json(toUserProfile(rows[0]));
  } catch (error) {
    console.error("Update profile error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถบันทึกข้อมูลส่วนตัวได้" });
  }
});

// This read-only route is the individual deliverable for the in-class
// assignment.  It deliberately needs no login so the lecturer (and, in the
// original group version, the central aggregation API) can request one
// consistent JSON data source directly.  Administrative create/update/delete
// routes below remain protected by JWT and the admin role.
app.get("/api/assignment/products", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, category, price, stock, image, location, status, brand, sizes, productCode, lastUpdate FROM \`${inventoryTable}\` ORDER BY lastUpdate DESC`,
    );
    const requestedLimit = Number.parseInt(String(_req.query.limit ?? ""), 10);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : rows.length;
    return res.json(
      rows.slice(0, limit).map((product) => {
        return {
          ...product,
          image: toPublicProductImage(product),
        };
      }),
    );
  } catch (error) {
    console.error("Get assignment products error:", error.message);
    return res.status(500).json({ error: "Unable to load assignment products" });
  }
});

app.get("/api/analytics/product-clusters", requireAuth, async (_req, res) => {
  try {
    const [products] = await pool.query(
      `SELECT id, name, category, price, stock, location FROM \`${inventoryTable}\` ORDER BY lastUpdate DESC`,
    );
    return res.json(runProductClustering(products));
  } catch (error) {
    console.error("Product clustering error:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Public, read-only Product API for the group aggregation task. All write
// routes below still require an authenticated administrator.
app.get("/api/products", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, category, price, stock, image, location, status, brand, sizes, productCode, lastUpdate FROM \`${inventoryTable}\` ORDER BY lastUpdate DESC`,
    );
    return res.json(
      rows.map((product) => {
        return {
          ...product,
          image: toPublicProductImage(product),
        };
      }),
    );
  } catch (error) {
    console.error("Get products error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถโหลดสินค้าได้" });
  }
});

app.post(
  "/api/uploads/products",
  requireAuth,
  requireAdmin,
  imageUpload.single("image"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ error: "กรุณาเลือกไฟล์รูปภาพ" });
    const origin = `${req.protocol}://${req.get("host")}`;
    return res.status(201).json({
      imageUrl: new URL(`/uploads/${req.file.filename}`, origin).toString(),
    });
  },
);

app.post("/api/products", requireAuth, requireAdmin, async (req, res) => {
  const product = toProductInput(req.body);
  if (!product)
    return res.status(400).json({ error: "ข้อมูลสินค้าไม่ถูกต้อง" });
  try {
    const [result] = await pool.query(
      `INSERT INTO \`${inventoryTable}\` (name, stock, category, location, image, status, brand, sizes, productCode, orderName, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.stock,
        product.category,
        product.location,
        product.image,
        product.status,
        product.brand,
        product.sizes,
        product.productCode,
        product.orderName,
        product.price,
      ],
    );
    const [rows] = await pool.query(
      `SELECT * FROM \`${inventoryTable}\` WHERE id = ?`,
      [result.insertId],
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Create product error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถเพิ่มสินค้าได้" });
  }
});

app.put("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  const product = toProductInput(req.body);
  const id = Number(req.params.id);
  if (!product || !Number.isInteger(id))
    return res.status(400).json({ error: "ข้อมูลสินค้าไม่ถูกต้อง" });
  try {
    const [result] = await pool.query(
      `UPDATE \`${inventoryTable}\` SET name = ?, stock = ?, category = ?, location = ?, image = ?, status = ?, brand = ?, sizes = ?, productCode = ?, orderName = ?, price = ? WHERE id = ?`,
      [
        product.name,
        product.stock,
        product.category,
        product.location,
        product.image,
        product.status,
        product.brand,
        product.sizes,
        product.productCode,
        product.orderName,
        product.price,
        id,
      ],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "ไม่พบสินค้า" });
    const [rows] = await pool.query(
      `SELECT * FROM \`${inventoryTable}\` WHERE id = ?`,
      [id],
    );
    return res.json(rows[0]);
  } catch (error) {
    console.error("Update product error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถแก้ไขสินค้าได้" });
  }
});

app.delete("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id))
    return res.status(400).json({ error: "รหัสสินค้าไม่ถูกต้อง" });
  try {
    const [result] = await pool.query(
      `DELETE FROM \`${inventoryTable}\` WHERE id = ?`,
      [id],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "ไม่พบสินค้า" });
    return res.status(204).send();
  } catch (error) {
    console.error("Delete product error:", error.message);
    return res.status(500).json({ error: "ไม่สามารถลบสินค้าได้" });
  }
});

app.get("/api", (_req, res) => res.json({ message: "VANTA API is running" }));

app.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ error: "ไฟล์รูปต้องมีขนาดไม่เกิน 5 MB" });
  if (error) return res.status(400).json({ error: "อัปโหลดรูปภาพไม่สำเร็จ" });
  return next();
});

bootstrap()
  .then(() =>
    app.listen(port, "0.0.0.0", () =>
      console.log(`VANTA API listening on port ${port}`),
    ),
  )
  .catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
