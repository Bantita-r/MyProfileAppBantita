import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Product, ScreenName, vantaCategories } from './_data';
import { styles } from './_styles';

// ================= LOGIN =================
interface LoginScreenProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
}

export function LoginScreen({ username, password, onUsernameChange, onPasswordChange, onLogin }: LoginScreenProps) {
  return (
    <View style={styles.loginWrapper}>
      <View style={styles.loginCenterCard}>
        <Text style={styles.loginLogo}>VANTA</Text>
        <Text style={styles.loginSubText}>INVENTORY MANAGEMENT SYSTEM</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="Enter username"
            placeholderTextColor="#6B7280"
            value={username}
            onChangeText={onUsernameChange}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.loginInput}
            placeholder="••••••••"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={onPasswordChange}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ================= MENU =================
interface MenuScreenProps {
  onClose: () => void;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
}

export function MenuScreen({ onClose, onNavigate, onLogout }: MenuScreenProps) {
  return (
    <View style={styles.menuOverlayContainer}>
      <View style={styles.menuHeader}>
        <TouchableOpacity style={styles.clickableArea} onPress={onClose}>
          <Text style={styles.closeMenuText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.menuLogo}>VANTA</Text>
        <View style={{ width: 35 }} />
      </View>
      <View style={styles.menuLinksContainer}>
        <TouchableOpacity style={styles.menuLinkItem} onPress={() => onNavigate('Home')}>
          <Text style={styles.menuLinkLabel}>🏠 Home Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuLinkItem} onPress={() => onNavigate('Add')}>
          <Text style={styles.menuLinkLabel}>➕ Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuLinkItem} onPress={() => onNavigate('Products')}>
          <Text style={styles.menuLinkLabel}>📦 Products List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuLinkItem} onPress={() => onNavigate('Categories')}>
          <Text style={styles.menuLinkLabel}>🧬 Categories Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuLinkItem} onPress={() => onNavigate('Settings')}>
          <Text style={styles.menuLinkLabel}>⚙️ Personal Settings</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.menuLogoutButton} onPress={onLogout}>
        <Text style={styles.menuLogoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

// ================= HOME DASHBOARD =================
interface HomeDashboardProps {
  onViewMore: () => void;
}

export function HomeDashboard({ onViewMore }: HomeDashboardProps) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <Text style={styles.sectionTitle}>Recent activity</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}><Text style={styles.statNum}>741</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>NEW ITEMS</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>123</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>NEW ORDERS</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>12</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>REFUNDS</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>1</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>MESSAGE</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>4</Text><Text style={styles.statSub}>Qty</Text><Text style={styles.statLabel}>GROUPS</Text></View>
        <TouchableOpacity style={[styles.statBox, { backgroundColor: '#EEF2F6' }]} onPress={onViewMore}>
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
  );
}

// ================= ADD PRODUCT =================
export  function AddProductScreen() {
  return (
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
  );
}

// ================= PRODUCTS LIST =================
interface ProductsScreenProps {
  products: any[];
  onSelectProduct: (product: Product) => void;
  onAddProduct: () => void;
}

export function ProductsScreen({ products,onSelectProduct, onAddProduct }: ProductsScreenProps) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={styles.sectionTitleLarge}>T-Shirts</Text>
        <TouchableOpacity style={styles.actionInlineBtn} onPress={onAddProduct}>
          <Text style={styles.actionBtnText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>
      {products.map((item) => (
  <TouchableOpacity 
    key={item.id} 
    onPress={() => onSelectProduct(item)} 
    style={{ 
      backgroundColor: '#fff',
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3
    }}
  >
    <Image 
      source={{ uri: item.image_url }} 
      style={{ width: 80, height: 80, borderRadius: 10 }} 
    />
    <View style={{ marginLeft: 15, flex: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>Size: {item.size}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>Category: {item.category}</Text>
    </View>
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>฿{item.price}</Text>
  </TouchableOpacity>
))}
    </View>
  );
}

// ================= CATEGORIES =================
interface CategoriesScreenProps {
  onSelectCategory: () => void;
}

export function CategoriesScreen({ onSelectCategory }: CategoriesScreenProps) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <Text style={styles.sectionTitleLarge}>Categories</Text>
      {vantaCategories.map((cat) => (
        <TouchableOpacity key={cat.id} style={styles.categoryRowCard} onPress={onSelectCategory}>
          <View style={styles.categoryIconWrapper}><Text>{cat.icon}</Text></View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.categoryNameText}>{cat.name}</Text>
            <Text style={styles.categoryCountText}>{cat.count}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ================= SETTINGS =================
interface SettingsScreenProps {
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
}

// สเตตัสข้อมูลโปรไฟล์ส่วนตัว (Personal Settings) เนื้อหาอิงตาม Uizard รูป 2
export function SettingsScreen({
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
}: SettingsScreenProps) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <Text style={styles.sectionTitleLarge}>Personal Settings</Text>

      <View style={[styles.formCard, { marginTop: 12 }]}>
        <Text style={styles.formLabel}>Name*</Text>
        <TextInput style={styles.formInput} value={profileName} onChangeText={onChangeName} placeholder="e.g. Dremmy" placeholderTextColor="#9CA3AF" />

        <Text style={styles.formLabel}>Company email*</Text>
        <TextInput style={styles.formInput} value={profileEmail} onChangeText={onChangeEmail} keyboardType="email-address" autoCapitalize="none" placeholder="e.g. Bantita.rat@ku.ac.th" placeholderTextColor="#9CA3AF" />

        <Text style={styles.formLabel}>Account password*</Text>
        <TextInput style={styles.formInput} value={profilePassword} onChangeText={onChangePassword} secureTextEntry placeholder="••••••••" placeholderTextColor="#9CA3AF" />

        <Text style={styles.formLabel}>Store</Text>
        <TextInput style={styles.formInput} value={profileStore} onChangeText={onChangeStore} placeholder="e.g. VANTAShop" placeholderTextColor="#9CA3AF" />

        <Text style={styles.formLabel}>Employee code</Text>
        <TextInput style={styles.formInput} value={profileEmpCode} onChangeText={onChangeEmpCode} placeholder="e.g. 94-K-6764-LEI" placeholderTextColor="#9CA3AF" />

        <Text style={styles.formLabel}>Current role</Text>
        <TextInput style={styles.formInput} value={profileRole} onChangeText={onChangeRole} placeholder="e.g. Manager" placeholderTextColor="#9CA3AF" />

        {/* ปุ่มบันทึกดีไซน์สีดำเท่ ๆ ตามปุ่ม Save ในรูป 1 */}
        <TouchableOpacity style={[styles.submitFormBtn, { marginTop: 8 }]} onPress={() => Alert.alert('Saved', 'Profile settings updated successfully!')}>
          <Text style={styles.submitFormBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ================= PRODUCT DETAIL =================
interface ProductDetailScreenProps {
  product: Product;
}

export function ProductDetailScreen({ product }: ProductDetailScreenProps) {
  return (
    <View style={{ alignItems: 'center', paddingBottom: 20 }}>
      <View style={styles.detailCard}>
        <Image source={{ uri: `http://119.59.102.161:3026/images/${encodeURIComponent(product.image.trim())}` }} style={styles.detailImage} 
  resizeMode="contain" />
        <Text style={styles.detailTitle}>{product.name}</Text>

        <View style={styles.detailRow}><Text style={styles.detailSectionLabel}>Price:</Text><Text style={styles.detailValueText}>{product.price}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailSectionLabel}>Stock:</Text><Text style={styles.detailValueText}>{product.stock}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailSectionLabel}>Size:</Text><Text style={styles.detailValueText}>{product.size}</Text></View>

        <View style={styles.qrCodeWrapper}>
          <Text style={styles.qrLabel}>Product QR Code</Text>
          <Image
            source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(product.name) }}
            style={styles.qrImageMock}
          />
          <Text style={styles.qrSubText}>Scan to manage inventory item</Text>
        </View>
      </View>
    </View>
  );
}