import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';

const HomeScreen = ({ navigation }) => {
  const { currentUser, userProfile } = useAuth();
  
  // Only use products if user is authenticated (to avoid context errors in AuthStack)
  let products = [];
  if (currentUser) {
    try {
      const { products: contextProducts } = useProducts();
      products = contextProducts || [];
    } catch (error) {
      products = [];
    }
  }

  // Safely get cart context
  let cartContext = null;
  try {
    cartContext = useCart();
  } catch (error) {
    // Cart context not available
    cartContext = null;
  }
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [addingToCart, setAddingToCart] = useState({});

  // Update filtered products when search query or products change
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleProductPress = (product) => {
    if (!currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to view product details and make purchases.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    // Navigate to product details
    navigation.navigate('ProductDetail', { product });
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to add products to cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    
    if (userProfile?.accountType === 'seller') {
      Alert.alert('Seller Account', 'You cannot add products to cart with a seller account. Switch to a buyer account to make purchases.');
      return;
    }

    if (!cartContext) {
      Alert.alert('Error', 'Cart functionality is not available. Please try again.');
      return;
    }

    if (product.stock <= 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    // Check if product is already in cart
    const existingCartItem = cartContext.getCartItem(product.id);
    if (existingCartItem && existingCartItem.quantity >= product.stock) {
      Alert.alert('Stock Limit', `You can only add ${product.stock} of this item to your cart.`);
      return;
    }

    // Start adding animation
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    // Simulate adding to cart with animation
    setTimeout(() => {
      // Add to cart
      cartContext.addToCart(product, 1);
      
      // Stop animation
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
      
      // Show success message
      Alert.alert(
        'Added to Cart! 🛒',
        `${product.name} has been added to your cart successfully!`,
        [{ text: 'Great!' }]
      );
    }, 1000); // 1 second animation
  };

const ProductCard = ({ product }) => {
  const isInCart = cartContext ? cartContext.isInCart(product.id) : false;
  const cartItem = cartContext ? cartContext.getCartItem(product.id) : null;
  const isAdding = addingToCart[product.id] || false;
  
  return (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
        {product.sellerName && (
          <Text style={styles.sellerName}>Sold by: {product.sellerName}</Text>
        )}
        <View style={styles.productFooter}>
          <Text style={[
            styles.stockStatus,
            { backgroundColor: product.stock <= 0 ? '#f8d7da' : product.stock <= 5 ? '#fff3cd' : '#d4edda' }
          ]}>
            {product.stock <= 0 ? 'Sold Out' : product.stock <= 5 ? 'Low Stock' : 'In Stock'}
          </Text>
          <Text style={styles.productPrice}>£{product.price}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.buyBtn, 
            product.stock <= 0 && styles.buyBtnDisabled,
            isInCart && styles.buyBtnInCart,
            isAdding && styles.buyBtnAdding
          ]} 
          onPress={() => handleAddToCart(product)}
          disabled={product.stock <= 0 || isAdding}
        >
          {isAdding ? (
            <View style={styles.addingContainer}>
              <Ionicons name="cart" size={16} color="white" />
              <Text style={styles.buyBtnText}>Adding...</Text>
            </View>
          ) : (
            <Text style={[
              styles.buyBtnText, 
              product.stock <= 0 && styles.buyBtnTextDisabled,
              isInCart && styles.buyBtnTextInCart
            ]}>
              {product.stock <= 0 
                ? 'Sold Out' 
                : isInCart 
                  ? `In Cart (${cartItem?.quantity || 1})` 
                  : 'Add to Cart'
              }
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Ionicons name="star" size={24} color="#6c5ce7" />
            <Text style={styles.logoText}>Sellora</Text>
          </View>
          <View style={styles.headerButtons}>
            {currentUser && cartContext && (
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={() => navigation.navigate('Cart')}
              >
                <Ionicons name="cart" size={24} color="#6c5ce7" />
                {cartContext.getCartItemCount() > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {cartContext.getCartItemCount()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            {currentUser ? (
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Ionicons name="person-circle" size={32} color="#6c5ce7" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <Text style={styles.welcomeText}>
          {currentUser ? `Welcome back, ${userProfile?.name || 'User'}!` : 'Welcome to Sellora'}
        </Text>
        <Text style={styles.subtitle}>
          {currentUser 
            ? userProfile?.accountType === 'seller' 
              ? 'Manage your products, track sales, and promote your listings'
              : 'Discover amazing products from fellow students and make purchases'
            : 'University marketplace for students'
          }
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {!currentUser && (
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Join the Marketplace</Text>
          <Text style={styles.ctaDescription}>
            Sign up to buy and sell products with fellow Brunel students
          </Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.ctaButtonSecondary}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.ctaButtonSecondaryText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Search Results (${filteredProducts.length})` : 'Featured Products'}
        </Text>
        
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No products found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search terms</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  profileButton: {
    padding: 4,
  },
  signInButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  signInButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  ctaSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  ctaButtonSecondary: {
    borderWidth: 1,
    borderColor: '#6c5ce7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonSecondaryText: {
    color: '#6c5ce7',
    fontWeight: '600',
  },
  productsSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 11,
    color: '#6c5ce7',
    marginBottom: 8,
    fontWeight: '500',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buyBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyBtnDisabled: {
    backgroundColor: '#6c757d',
  },
  buyBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  buyBtnTextDisabled: {
    color: '#ccc',
  },
  buyBtnInCart: {
    backgroundColor: '#28a745',
  },
  buyBtnTextInCart: {
    color: 'white',
  },
  buyBtnAdding: {
    backgroundColor: '#ffc107',
  },
  addingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
    marginRight: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default HomeScreen;
