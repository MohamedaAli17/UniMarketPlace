import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Import context
import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';

// Import components
import OfflineIndicator from './components/OfflineIndicator';

// Import utils
import { testFirebaseConnection, testAuthConnection } from './utils/firebaseTest';

// Import screens
import HomeScreen from './screens/buyer/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/seller/DashboardScreen';
import BuyerProductsScreen from './screens/buyer/ProductsScreen';
import SellerProductsScreen from './screens/seller/ProductsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import MessagingScreen from './screens/MessagingScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import OrdersScreen from './screens/OrdersScreen';
import MarketingScreen from './screens/MarketingScreen';
import ProfileScreen from './screens/ProfileScreen';
import SellerProfileScreen from './screens/SellerProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PrivacySecurityScreen from './screens/PrivacySecurityScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import ContactUsScreen from './screens/ContactUsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Loading Screen Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6c5ce7" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main App Navigator (for authenticated users)
const MainAppNavigator = () => {
  const { userProfile } = useAuth();
  
  // Debug logging
  console.log('MainAppNavigator - userProfile:', userProfile);
  console.log('MainAppNavigator - accountType:', userProfile?.accountType);
  
  // Seller tabs
  const SellerTabs = () => (
    <Stack.Navigator>
      <Stack.Screen 
        name="SellerMain" 
        options={{ headerShown: false }}
      >
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Dashboard') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Products') {
                  iconName = focused ? 'cube' : 'cube-outline';
                } else if (route.name === 'Orders') {
                  iconName = focused ? 'bag' : 'bag-outline';
                } else if (route.name === 'Marketing') {
                  iconName = focused ? 'megaphone' : 'megaphone-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#6c5ce7',
              tabBarInactiveTintColor: 'gray',
              headerStyle: { backgroundColor: '#6c5ce7' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            })}
          >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Seller Dashboard' }} />
            <Tab.Screen name="Products" component={SellerProductsScreen} options={{ title: 'All Products' }} />
            <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
            <Tab.Screen name="Marketing" component={MarketingScreen} options={{ title: 'Marketing' }} />
            <Tab.Screen name="Profile" component={SellerProfileScreen} options={{ title: 'Profile' }} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Messaging" 
        component={MessagingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmationScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PrivacySecurity" 
        component={PrivacySecurityScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ContactUs" 
        component={ContactUsScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );

  // Buyer tabs
  const BuyerTabs = () => (
    <Stack.Navigator>
      <Stack.Screen 
        name="BuyerMain" 
        options={{ headerShown: false }}
      >
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Products') {
                  iconName = focused ? 'cube' : 'cube-outline';
                } else if (route.name === 'Orders') {
                  iconName = focused ? 'bag' : 'bag-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#6c5ce7',
              tabBarInactiveTintColor: 'gray',
              headerStyle: { backgroundColor: '#6c5ce7' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Sellora' }} />
            <Tab.Screen name="Products" component={BuyerProductsScreen} options={{ title: 'Products' }} />
            <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Messaging" 
        component={MessagingScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmationScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PrivacySecurity" 
        component={PrivacySecurityScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="HelpCenter" 
        component={HelpCenterScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ContactUs" 
        component={ContactUsScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );

  // Show loading if userProfile is not loaded yet
  if (!userProfile) {
    return <LoadingScreen />;
  }
  
  return userProfile.accountType === 'seller' ? <SellerTabs /> : <BuyerTabs />;
};

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main App Component
const AppNavigator = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return currentUser ? <MainAppNavigator /> : <AuthStack />;
};

export default function App() {
  useEffect(() => {
    // Test Firebase connection on app start
    const testConnection = async () => {
      console.log('🔍 Testing Firebase connection...');
      await testFirebaseConnection();
      await testAuthConnection();
    };
    
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrdersProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <OfflineIndicator />
              <AppNavigator />
            </NavigationContainer>
          </OrdersProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});