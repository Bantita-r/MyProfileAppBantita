import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import {
  AuthResponse,
  clearSession,
  createProduct,
  deleteProduct,
  getProductClusters,
  getProducts,
  loadCart,
  loadFavoriteProductIds,
  login,
  ProductClusterAnalysis,
  ProductInput,
  register,
  saveCart,
  saveFavoriteProductIds,
  setUnauthorizedHandler,
  updateMyProfile,
  updateProduct,
} from "./_api";
import { BottomTabBar, Header } from "./_components";
import { CartItem, Product, ScreenName } from "./_data";
import {
  AddProductScreen,
  AnalyticsScreen,
  CartScreen,
  CategoriesScreen,
  HomeDashboard,
  LoginScreen,
  MenuScreen,
  ProductDetailScreen,
  ProductsScreen,
  SettingsScreen,
} from "./_screens";
import { styles } from "./_styles";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("Home");
  const [previousScreen, setPreviousScreen] = useState<ScreenName>("Home");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerDisplayName, setRegisterDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileStore, setProfileStore] = useState("VANTAShop");
  const [profileEmpCode, setProfileEmpCode] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clusterAnalysis, setClusterAnalysis] =
    useState<ProductClusterAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const dashboardStats = useMemo(() => {
    const totalStock = products.reduce(
      (total, product) => total + Number(product.stock || 0),
      0,
    );
    const lowStock = products.filter(
      (product) => Number(product.stock) <= 5,
    ).length;
    return {
      productCount: products.length,
      totalStock,
      lowStock,
      categoryCount: new Set(products.map((product) => product.category)).size,
    };
  }, [products]);
  const isAdmin = profileRole.toLowerCase() === "admin";

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setIsLoggedIn(false);
      setProducts([]);
      setSelectedProduct(null);
      setFavoriteIds([]);
      setCartItems([]);
      setClusterAnalysis(null);
      setCurrentScreen("Home");
      Alert.alert("Session หมดอายุ", "กรุณาเข้าสู่ระบบใหม่");
    });
    // Require an explicit login whenever the app starts. This prevents an old
    // session from unexpectedly bypassing the login screen.
    void clearSession();
    return () => setUnauthorizedHandler(null);
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      setProducts(await getProducts());
    } catch (error) {
      Alert.alert(
        "โหลดสินค้าไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (screenName: ScreenName) => {
    // The Products tab is the full inventory view. Category navigation below
    // sets its filter explicitly when a user asks to view one category.
    if (screenName === "Products") setSelectedCategory(null);
    if (!["Menu", "ProductDetail", "EditProduct"].includes(screenName))
      setPreviousScreen(currentScreen);
    setCurrentScreen(screenName);
  };

  const enterApp = async ({ user }: AuthResponse) => {
    setProfileName(user.displayName);
    setProfileEmail(user.email);
    setProfileStore(user.store);
    setProfileEmpCode(user.employeeCode);
    setProfileRole(user.role);
    setProfileId(user.id);
    setFavoriteIds(await loadFavoriteProductIds(user.id));
    setCartItems(await loadCart(user.id));
    setIsLoggedIn(true);
    setPassword("");
    try {
      setProducts(await getProducts());
    } catch (error) {
      // Authentication has succeeded; a temporary inventory/database issue
      // must not trap the user on the login/register screen.
      Alert.alert(
        "โหลดสินค้าไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอก username และ password");
      return;
    }
    setIsLoading(true);
    try {
      await enterApp(await login({ username: username.trim(), password }));
    } catch (error) {
      Alert.alert(
        "เข้าสู่ระบบไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !password || !confirmPassword)
      return Alert.alert(
        "กรอกข้อมูลไม่ครบ",
        "กรุณากรอก username และ password ให้ครบ",
      );
    if (password !== confirmPassword)
      return Alert.alert(
        "รหัสผ่านไม่ตรงกัน",
        "กรุณากรอกรหัสผ่านให้เหมือนกันทั้งสองช่อง",
      );
    setIsLoading(true);
    try {
      await register({
        username: username.trim(),
        password,
        displayName: registerDisplayName.trim(),
        email: registerEmail.trim(),
      });
      // Sign in immediately so users are not left on the registration form
      // wondering which control to press next.
      await enterApp(await login({ username: username.trim(), password }));
      setRegistering(false);
      setConfirmPassword("");
    } catch (error) {
      Alert.alert(
        "สมัครสมาชิกไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async (product: ProductInput) => {
    try {
      const isEditing = currentScreen === "EditProduct" && selectedProduct;
      if (isEditing) await updateProduct(selectedProduct.id, product);
      else await createProduct(product);
      await loadProducts();
      setSelectedCategory(null);
      setCurrentScreen("Products");
      Alert.alert(
        isEditing ? "บันทึกการแก้ไขสำเร็จ" : "เพิ่มสินค้าสำเร็จ",
        isEditing
          ? `แก้ไขข้อมูลสินค้า “${product.name}” เรียบร้อยแล้ว`
          : `เพิ่มสินค้า “${product.name}” เข้าสู่คลังเรียบร้อยแล้ว`,
      );
    } catch (error) {
      Alert.alert(
        "บันทึกไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    }
  };

  const removeProduct = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      const nextFavorites = favoriteIds.filter(
        (id) => id !== selectedProduct.id,
      );
      setFavoriteIds(nextFavorites);
      if (profileId) await saveFavoriteProductIds(profileId, nextFavorites);
      await loadProducts();
      setCurrentScreen("Products");
      Alert.alert("สำเร็จ", "ลบสินค้าเรียบร้อยแล้ว");
    } catch (error) {
      Alert.alert(
        "ลบไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    }
  };

  const toggleFavorite = async (productId: number) => {
    if (!profileId) return;
    const nextFavorites = favoriteIds.includes(productId)
      ? favoriteIds.filter((id) => id !== productId)
      : [...favoriteIds, productId];
    setFavoriteIds(nextFavorites);
    try {
      await saveFavoriteProductIds(profileId, nextFavorites);
    } catch {
      setFavoriteIds(favoriteIds);
      Alert.alert("บันทึกรายการโปรดไม่สำเร็จ", "กรุณาลองใหม่อีกครั้ง");
    }
  };

  const addToCart = async (product: Product) => {
    const existing = cartItems.find((item) => item.productId === product.id);
    if (existing && existing.quantity >= Number(product.stock))
      return Alert.alert("สินค้าไม่พอ", "จำนวนในตะกร้าถึง stock แล้ว");
    const next = existing
      ? cartItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cartItems, { productId: product.id, quantity: 1 }];
    setCartItems(next);
    if (profileId) await saveCart(profileId, next);
    Alert.alert("เพิ่มลงตะกร้าแล้ว", product.name);
  };

  const changeCartQuantity = async (productId: number, quantity: number) => {
    const next =
      quantity <= 0
        ? cartItems.filter((item) => item.productId !== productId)
        : cartItems.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          );
    setCartItems(next);
    if (profileId) await saveCart(profileId, next);
  };

  const checkout = async (paymentMethod: string, total: number) => {
    setCartItems([]);
    if (profileId) await saveCart(profileId, []);
    Alert.alert(
      "สั่งซื้อสำเร็จ",
      `ชำระเงินผ่าน ${paymentMethod}\nยอดชำระ ฿${total.toLocaleString("th-TH")}`,
    );
  };

  const analyzeInventory = async () => {
    setIsAnalyzing(true);
    try {
      setClusterAnalysis(await getProductClusters());
    } catch (error) {
      Alert.alert(
        "Analysis failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = async () => {
    await clearSession();
    setIsLoggedIn(false);
    setProducts([]);
    setSelectedProduct(null);
    setFavoriteIds([]);
    setCartItems([]);
    setClusterAnalysis(null);
    setProfileId(null);
    setCurrentScreen("Home");
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      const user = await updateMyProfile({
        displayName: profileName,
        email: profileEmail,
        store: profileStore,
        employeeCode: profileEmpCode,
        ...(profilePassword ? { password: profilePassword } : {}),
      });
      setProfileName(user.displayName);
      setProfileEmail(user.email);
      setProfileStore(user.store);
      setProfileEmpCode(user.employeeCode);
      setProfileRole(user.role);
      setProfilePassword("");
      Alert.alert("สำเร็จ", "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
    } catch (error) {
      Alert.alert(
        "บันทึกไม่สำเร็จ",
        error instanceof Error ? error.message : "โปรดลองใหม่",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn)
    return (
      <View style={styles.webOuterWrapper}>
        <SafeAreaView style={styles.phoneContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
          <LoginScreen
            username={username}
            password={password}
            displayName={registerDisplayName}
            email={registerEmail}
            confirmPassword={confirmPassword}
            registering={registering}
            loading={isLoading}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onDisplayNameChange={setRegisterDisplayName}
            onEmailChange={setRegisterEmail}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={() =>
              void (registering ? handleRegister() : handleLogin())
            }
            onToggleMode={() => {
              setRegistering(!registering);
              setPassword("");
              setConfirmPassword("");
            }}
          />
        </SafeAreaView>
      </View>
    );

  if (currentScreen === "Menu")
    return (
      <View style={styles.webOuterWrapper}>
        <SafeAreaView style={styles.phoneContainer}>
          <MenuScreen
            isAdmin={isAdmin}
            onClose={() => setCurrentScreen(previousScreen)}
            onNavigate={navigateTo}
            onLogout={() => void handleLogout()}
          />
        </SafeAreaView>
      </View>
    );

  return (
    <View style={styles.webOuterWrapper}>
      <SafeAreaView style={styles.phoneContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
        <Header
          currentScreen={currentScreen}
          onBackPress={() => setCurrentScreen(previousScreen)}
          onMenuPress={() => navigateTo("Menu")}
          onProfilePress={() => navigateTo("Settings")}
        />
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && <ActivityIndicator size="small" color="#0B0F19" />}
          {currentScreen === "Home" && (
            <HomeDashboard
              stats={dashboardStats}
              profileName={profileName}
              onViewProducts={() => navigateTo("Products")}
              onViewLowStock={() => navigateTo("Products")}
              onViewCategories={() => navigateTo("Categories")}
            />
          )}
          {(currentScreen === "Add" ||
            currentScreen === "AddProduct" ||
            currentScreen === "EditProduct") &&
            isAdmin && (
              <AddProductScreen
                key={
                  currentScreen === "EditProduct" ? selectedProduct?.id : "new"
                }
                product={
                  currentScreen === "EditProduct" ? selectedProduct : null
                }
                onSave={(product) => void saveProduct(product)}
              />
            )}
          {currentScreen === "Products" && (
            <ProductsScreen
              canManage={isAdmin}
              products={products}
              category={selectedCategory}
              favoriteIds={favoriteIds}
              onClearCategory={() => setSelectedCategory(null)}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setPreviousScreen("Products");
                setCurrentScreen("ProductDetail");
              }}
              onAddProduct={() => navigateTo("AddProduct")}
              onToggleFavorite={(id) => void toggleFavorite(id)}
              onAddToCart={(product) => void addToCart(product)}
            />
          )}
          {currentScreen === "Cart" && (
            <CartScreen
              items={cartItems}
              products={products}
              onChangeQuantity={(id, quantity) =>
                void changeCartQuantity(id, quantity)
              }
              onRemove={(id) => void changeCartQuantity(id, 0)}
              onCheckout={(paymentMethod, total) =>
                void checkout(paymentMethod, total)
              }
            />
          )}
          {currentScreen === "Analytics" && (
            <AnalyticsScreen
              analysis={clusterAnalysis}
              loading={isAnalyzing}
              onAnalyze={() => void analyzeInventory()}
            />
          )}
          {currentScreen === "Favorites" && (
            <ProductsScreen
              canManage={false}
              products={products}
              category={null}
              favoriteIds={favoriteIds}
              showFavoritesOnly
              onClearCategory={() => undefined}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                setPreviousScreen("Favorites");
                setCurrentScreen("ProductDetail");
              }}
              onAddProduct={() => undefined}
              onToggleFavorite={(id) => void toggleFavorite(id)}
              onAddToCart={(product) => void addToCart(product)}
            />
          )}
          {currentScreen === "ProductDetail" && selectedProduct && (
            <ProductDetailScreen
              canManage={isAdmin}
              product={selectedProduct}
              isFavorite={favoriteIds.includes(selectedProduct.id)}
              onToggleFavorite={() => void toggleFavorite(selectedProduct.id)}
              onAddToCart={() => void addToCart(selectedProduct)}
              onEdit={() => setCurrentScreen("EditProduct")}
              onDelete={() => void removeProduct()}
            />
          )}
          {currentScreen === "Categories" && (
            <CategoriesScreen
              products={products}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                setPreviousScreen("Categories");
                setCurrentScreen("Products");
              }}
            />
          )}
          {currentScreen === "Settings" && (
            <SettingsScreen
              loading={isLoading}
              profileName={profileName}
              profileEmail={profileEmail}
              profilePassword={profilePassword}
              profileStore={profileStore}
              profileEmpCode={profileEmpCode}
              profileRole={profileRole}
              onChangeName={setProfileName}
              onChangeEmail={setProfileEmail}
              onChangePassword={setProfilePassword}
              onChangeStore={setProfileStore}
              onChangeEmpCode={setProfileEmpCode}
              onChangeRole={setProfileRole}
              onSave={() => void saveProfile()}
            />
          )}
        </ScrollView>
        <BottomTabBar
          isAdmin={isAdmin}
          currentScreen={currentScreen}
          onNavigate={navigateTo}
        />
      </SafeAreaView>
    </View>
  );
}
