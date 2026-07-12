import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// คลังข้อมูลสินค้าคอลเลกชันแบรนด์ VANTA ของดรีมมี่
const vantaInventory = [
  { id: '1', name: 'VANTA Denim Dress', price: '฿790', stock: 12, category: 'Dresses', status: 'Active', size: 'S, M, L', imageUrl: 'https://i.pinimg.com/736x/e4/33/9e/e4339e0d1429c4e026e90fad88ed978e.jpg' },
  { id: '2', name: 'VANTA Stripe Maxi', price: '฿650', stock: 10, category: 'Dresses', status: 'Active', size: 'M, L', imageUrl: 'https://i.pinimg.com/1200x/c0/18/71/c01871e6da2cacfeafe01662046fddda.jpg' },
  { id: '3', name: 'Pleated Minimal Dress', price: '฿590', stock: 1, category: 'Dresses', status: 'Low in stock', size: 'Free Size', imageUrl: 'https://i.pinimg.com/1200x/ef/2c/4a/ef2c4a38ffb2519f14845e247d9439a4.jpg' },
  { id: '4', name: 'Smocked Crop Top', price: '฿390', stock: 22, category: 'Tops', status: 'Active', size: 'S, M', imageUrl: 'https://i.pinimg.com/736x/a4/81/c1/a481c1179080938392d459285b7ee8dc.jpg' },
];

const vantaCategories = [
  { id: 'c1', name: 'Bottoms', count: '49 items', icon: '👖' },
  { id: 'c2', name: 'Coats', count: '23 items', icon: '🧥' },
  { id: 'c3', name: 'Jeans', count: '11 items', icon: '🩳' },
  { id: 'c4', name: 'Tops', count: '7 items', icon: '👕' },
  { id: 'c5', name: 'T-shirts', count: '15 items', icon: '👚' },
  { id: 'c6', name: 'Accessories', count: '63 items', icon: '👓' },
];

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentScreen, setCurrentScreen] = useState('Home'); 
  const [previousScreen, setPreviousScreen] = useState('Home');
  const [selectedProduct, setSelectedProduct] = useState(vantaInventory[0]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // สเตตัสข้อมูลโปรไฟล์ส่วนตัว (Personal Settings) เนื้อหาอิงตาม Uizard รูป 2
  const [profileName, setProfileName] = useState('Bantita');
  const [profileEmail, setProfileEmail] = useState('Bantita.rat@ku.ac.th');
  const [profilePassword, setProfilePassword] = useState('password123');
  const [profileStore, setProfileStore] = useState('VANTAShop');
  const [profileEmpCode, setProfileEmpCode] = useState('94-K-6764-LEI');
  const [profileRole, setProfileRole] = useState('Manager');
  
  // ตัวเปิด-ปิดโหมดแก้ไขข้อมูลโปรไฟล์
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const navigateTo = (screenName: string) => {
    if (currentScreen !== 'Menu' && currentScreen !== 'ProductDetail') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen(screenName);
  };

  const handleLogin = () => { setIsLoggedIn(true); setCurrentScreen('Home'); };
  const handleLogout = () => { setIsLoggedIn(false); setUsername(''); setPassword(''); setCurrentScreen('Home'); };

  if (!isLoggedIn) {
    return (
      <View style={styles.webOuterWrapper}>
        <SafeAreaView style={styles.phoneContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
          <View style={styles.loginWrapper}>
            <View style={styles.loginCenterCard}>
              <Text style={styles.loginLogo}>VANTA</Text>
              <Text style={styles.loginSubText}>INVENTORY MANAGEMENT SYSTEM</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput style={styles.loginInput} placeholder="Enter username" placeholderTextColor="#6B7280" value={username} onChangeText={setUsername} autoCapitalize="none" />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput style={styles.loginInput} placeholder="••••••••" placeholderTextColor="#6B7280" secureTextEntry value={password} onChangeText={setPassword} />
              </View>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (currentScreen === 'Menu') {
    return (
      <View style={styles.webOuterWrapper}>
        <SafeAreaView style={styles.phoneContainer}>
          <View style={styles.menuOverlayContainer}>
            <View style={styles.menuHeader}>
              <TouchableOpacity style={styles.clickableArea} onPress={() => setCurrentScreen(previousScreen)}>
                <Text style={styles.closeMenuText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.menuLogo}>VANTA</Text>
              <View style={{ width: 35 }} />
            </View>
            <View style={styles.menuLinksContainer}>
              <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('Home')}><Text style={styles.menuLinkLabel}>🏠 Home Dashboard</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('Add')}><Text style={styles.menuLinkLabel}>➕ Add Product</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('Products')}><Text style={styles.menuLinkLabel}>📦 Products List</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('Categories')}><Text style={styles.menuLinkLabel}>🧬 Categories Summary</Text></TouchableOpacity>
              <TouchableOpacity style={styles.menuLinkItem} onPress={() => navigateTo('Settings')}><Text style={styles.menuLinkLabel}>⚙️ Personal Settings</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.menuLogoutButton} onPress={handleLogout}>
              <Text style={styles.menuLogoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.webOuterWrapper}>
      <SafeAreaView style={styles.phoneContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

        {/* HEADER */}
        <View style={styles.header}>
          {currentScreen === 'ProductDetail' || currentScreen === 'Settings' ? (
            <TouchableOpacity style={styles.clickableArea} onPress={() => setCurrentScreen(previousScreen)}>
              <Text style={styles.headerIcon}>⬅️</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.clickableArea} onPress={() => navigateTo('Menu')}>
              <Text style={styles.headerIcon}>☰</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>VANTA</Text>
          
          {/* ปุ่มโปรไฟล์ตัว "V" ขวาบน -> กดแล้ววิ่งไปหน้า Settings แก้อัลบั้มข้อมูลส่วนตัว */}
          <TouchableOpacity style={styles.profileButton} onPress={() => navigateTo('Settings')}>
            <Text style={styles.profileText}>V</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {/* === HOME DASHBOARD === */}
          {currentScreen === 'Home' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.sectionTitle}>Recent activity</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}><Text style={styles.statNum}>741</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>NEW ITEMS</Text></View>
                <View style={styles.statBox}><Text style={styles.statNum}>123</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>NEW ORDERS</Text></View>
                <View style={styles.statBox}><Text style={styles.statNum}>12</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>REFUNDS</Text></View>
                <View style={styles.statBox}><Text style={styles.statNum}>1</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>MESSAGE</Text></View>
                <View style={styles.statBox}><Text style={styles.statNum}>4</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>GROUPS</Text></View>
                <TouchableOpacity style={[styles.statBox, { backgroundColor: '#EEF2F6' }]} onPress={() => navigateTo('Products')}>
                  <Text style={{ fontSize: 16, marginBottom: 2 }}>➡️</Text>
                  <Text style={[styles.statLabel, { color: '#4F46E5', fontWeight: '800' }]}>VIEW MORE</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Sales Volume</Text>
              <View style={styles.chartMockup}>
                <View style={[styles.chartBar, { height: 45 }]} />
                <View style={[styles.chartBar, { height: 75 }]} />
                <View style={[styles.chartBar, { height: 25 }]} />
                <View style={[styles.chartBar, { height: 80 }]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 4 }}>
                <Text style={styles.chartLabelText}>Confirmed</Text>
                <Text style={styles.chartLabelText}>Pooled</Text>
                <Text style={styles.chartLabelText}>Refunded</Text>
                <Text style={styles.chartLabelText}>Shipped</Text>
              </View>
            </View>
          )}

          {/* === ADD PRODUCT SCREEN === */}
          {currentScreen === 'Add' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.sectionTitleLarge}>Add New Product</Text>
              <View style={styles.formCard}>
                <Text style={styles.formLabel}>Product Name</Text>
                <TextInput style={styles.formInput} placeholder="e.g. VANTA Denim Jeans" placeholderTextColor="#9CA3AF" />
                <Text style={styles.formLabel}>Category</Text>
                <TextInput style={styles.formInput} placeholder="e.g. Bottoms" placeholderTextColor="#9CA3AF" />
                <Text style={styles.formLabel}>Size</Text>
                <TextInput style={styles.formInput} placeholder="e.g. S, M, L, Free Size" placeholderTextColor="#9CA3AF" />
                <Text style={styles.formLabel}>Price (THB)</Text>
                <TextInput style={styles.formInput} placeholder="e.g. 790" keyboardType="numeric" placeholderTextColor="#9CA3AF" />
                <TouchableOpacity style={styles.submitFormBtn} onPress={() => Alert.alert('Success', 'Added successfully!')}>
                  <Text style={styles.submitFormBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* === PRODUCTS LIST SCREEN === */}
          {currentScreen === 'Products' && (
            <View style={{ paddingBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={styles.sectionTitleLarge}>T-Shirts</Text>
                <TouchableOpacity style={styles.actionInlineBtn} onPress={() => navigateTo('Add')}>
                  <Text style={styles.actionBtnText}>+ Add Product</Text>
                </TouchableOpacity>
              </View>
              {vantaInventory.map((item) => (
                <TouchableOpacity key={item.id} style={styles.productCardLarge} onPress={() => { setSelectedProduct(item); setPreviousScreen('Products'); setCurrentScreen('ProductDetail'); }}>
                  <Image source={{ uri: item.imageUrl }} style={styles.productImageLarge} resizeMode="cover" /> 
                  <View style={styles.productInfoLarge}>
                    <Text style={styles.productNameTextLarge}>{item.name}</Text>
                    <Text style={styles.productMetaTextLarge}>Size: {item.size}</Text>
                    <Text style={styles.productMetaTextLarge}>Category: {item.category}</Text>
                  </View>
                  <Text style={styles.priceTagLarge}>{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* === CATEGORIES SCREEN === */}
          {currentScreen === 'Categories' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.sectionTitleLarge}>Categories</Text>
              {vantaCategories.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.categoryRowCard} onPress={() => navigateTo('Products')}>
                  <View style={styles.categoryIconWrapper}><Text>{cat.icon}</Text></View>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.categoryNameText}>{cat.name}</Text>
                    <Text style={styles.categoryCountText}>{cat.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* === SETTINGS SCREEN (คุมโทนสีดำ-เทาเข้ม สไตล์แอปเดิมแมตช์ตามรูป 1) === */}
          {currentScreen === 'Settings' && (
            <View style={{ paddingBottom: 20 }}>
              <Text style={styles.sectionTitleLarge}>Personal Settings</Text>
              
              <View style={[styles.formCard, { marginTop: 12 }]}>
                
                {/* 1. Name */}
                <Text style={styles.formLabel}>Name*</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={profileName} 
                  onChangeText={setProfileName}
                  placeholder="e.g. Dremmy"
                  placeholderTextColor="#9CA3AF"
                />

                {/* 2. Company Email */}
                <Text style={styles.formLabel}>Company email*</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={profileEmail} 
                  onChangeText={setProfileEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="e.g. Bantita.rat@ku.ac.th"
                  placeholderTextColor="#9CA3AF"
                />

                {/* 3. Account Password */}
                <Text style={styles.formLabel}>Account password*</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={profilePassword} 
                  onChangeText={setProfilePassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                />

                {/* 4. Store */}
                <Text style={styles.formLabel}>Store</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={profileStore} 
                  onChangeText={setProfileStore}
                  placeholder="e.g. VANTAShop"
                  placeholderTextColor="#9CA3AF"
                />

                {/* 5. Employee Code */}
                <Text style={styles.formLabel}>Employee code</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={profileEmpCode} 
                  onChangeText={setProfileEmpCode}
                  placeholder="e.g. 94-K-6764-LEI"
                  placeholderTextColor="#9CA3AF"
                />

                {/* 6. Current Role */}
                <Text style={styles.formLabel}>Current role</Text>
                <TextInput 
                  style={styles.formInput} 
                  value={profileRole} 
                  onChangeText={setProfileRole}
                  placeholder="e.g. Manager"
                  placeholderTextColor="#9CA3AF"
                />

                {/* ปุ่มบันทึกดีไซน์สีดำเท่ ๆ ตามปุ่ม Save ในรูป 1 */}
                <TouchableOpacity 
                  style={[styles.submitFormBtn, { marginTop: 8 }]} 
                  onPress={() => Alert.alert('Saved', 'Profile settings updated successfully!')}
                >
                  <Text style={styles.submitFormBtnText}>Save Settings</Text>
                </TouchableOpacity>

              </View>
            </View>
          )}

          {/* === PRODUCT DETAILS SCREEN === */}
          {currentScreen === 'ProductDetail' && (
            <View style={{ alignItems: 'center', paddingBottom: 20 }}>
              <View style={styles.detailCard}>
                <Image source={{ uri: selectedProduct.imageUrl }} style={styles.detailImage} resizeMode="contain" />
                <Text style={styles.detailTitle}>{selectedProduct.name}</Text>
                
                <View style={styles.detailRow}><Text style={styles.detailSectionLabel}>Price:</Text><Text style={styles.detailValueText}>{selectedProduct.price}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailSectionLabel}>Stock:</Text><Text style={styles.detailValueText}>{selectedProduct.stock}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailSectionLabel}>Size:</Text><Text style={styles.detailValueText}>{selectedProduct.size}</Text></View>
                
                <View style={styles.qrCodeWrapper}>
                  <Text style={styles.qrLabel}>Product QR Code</Text>
                  <Image 
                    source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(selectedProduct.name) }} 
                    style={styles.qrImageMock} 
                  />
                  <Text style={styles.qrSubText}>Scan to manage inventory item</Text>
                </View>
              </View>
            </View>
          )}

        </ScrollView>

        {/* BOTTOM TAB BAR */}
        <View style={styles.fixedBottomTabContainer}>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('Home')}>
            <Text style={[styles.tabIcon, currentScreen === 'Home' && styles.tabActive]}>🏠</Text>
            <Text style={[styles.tabLabel, currentScreen === 'Home' && styles.tabActive]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('Add')}>
            <Text style={[styles.tabIcon, currentScreen === 'Add' && styles.tabActive]}>➕</Text>
            <Text style={[styles.tabLabel, currentScreen === 'Add' && styles.tabActive]}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('Products')}>
            <Text style={[styles.tabIcon, currentScreen === 'Products' && styles.tabActive]}>📦</Text>
            <Text style={[styles.tabLabel, currentScreen === 'Products' && styles.tabActive]}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('Categories')}>
            <Text style={[styles.tabIcon, currentScreen === 'Categories' && styles.tabActive]}>🧬</Text>
            <Text style={[styles.tabLabel, currentScreen === 'Categories' && styles.tabActive]}>Categories</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webOuterWrapper: { flex: 1, backgroundColor: '#0F172A', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  phoneContainer: { flex: 1, backgroundColor: '#F3F4F6', width: '100%', maxWidth: 390, height: '100%', maxHeight: 760, overflow: 'hidden', position: 'relative', marginTop: 45, borderRadius: 12 },
  
  loginWrapper: { flex: 1, backgroundColor: '#0B0F19', justifyContent: 'center', alignItems: 'center', padding: 24 },
  loginCenterCard: { width: '100%', alignItems: 'center' },
  loginLogo: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4, marginBottom: 4 },
  loginSubText: { fontSize: 8, color: '#9CA3AF', fontWeight: '700', marginBottom: 32 },
  inputGroup: { width: '100%', marginBottom: 16 },
  inputLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', marginBottom: 6 },
  loginInput: { backgroundColor: '#1F2937', borderRadius: 8, height: 44, paddingHorizontal: 14, color: '#FFFFFF', fontSize: 13 },
  loginButton: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 8, height: 44, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  loginButtonText: { color: '#0B0F19', fontWeight: '900' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, height: 52, backgroundColor: '#0B0F19', zIndex: 9999 },
  clickableArea: { padding: 10 },
  headerIcon: { fontSize: 16, color: '#FFF' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  profileButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#0B0F19', fontWeight: '900', fontSize: 12 },
  
  scrollArea: { flex: 1, padding: 12, marginBottom: 54 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0B0F19', marginBottom: 10, marginTop: 4 },
  sectionTitleLarge: { fontSize: 16, fontWeight: '800', color: '#0B0F19' },

  formCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 0.5, borderColor: '#E5E7EB' },
  formLabel: { fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 6 },
  formInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, height: 40, paddingHorizontal: 12, fontSize: 12, marginBottom: 14, color: '#111827' },
  submitFormBtn: { backgroundColor: '#0B0F19', height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  submitFormBtnText: { color: '#FFF', fontWeight: '800' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '31%', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center', height: 75, justifyContent: 'center', borderWidth: 0.5, borderColor: '#E5E7EB' },
  statNum: { fontSize: 15, fontWeight: '900', color: '#0B0F19' },
  statSub: { fontSize: 8, color: '#9CA3AF', fontWeight: '600' },
  statLabel: { fontSize: 8, color: '#374151', textAlign: 'center', fontWeight: '700', marginTop: 2 },
  
  chartMockup: { flexDirection: 'row', height: 90, backgroundColor: '#E0DBFA', borderRadius: 12, alignItems: 'flex-end', justifyContent: 'space-around', padding: 12, marginTop: 6 },
  chartBar: { width: 14, backgroundColor: '#5B21B6', borderRadius: 4 },
  chartLabelText: { fontSize: 8, color: '#6B7280', fontWeight: '600' },

  categoryRowCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  categoryIconWrapper: { width: 36, height: 36, borderRadius: 6, backgroundColor: '#EEF2F6', justifyContent: 'center', alignItems: 'center' },
  categoryNameText: { fontSize: 13, fontWeight: '700' },
  categoryCountText: { fontSize: 10, color: '#6B7280' },
  actionInlineBtn: { backgroundColor: '#0B0F19', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  actionBtnText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  productCardLarge: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 12, marginBottom: 10, alignItems: 'center' },
  productImageLarge: { width: 60, height: 60, borderRadius: 10 }, 
  productInfoLarge: { flex: 1, paddingLeft: 12 },
  productNameTextLarge: { fontSize: 13, fontWeight: '800' }, 
  productMetaTextLarge: { fontSize: 10, color: '#6B7280' },
  priceTagLarge: { fontSize: 13, fontWeight: '900' },

  detailCard: { backgroundColor: '#FFF', width: '100%', borderRadius: 12, padding: 16 },
  detailImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12 },
  detailTitle: { fontSize: 16, fontWeight: '900', color: '#0B0F19', marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6' },
  detailSectionLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  detailValueText: { fontSize: 12, fontWeight: '800', color: '#0B0F19' },
  
  qrCodeWrapper: { alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', borderStyle: 'dashed' },
  qrLabel: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 8 },
  qrImageMock: { width: 110, height: 110, backgroundColor: '#F3F4F6', padding: 6, borderRadius: 6 },
  qrSubText: { fontSize: 9, color: '#9CA3AF', marginTop: 6, fontWeight: '600' },
  
  fixedBottomTabContainer: { flexDirection: 'row', backgroundColor: '#0B0F19', height: 54, width: '100%', position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderColor: '#1F2937', zIndex: 9999 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 13, color: '#6B7280' },
  tabLabel: { fontSize: 8, color: '#6B7280', marginTop: 2 },
  tabActive: { color: '#FFF' },

  menuOverlayContainer: { flex: 1, backgroundColor: '#0B0F19', padding: 24 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 },
  closeMenuText: { fontSize: 22, color: '#FFF' },
  menuLogo: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  menuLinksContainer: { flex: 1 },
  menuLinkItem: { paddingVertical: 16 },
  menuLinkLabel: { fontSize: 14, color: '#FFF' },
  menuLogoutButton: { paddingVertical: 16, alignItems: 'center' },
  menuLogoutText: { color: '#EF4444', fontWeight: '700' }
});