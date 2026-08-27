import { useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppIcon } from "./_components";
import { Product, ScreenName } from "./_data";
import { styles } from "./_styles";

const LOCAL_PRODUCT_IMAGES: Record<string, ImageSourcePropType> = {
  "VANTA Denim Dress": require("../images_product/images_product/VANTA Denim Dress.jpg"),
  "VANTA Stripe Maxi": require("../images_product/images_product/VANTA Stripe Maxi.jpg"),
  "Pleated Minimal Dress": require("../images_product/images_product/Pleated Minimal Dress.jpg"),
  "Smocked Crop Top": require("../images_product/images_product/Smocked Crop Top.jpg"),
};
function productImageSource(product: Product): ImageSourcePropType {
  return product.image?.startsWith("http")
    ? { uri: product.image }
    : (LOCAL_PRODUCT_IMAGES[product.name] ??
        LOCAL_PRODUCT_IMAGES["Smocked Crop Top"]);
}
function normalizePriceSearch(value: string | number) {
  return String(value).replace(/[฿,\s]/g, "");
}
function formatPrice(value: string | number) {
  const price = Number(value);
  return Number.isFinite(price) ? price.toLocaleString("th-TH") : String(value);
}

interface LoginScreenProps {
  username: string;
  password: string;
  displayName: string;
  email: string;
  confirmPassword: string;
  registering: boolean;
  loading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
}
export function LoginScreen({
  username,
  password,
  displayName,
  email,
  confirmPassword,
  registering,
  loading,
  onUsernameChange,
  onPasswordChange,
  onDisplayNameChange,
  onEmailChange,
  onConfirmPasswordChange,
  onSubmit,
  onToggleMode,
}: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const canSubmit = Boolean(
    username.trim() &&
    password &&
    (!registering || password === confirmPassword),
  );
  const passwordMismatch =
    registering && Boolean(confirmPassword) && password !== confirmPassword;
  return (
    <View style={styles.loginWrapper}>
      <View style={styles.loginCenterCard}>
        <Text style={styles.loginLogo}>VANTA</Text>
        <Text style={styles.loginSubText}>
          {registering
            ? "CREATE YOUR INVENTORY ACCOUNT"
            : "INVENTORY, BEAUTIFULLY ORGANISED"}
        </Text>
        {registering && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DISPLAY NAME</Text>
            <TextInput
              style={styles.loginInput}
              placeholder="Your name"
              placeholderTextColor="#9EB3D1"
              value={displayName}
              onChangeText={onDisplayNameChange}
            />
          </View>
        )}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>USERNAME</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter username"
            placeholderTextColor="#9EB3D1"
            value={username}
            onChangeText={onUsernameChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {registering && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL (OPTIONAL)</Text>
            <TextInput
              style={styles.loginInput}
              placeholder="you@example.com"
              placeholderTextColor="#9EB3D1"
              value={email}
              onChangeText={onEmailChange}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        )}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="At least 8 characters"
            placeholderTextColor="#9EB3D1"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={onPasswordChange}
            onSubmitEditing={onSubmit}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((visible) => !visible)}
          >
            <Text style={styles.passwordToggle}>
              {showPassword ? "Hide password" : "Show password"}
            </Text>
          </TouchableOpacity>
        </View>
        {registering && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
            <TextInput
              style={styles.loginInput}
              placeholder="Repeat your password"
              placeholderTextColor="#9EB3D1"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              onSubmitEditing={onSubmit}
            />
            {passwordMismatch && (
              <Text style={styles.passwordError}>Passwords do not match</Text>
            )}
          </View>
        )}
        <TouchableOpacity
          disabled={loading || !canSubmit}
          style={[
            styles.loginButton,
            (!canSubmit || loading) && { opacity: 0.45 },
          ]}
          onPress={onSubmit}
        >
          <Text style={styles.loginButtonText}>
            {loading
              ? registering
                ? "Creating account..."
                : "Signing in..."
              : registering
                ? "Create account"
                : "Log In to VANTA"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginModeButton} onPress={onToggleMode}>
          <Text style={styles.loginModeText}>
            {registering
              ? "Already have an account? Log in"
              : "New here? Create an account"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function MenuScreen({
  isAdmin,
  onClose,
  onNavigate,
  onLogout,
}: {
  isAdmin: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
}) {
  const entries: [ScreenName, string][] = [
    ["Home", "Home dashboard"],
    ...(isAdmin ? [["AddProduct", "Add product"] as [ScreenName, string]] : []),
    ["Products", "All products"],
    ["Favorites", "Saved products"],
    ["Categories", "Categories"],
    ["Settings", "Personal settings"],
  ];
  return (
    <View style={styles.menuOverlayContainer}>
      <View style={styles.menuHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeMenuText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.menuLogo}>VANTA</Text>
        <View style={{ width: 18 }} />
      </View>
      <View style={styles.menuLinksContainer}>
        {entries.map(([screen, label]) => (
          <TouchableOpacity
            key={screen}
            style={styles.menuLinkItem}
            onPress={() => onNavigate(screen)}
          >
            <Text style={styles.menuLinkLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.menuLogoutButton} onPress={onLogout}>
        <Text style={styles.menuLogoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

export function HomeDashboard({
  stats,
  profileName,
  onViewProducts,
  onViewLowStock,
  onViewCategories,
}: {
  stats: {
    productCount: number;
    totalStock: number;
    lowStock: number;
    categoryCount: number;
  };
  profileName: string;
  onViewProducts: () => void;
  onViewLowStock: () => void;
  onViewCategories: () => void;
}) {
  const items = [
    {
      number: stats.productCount,
      label: "PRODUCTS",
      description: "In your inventory",
      onPress: onViewProducts,
    },
    {
      number: stats.totalStock,
      label: "TOTAL STOCK",
      description: "Total units",
      onPress: onViewProducts,
    },
    {
      number: stats.lowStock,
      label: "LOW STOCK",
      description: "Running low",
      onPress: onViewLowStock,
    },
    {
      number: stats.categoryCount,
      label: "CATEGORIES",
      description: "Organized by type",
      onPress: onViewCategories,
    },
  ];
  return (
    <View style={{ paddingBottom: 20 }}>
      <View style={styles.heroCard}>
        <View style={styles.heroAccentTop} />
        <View style={styles.heroAccent} />
        <Text style={styles.heroEyebrow}>VANTA INVENTORY</Text>
        <Text style={styles.heroTitle}>Inventory overview</Text>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AT A GLANCE</Text>
        <TouchableOpacity onPress={onViewProducts}>
          <Text style={styles.textButton}>View products</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsGrid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={item.onPress}
            style={[
              styles.statBox,
              item.label === "LOW STOCK" &&
                item.number > 0 &&
                styles.statHighlight,
            ]}
          >
            <Text style={styles.statNum}>{item.number}</Text>
            <Text style={styles.statSub}>{item.description}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type ProductInput = Omit<Product, "id">;
export function AddProductScreen({
  product,
  onSave,
}: {
  product: Product | null;
  onSave: (product: ProductInput) => void;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [sizes, setSizes] = useState(product?.sizes ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [image, setImage] = useState(product?.image ?? "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [location, setLocation] = useState(product?.location ?? "Warehouse A");
  const submit = () => {
    if (!name.trim() || !category.trim() || !price.trim() || !stock.trim())
      return Alert.alert(
        "กรอกข้อมูลไม่ครบ",
        "กรุณากรอกชื่อสินค้า หมวดหมู่ ราคา และจำนวนคงเหลือ",
      );
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (
      !Number.isFinite(numericPrice) ||
      !Number.isInteger(numericStock) ||
      numericPrice < 0 ||
      numericStock < 0
    )
      return Alert.alert(
        "ข้อมูลไม่ถูกต้อง",
        "ราคาและจำนวนคงเหลือต้องเป็นตัวเลขที่ไม่ติดลบ",
      );
    onSave({
      name: name.trim(),
      category: category.trim(),
      sizes: sizes.trim() || null,
      price: numericPrice,
      stock: numericStock,
      image: image.trim() || null,
      status: product?.status ?? "Available",
      brand: product?.brand ?? "Vanta",
      productCode: product?.productCode ?? null,
      location: location.trim() || "Warehouse A",
    });
  };
  return (
    <View style={{ paddingBottom: 20 }}>
      <Text style={styles.sectionTitleLarge}>
        {product ? "Edit product" : "Add new product"}
      </Text>
      <Text style={styles.sectionSubtitle}>
        Keep your catalogue complete and easy to find.
      </Text>
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>PRODUCT NAME</Text>
        <TextInput
          style={styles.formInput}
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.formLabel}>CATEGORY</Text>
        <TextInput
          style={styles.formInput}
          value={category}
          onChangeText={setCategory}
        />
        <Text style={styles.formLabel}>SIZE</Text>
        <TextInput
          style={styles.formInput}
          value={sizes}
          onChangeText={setSizes}
        />
        <Text style={styles.formLabel}>PRICE (THB)</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <Text style={styles.formLabel}>STOCK</Text>
        <TextInput
          style={styles.formInput}
          keyboardType="numeric"
          value={stock}
          onChangeText={setStock}
        />
        <Text style={styles.formLabel}>STORAGE LOCATION</Text>
        <TextInput
          style={styles.formInput}
          placeholder="เช่น Shelf A-03"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.formLabel}>IMAGE URL</Text>
        <TextInput
          style={styles.formInput}
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.submitFormBtn} onPress={submit}>
          <Text style={styles.submitFormBtnText}>
            {product ? "Save changes" : "Save product"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProductCard({
  product,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onAddToCart,
}: {
  product: Product;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
}) {
  const isLowStock = Number(product.stock) <= 5;
  return (
    <TouchableOpacity onPress={onSelect} style={styles.productCardLarge}>
      <View style={styles.productImageWrap}>
        <Image
          source={productImageSource(product)}
          style={styles.productImageLarge}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
          accessibilityLabel={
            isFavorite ? "นำออกจากรายการโปรด" : "บันทึกเป็นรายการโปรด"
          }
        >
          <AppIcon
            name={isFavorite ? "heart" : "heartOutline"}
            size={18}
            color={isFavorite ? "#D96B6B" : "#75839A"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfoLarge}>
        <Text style={styles.productNameTextLarge} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productMetaTextLarge} numberOfLines={1}>
          {product.category}
        </Text>
        <View style={styles.productStockRow}>
          <Text style={styles.priceTagLarge}>
            ฿{formatPrice(product.price)}
          </Text>
          <View
            style={[
              styles.productStockBadge,
              isLowStock
                ? styles.productStockBadgeLow
                : styles.productStockBadgeOk,
            ]}
          >
            <Text
              style={[
                styles.productStockText,
                isLowStock
                  ? styles.productStockTextLow
                  : styles.productStockTextOk,
              ]}
            >
              {isLowStock
                ? `Low · ${product.stock}`
                : `Stock · ${product.stock}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onAddToCart}
          disabled={Number(product.stock) <= 0}
          style={{
            marginTop: 10,
            backgroundColor: "#E8B44F",
            borderRadius: 9,
            paddingVertical: 8,
            alignItems: "center",
            opacity: Number(product.stock) <= 0 ? 0.45 : 1,
          }}
        >
          <Text style={{ color: "#192A46", fontWeight: "800", fontSize: 12 }}>
            {Number(product.stock) <= 0 ? "Out of stock" : "Add to cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function ProductsScreen({
  canManage,
  products,
  category,
  favoriteIds,
  showFavoritesOnly = false,
  onClearCategory,
  onSelectProduct,
  onAddProduct,
  onToggleFavorite,
  onAddToCart,
}: {
  canManage: boolean;
  products: Product[];
  category: string | null;
  favoriteIds: number[];
  showFavoritesOnly?: boolean;
  onClearCategory: () => void;
  onSelectProduct: (product: Product) => void;
  onAddProduct: () => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: Product) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const visibleProducts = (
    category
      ? products.filter((product) => product.category === category)
      : products
  ).filter((product) => !showFavoritesOnly || favoriteIds.includes(product.id));
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const normalizedPriceQuery = normalizePriceSearch(searchQuery);
  const filteredProducts = normalizedQuery
    ? visibleProducts.filter(
        (product) =>
          [
            product.name,
            product.category,
            product.productCode,
            product.location,
          ].some((value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(normalizedQuery),
          ) ||
          (normalizedPriceQuery.length > 0 &&
            normalizePriceSearch(product.price).includes(normalizedPriceQuery)),
      )
    : visibleProducts;
  const title = showFavoritesOnly ? "Saved products" : category || "Products";
  return (
    <View style={{ paddingBottom: 20 }}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitleLarge}>{title}</Text>
          <Text style={styles.sectionSubtitle}>
            {showFavoritesOnly
              ? "Products you saved for quick access."
              : `${visibleProducts.length} item${visibleProducts.length === 1 ? "" : "s"} available`}
          </Text>
        </View>
        {canManage && !showFavoritesOnly && (
          <TouchableOpacity
            style={styles.actionInlineBtn}
            onPress={onAddProduct}
          >
            <Text style={styles.actionBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <AppIcon name="products" size={18} color="#77869A" />
        </View>
        <TextInput
          style={[styles.formInput, styles.searchInput]}
          placeholder="Search name, price, code, location"
          placeholderTextColor="#8C99AB"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>
      {category && (
        <TouchableOpacity onPress={onClearCategory}>
          <Text style={styles.textButton}>Show all products</Text>
        </TouchableOpacity>
      )}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <AppIcon
            name={showFavoritesOnly ? "heartOutline" : "products"}
            size={38}
            color="#A5B2C4"
          />
          <Text style={styles.emptyStateTitle}>
            {showFavoritesOnly ? "No saved products yet" : "No products found"}
          </Text>
          <Text style={styles.emptyStateCopy}>
            {showFavoritesOnly
              ? "Tap the heart on any product to keep it here."
              : "Try another keyword, product code, or price."}
          </Text>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isFavorite={favoriteIds.includes(item.id)}
              onSelect={() => onSelectProduct(item)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
              onAddToCart={() => onAddToCart(item)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export function CartScreen({
  items,
  products,
  onChangeQuantity,
  onRemove,
}: {
  items: { productId: number; quantity: number }[];
  products: Product[];
  onChangeQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}) {
  const rows = items
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((row): row is typeof row & { product: Product } =>
      Boolean(row.product),
    );
  const total = rows.reduce(
    (sum, row) => sum + Number(row.product.price) * row.quantity,
    0,
  );
  return (
    <View style={{ paddingBottom: 24 }}>
      <Text style={styles.sectionTitleLarge}>Cart</Text>
      <Text style={styles.sectionSubtitle}>
        Review products you want to buy.
      </Text>
      {rows.length === 0 ? (
        <View style={styles.emptyState}>
          <AppIcon name="cart" size={38} color="#A5B2C4" />
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateCopy}>
            Tap Add to cart on a product to start.
          </Text>
        </View>
      ) : (
        <>
          <View style={{ gap: 10 }}>
            {rows.map(({ product, quantity }) => (
              <View
                key={product.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={productImageSource(product)}
                  style={{ width: 62, height: 62, borderRadius: 10 }}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.productNameTextLarge}>
                    {product.name}
                  </Text>
                  <Text style={styles.priceTagLarge}>
                    ฿{formatPrice(product.price)}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 7,
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => onChangeQuantity(product.id, quantity - 1)}
                    >
                      <Text style={{ fontSize: 20, color: "#38557D" }}>−</Text>
                    </TouchableOpacity>
                    <Text>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        onChangeQuantity(
                          product.id,
                          Math.min(Number(product.stock), quantity + 1),
                        )
                      }
                      disabled={quantity >= Number(product.stock)}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          color:
                            quantity >= Number(product.stock)
                              ? "#A5B2C4"
                              : "#38557D",
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onRemove(product.id)}>
                      <Text style={{ color: "#D96B6B", fontSize: 12 }}>
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View
            style={{
              marginTop: 18,
              backgroundColor: "#192A46",
              borderRadius: 14,
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>TOTAL</Text>
            <Text style={{ color: "#E8B44F", fontWeight: "900", fontSize: 18 }}>
              ฿{formatPrice(total)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export function CategoriesScreen({
  products,
  onSelectCategory,
}: {
  products: Product[];
  onSelectCategory: (category: string) => void;
}) {
  const categories = products.reduce<Record<string, number>>(
    (all, product) => ({
      ...all,
      [product.category]: (all[product.category] ?? 0) + 1,
    }),
    {},
  );
  return (
    <View style={{ paddingBottom: 20 }}>
      <Text style={styles.sectionTitleLarge}>Categories</Text>
      <Text style={[styles.sectionSubtitle, { marginBottom: 16 }]}>
        Browse the catalogue by collection.
      </Text>
      {Object.entries(categories).map(([name, count]) => (
        <TouchableOpacity
          key={name}
          style={styles.categoryRowCard}
          onPress={() => onSelectCategory(name)}
        >
          <View style={styles.categoryIconWrapper}>
            <AppIcon name="categories" size={20} color="#38557D" />
          </View>
          <View style={{ flex: 1, marginLeft: 13 }}>
            <Text style={styles.categoryNameText}>{name}</Text>
            <Text style={styles.categoryCountText}>
              {count} item{count === 1 ? "" : "s"}
            </Text>
          </View>
          <AppIcon name="arrow" size={16} color="#A3B0C1" />
        </TouchableOpacity>
      ))}
      {Object.keys(categories).length === 0 && (
        <View style={styles.emptyState}>
          <AppIcon name="categories" size={38} color="#A5B2C4" />
          <Text style={styles.emptyStateTitle}>No categories yet</Text>
        </View>
      )}
    </View>
  );
}

interface SettingsScreenProps {
  loading: boolean;
  profileName: string;
  profileEmail: string;
  profilePassword: string;
  profileStore: string;
  profileEmpCode: string;
  profileRole: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeStore: (value: string) => void;
  onChangeEmpCode: (value: string) => void;
  onChangeRole: (value: string) => void;
  onSave: () => void;
}
export function SettingsScreen({
  loading,
  profileName,
  profileEmail,
  profilePassword,
  profileStore,
  profileEmpCode,
  profileRole,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onChangeStore,
  onChangeEmpCode,
  onChangeRole,
  onSave,
}: SettingsScreenProps) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <Text style={styles.sectionTitleLarge}>Personal settings</Text>
      <Text style={styles.sectionSubtitle}>
        Manage your account and store details.
      </Text>
      <View style={styles.formCard}>
        <Text style={styles.formLabel}>NAME</Text>
        <TextInput
          style={styles.formInput}
          value={profileName}
          onChangeText={onChangeName}
        />
        <Text style={styles.formLabel}>COMPANY EMAIL</Text>
        <TextInput
          style={styles.formInput}
          value={profileEmail}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={styles.formLabel}>NEW PASSWORD</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Leave blank to keep current"
          placeholderTextColor="#8C99AB"
          value={profilePassword}
          onChangeText={onChangePassword}
          secureTextEntry
        />
        <Text style={styles.formLabel}>STORE</Text>
        <TextInput
          style={styles.formInput}
          value={profileStore}
          onChangeText={onChangeStore}
        />
        <Text style={styles.formLabel}>EMPLOYEE CODE</Text>
        <TextInput
          style={styles.formInput}
          value={profileEmpCode}
          onChangeText={onChangeEmpCode}
        />
        <Text style={styles.formLabel}>CURRENT ROLE</Text>
        <TextInput
          editable={false}
          style={styles.formInput}
          value={profileRole}
          onChangeText={onChangeRole}
        />
        <TouchableOpacity
          disabled={loading}
          style={[styles.submitFormBtn, loading && { opacity: 0.6 }]}
          onPress={onSave}
        >
          <Text style={styles.submitFormBtnText}>
            {loading ? "Saving..." : "Save settings"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function ProductDetailScreen({
  canManage,
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onEdit,
  onDelete,
}: {
  canManage: boolean;
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const confirmDelete = () => {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm(`ต้องการลบ "${product.name}" หรือไม่?`)) onDelete();
      return;
    }
    Alert.alert("ลบสินค้า", `ต้องการลบ "${product.name}" หรือไม่?`, [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", style: "destructive", onPress: onDelete },
    ]);
  };
  return (
    <View style={{ paddingBottom: 20 }}>
      <View style={styles.detailCard}>
        <Image
          source={productImageSource(product)}
          style={styles.detailImage}
        />
        <View style={styles.detailTopRow}>
          <Text style={styles.detailTitle}>{product.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
          >
            <AppIcon
              name={isFavorite ? "heart" : "heartOutline"}
              color={isFavorite ? "#D96B6B" : "#75839A"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.detailPrice}>฿{formatPrice(product.price)}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailSectionLabel}>Stock</Text>
          <Text style={styles.detailValueText}>{product.stock} units</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailSectionLabel}>Size</Text>
          <Text style={styles.detailValueText}>{product.sizes || "-"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailSectionLabel}>Product code</Text>
          <Text style={styles.detailValueText}>
            {product.productCode || "-"}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailSectionLabel}>Location</Text>
          <Text style={styles.detailValueText}>
            {product.location || "Warehouse A"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.submitFormBtn, { marginTop: 18 }]}
          onPress={onAddToCart}
          disabled={Number(product.stock) <= 0}
        >
          <Text style={styles.submitFormBtnText}>
            {Number(product.stock) <= 0 ? "Out of stock" : "Add to cart"}
          </Text>
        </TouchableOpacity>
        {canManage && (
          <>
            <TouchableOpacity
              style={[styles.submitFormBtn, { marginTop: 10 }]}
              onPress={onEdit}
            >
              <Text style={styles.submitFormBtnText}>Edit product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={confirmDelete}
            >
              <Text style={styles.dangerButtonText}>Delete product</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
