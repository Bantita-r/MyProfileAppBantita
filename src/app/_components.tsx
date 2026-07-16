import { Text, TouchableOpacity, View } from 'react-native';
import { ScreenName } from './_data';
import { styles } from './_styles';

interface HeaderProps {
  currentScreen: ScreenName;
  onBackPress: () => void;
  onMenuPress: () => void;
  onProfilePress: () => void;
}

export function Header({ currentScreen, onBackPress, onMenuPress, onProfilePress }: HeaderProps) {
  const showBackButton = currentScreen === 'ProductDetail' || currentScreen === 'Settings';

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity style={styles.clickableArea} onPress={onBackPress}>
          <Text style={styles.headerIcon}>⬅️</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.clickableArea} onPress={onMenuPress}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitle}>VANTA</Text>

      {/* ปุ่มโปรไฟล์ตัว "V" ขวาบน -> กดแล้ววิ่งไปหน้า Settings แก้อัลบั้มข้อมูลส่วนตัว */}
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
        <Text style={styles.profileText}>V</Text>
      </TouchableOpacity>
    </View>
  );
}

interface BottomTabBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const TABS: { screen: ScreenName; icon: string; label: string }[] = [
  { screen: 'Home', icon: '🏠', label: 'Home' },
  { screen: 'Add', icon: '➕', label: 'Add' },
  { screen: 'Products', icon: '📦', label: 'Products' },
  { screen: 'Categories', icon: '🧬', label: 'Categories' },
];

export function BottomTabBar({ currentScreen, onNavigate }: BottomTabBarProps) {
  return (
    <View style={styles.fixedBottomTabContainer}>
      {TABS.map((tab) => (
        <TouchableOpacity key={tab.screen} style={styles.tabItem} onPress={() => onNavigate(tab.screen)}>
          <Text style={[styles.tabIcon, currentScreen === tab.screen && styles.tabActive]}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, currentScreen === tab.screen && styles.tabActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}