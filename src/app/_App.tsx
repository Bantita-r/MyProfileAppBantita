import { useState } from 'react';
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('Home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(vantaInventory[0]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
            <ProductsScreen onSelectProduct={handleSelectProduct} onAddProduct={() => navigateTo('Add')} />
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