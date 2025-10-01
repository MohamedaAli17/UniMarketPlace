import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddProductScreen from '../AddProductScreen';
import EditProductScreen from '../EditProductScreen';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, title, value, color = '#6c5ce7' }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={[styles.statIcon, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color="white" />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const ProductCard = ({ product, onEdit, onDelete }) => (
  <View style={styles.productCard}>
    <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productCategory}>{product.category}</Text>
      <View style={styles.productFooter}>
        <Text style={[
          styles.stockStatus,
          { backgroundColor: product.stock <= 0 ? '#f8d7da' : product.stock <= 5 ? '#fff3cd' : '#d4edda' }
        ]}>
          {product.stock <= 0 ? 'Sold Out' : product.stock <= 5 ? 'Low Stock' : 'In Stock'}
        </Text>
        <Text style={styles.productPrice}>£{product.price}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(product.id)}>
          <Ionicons name="create-outline" size={16} color="#6c5ce7" />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(product.id)}>
          <Ionicons name="trash-outline" size={16} color="#dc3545" />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export default function DashboardScreen() {
  const { products, getUserProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { userProfile, currentUser } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Check if user is a seller
  const isSeller = userProfile?.accountType === 'seller';
  
  // If user is not a seller, show access denied message
  if (!isSeller) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Ionicons name="lock-closed" size={64} color="#dc3545" />
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedMessage}>
          This dashboard is only available for Business Account (Seller) users.
        </Text>
        <Text style={styles.accessDeniedSubtext}>
          You need a seller account to access product management features.
        </Text>
      </View>
    );
  }
  
  // Get user's products - this will automatically update when products array changes
  const userProducts = products.filter(p => p.sellerId === currentUser?.uid);

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleProductAdded = (newProduct) => {
    // Pass the current user's ID and name as the seller info
    addProduct(newProduct, currentUser?.uid, userProfile?.name);
  };

  const handleEditProduct = (productId) => {
    const product = userProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowEditProduct(true);
    }
  };

  const handleProductUpdated = (productId, updatedProduct) => {
    updateProduct(productId, updatedProduct);
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteProduct(productId);
            Alert.alert('Success', 'Product deleted successfully!');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <Text style={styles.headerSubtitle}>Manage your products, track sales, and monitor performance.</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddProduct}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addBtnText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard icon="cube" title="Total Products" value={userProducts.length} />
        <StatCard icon="bag" title="Total Sales" value="15" />
        <StatCard icon="pound" title="Total Revenue" value="£2,500" />
        <StatCard icon="eye" title="Product Views" value="1,250" />
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>My Products</Text>
        <FlatList
          data={userProducts}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <AddProductScreen
        visible={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onAddProduct={handleProductAdded}
      />

      <EditProductScreen
        visible={showEditProduct}
        onClose={() => {
          setShowEditProduct(false);
          setSelectedProduct(null);
        }}
        onUpdateProduct={handleProductUpdated}
        product={selectedProduct}
      />
    </ScrollView>
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
  addBtn: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  productsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#6c5ce7',
    borderRadius: 8,
  },
  editBtnText: {
    color: '#6c5ce7',
    fontWeight: '600',
    marginLeft: 4,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#dc3545',
    borderRadius: 8,
  },
  deleteBtnText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 40,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginTop: 20,
    marginBottom: 12,
  },
  accessDeniedMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  accessDeniedSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
