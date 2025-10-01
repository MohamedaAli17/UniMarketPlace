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
import AddProductScreen from '../AddProductScreen';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product, onBuy }) => (
  <View style={styles.productCard}>
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
        style={[styles.buyBtn, product.stock <= 0 && styles.buyBtnDisabled]} 
        onPress={() => onBuy(product)}
        disabled={product.stock <= 0}
      >
        <Text style={[styles.buyBtnText, product.stock <= 0 && styles.buyBtnTextDisabled]}>
          {product.stock <= 0 ? 'Sold Out' : 'Buy Now'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function ProductsScreen() {
  const { products, addProduct } = useProducts();
  const { userProfile, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

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

  const handleBuy = (product) => {
    Alert.alert('Seller Account', 'You cannot purchase products with a seller account. Switch to a buyer account to make purchases.');
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleProductAdded = (newProduct) => {
    // Pass the current user's ID and name as the seller info
    addProduct(newProduct, currentUser?.uid, userProfile?.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product List</Text>
        <Text style={styles.headerSubtitle}>
          Track stock levels, availability, and restocking needs in real time.
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

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleAddProduct}>
            <Ionicons name="add" size={16} color="#333" />
            <Text style={styles.actionBtnText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="filter" size={16} color="#333" />
            <Text style={styles.actionBtnText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} onBuy={handleBuy} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      <AddProductScreen
        visible={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onAddProduct={handleProductAdded}
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#333',
    fontWeight: '600',
    marginLeft: 8,
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
});
