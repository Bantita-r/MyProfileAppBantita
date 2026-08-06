import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { BottomTabBar, Header } from './_components';
import { Product, ScreenName, vantaInventory } from './_data';
import {
  AddProductScreen,
  CategoriesScreen,
  HomeDashboard,
  LoginScreen,
  MenuScreen,
  ProductDetailScreen,
  ProductsScreen,
  SettingsScreen,
} from './_screens';
import { styles } from './_styles';

  
//const PRODUCTS_URL = 
//'https://raw.githubusercontent.com/Bantita-r/MyProfileAppBantita/refs/heads/main/products.json';
const API_BASE_URL = 'http://119.59.102.161:3026/api/products';
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('Home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(vantaInventory[0]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<any[]>([]);
 useEffect(() => {
  async function loadProducts() {
    try {
      console.log("กำลังจะไปดึงข้อมูลจาก:", API_BASE_URL); // เพิ่มบรรทัดนี้
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้');
      }

      const data = await response.json();
      console.log("ได้ข้อมูลมาแล้ว:", data); // เพิ่มบรรทัดนี้
      setProducts(data);
    } catch (error) {
      console.error("Error เกิดขึ้นที่นี่:", error); // เพิ่มบรรทัดนี้
    }
  }
  loadProducts();
}, []);
  // สเตตัสข้อมูลโปรไฟล์ส่วนตัว (Personal Settings) เนื้อหาอิงตาม Uizard รูป 2
  const [profileName, setProfileName] = useState('Bantita');
  const [profileEmail, setProfileEmail] = useState('Bantita.rat@ku.ac.th');
  const [profilePassword, setProfilePassword] = useState('password123');
  const [profileStore, setProfileStore] = useState('VANTAShop');
  const [profileEmpCode, setProfileEmpCode] = useState('94-K-6764-LEI');
  const [profileRole, setProfileRole] = useState('Manager');

  const navigateTo = (screenName: ScreenName) => {
    if (currentScreen !== 'Menu' && currentScreen !== 'ProductDetail') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen(screenName);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('Home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setCurrentScreen('Home');
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setPreviousScreen('Products');
    setCurrentScreen('ProductDetail');
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.webOuterWrapper}>
        <SafeAreaView style={styles.phoneContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
          <LoginScreen
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onLogin={handleLogin}
          />
        </SafeAreaView>
      </View>
    );
  }

  if (currentScreen === 'Menu') {
    return (
      <View style={styles.webOuterWrapper}>
        <SafeAreaView style={styles.phoneContainer}>
          <MenuScreen onClose={() => setCurrentScreen(previousScreen)} onNavigate={navigateTo} onLogout={handleLogout} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.webOuterWrapper}>
      <SafeAreaView style={styles.phoneContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        <Header
          currentScreen={currentScreen}
          onBackPress={() => setCurrentScreen(previousScreen)}
          onMenuPress={() => navigateTo('Menu')}
          onProfilePress={() => navigateTo('Settings')}
        />

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {currentScreen === 'Home' && <HomeDashboard onViewMore={() => navigateTo('Products')} />}

          {currentScreen === 'Add' && <AddProductScreen />}

          {currentScreen === 'Products' && (
            <ProductsScreen
            products={products} 
            onSelectProduct={handleSelectProduct} onAddProduct={() => navigateTo('Add')} />
          )}

          {currentScreen === 'Categories' && <CategoriesScreen onSelectCategory={() => navigateTo('Products')} />}

          {currentScreen === 'Settings' && (
            <SettingsScreen
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
            />
          )}

          {currentScreen === 'ProductDetail' && <ProductDetailScreen product={selectedProduct} />}
        </ScrollView>

        <BottomTabBar currentScreen={currentScreen} onNavigate={navigateTo} />
      </SafeAreaView>
    </View>
  );
}