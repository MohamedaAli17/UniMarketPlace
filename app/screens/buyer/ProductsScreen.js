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
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onAddToCart, onPress, cartContext, addingToCart }) => {
  const isInCart = cartContext ? cartContext.isInCart(product.id) : false;
  const cartItem = cartContext ? cartContext.getCartItem(product.id) : null;
  const isAdding = addingToCart[product.id] || false;
  
  return (
    <TouchableOpacity style={styles.productCard} onPress={() => onPress(product)}>
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
          onPress={() => onAddToCart(product)}
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

export default function ProductsScreen({ navigation }) {
  const { userProfile, currentUser } = useAuth();
  
  // Safely get products from context
  let products = [];
  try {
    const { products: contextProducts } = useProducts();
    products = contextProducts || [];
  } catch (error) {
    console.log('ProductsScreen: ProductContext not available, using empty array');
    products = [];
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

  // Update filtered products when products change
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
  }, [products, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleProductPress = (product) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Browse Products</Text>
        <Text style={styles.headerSubtitle}>
          Discover amazing products from fellow students and make purchases.
        </Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Anything..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onAddToCart={handleAddToCart} 
            onPress={handleProductPress}
            cartContext={cartContext}
            addingToCart={addingToCart}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  productsList: {
    padding: 16,
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
});
