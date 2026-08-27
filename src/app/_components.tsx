import { SymbolView } from "expo-symbols";
import { ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScreenName } from "./_data";
import { styles } from "./_styles";

type IconName = ComponentProps<typeof SymbolView>["name"];
const ICONS = {
  menu: { ios: "line.3.horizontal", android: "menu", web: "menu" },
  back: { ios: "chevron.left", android: "arrow_back", web: "arrow_back" },
  profile: { ios: "person.fill", android: "person", web: "person" },
  home: { ios: "house.fill", android: "home", web: "home" },
  add: { ios: "plus", android: "add", web: "add" },
  products: {
    ios: "shippingbox.fill",
    android: "inventory_2",
    web: "inventory_2",
  },
  categories: {
    ios: "square.grid.2x2.fill",
    android: "grid_view",
    web: "grid_view",
  },
  heart: { ios: "heart.fill", android: "favorite", web: "favorite" },
  heartOutline: {
    ios: "heart",
    android: "favorite_border",
    web: "favorite_border",
  },
  cart: { ios: "cart.fill", android: "shopping_cart", web: "shopping_cart" },
  arrow: { ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" },
} satisfies Record<string, IconName>;

export type AppIconName = keyof typeof ICONS;
export function AppIcon({
  name,
  size = 20,
  color = "#192A46",
}: {
  name: AppIconName;
  size?: number;
  color?: string;
}) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} />;
}

interface HeaderProps {
  currentScreen: ScreenName;
  onBackPress: () => void;
  onMenuPress: () => void;
  onProfilePress: () => void;
}
export function Header({
  currentScreen,
  onBackPress,
  onMenuPress,
  onProfilePress,
}: HeaderProps) {
  const showBackButton = [
    "ProductDetail",
    "Settings",
    "AddProduct",
    "EditProduct",
    "Favorites",
  ].includes(currentScreen);
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={showBackButton ? onBackPress : onMenuPress}
        accessibilityLabel={showBackButton ? "ย้อนกลับ" : "เมนู"}
      >
        <AppIcon name={showBackButton ? "back" : "menu"} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerBrand}>
        <Text style={styles.headerTitle}>VANTA</Text>
        <Text style={styles.headerSubtitle}>INVENTORY</Text>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={onProfilePress}
        accessibilityLabel="ตั้งค่าโปรไฟล์"
      >
        <AppIcon name="profile" size={17} color="#192A46" />
      </TouchableOpacity>
    </View>
  );
}

interface BottomTabBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  isAdmin: boolean;
}
const TABS: { screen: ScreenName; icon: AppIconName; label: string }[] = [
  { screen: "Home", icon: "home", label: "Home" },
  { screen: "Products", icon: "products", label: "Products" },
  { screen: "Cart", icon: "cart", label: "Cart" },
  { screen: "Favorites", icon: "heartOutline", label: "Saved" },
  { screen: "Categories", icon: "categories", label: "Categories" },
  { screen: "Add", icon: "add", label: "Add" },
];
export function BottomTabBar({
  currentScreen,
  onNavigate,
  isAdmin,
}: BottomTabBarProps) {
  return (
    <View style={styles.fixedBottomTabContainer}>
      {TABS.filter((tab) => isAdmin || tab.screen !== "Add").map((tab) => {
        const isActive = currentScreen === tab.screen;
        return (
          <TouchableOpacity
            key={tab.screen}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            onPress={() => onNavigate(tab.screen)}
          >
            <AppIcon
              name={isActive && tab.screen === "Favorites" ? "heart" : tab.icon}
              size={20}
              color={isActive ? "#E8B44F" : "#AAB6C8"}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
