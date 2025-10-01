import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { currentUser, userProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  const handleBuyNow = () => {
    if (!currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to purchase products.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    
    if (userProfile?.accountType === 'seller') {
      Alert.alert('Seller Account', 'You cannot purchase products with a seller account. Switch to a buyer account to make purchases.');
      return;
    }

    Alert.alert(
      'Buy Product',
      `Are you sure you want to buy ${product.name} for £${product.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Now', onPress: () => Alert.alert('Success', 'Order placed successfully!') }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing product: ${product.name} for £${product.price} on Sellora!`,
        title: product.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleContactSeller = () => {
    if (!currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to contact sellers.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    
    if (userProfile?.accountType === 'seller') {
      Alert.alert('Seller Account', 'You cannot contact other sellers with a seller account. Switch to a buyer account to contact sellers.');
      return;
    }

    // Navigate to messaging screen with product and seller info
    navigation.navigate('Messaging', {
      product: product,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      buyerId: currentUser.uid,
      productId: product.id
    });
  };

  const getStockStatus = () => {
    if (product.stock <= 0) return { text: 'Sold Out', color: '#dc3545', bgColor: '#f8d7da' };
    if (product.stock <= 5) return { text: 'Low Stock', color: '#856404', bgColor: '#fff3cd' };
    return { text: 'In Stock', color: '#155724', bgColor: '#d4edda' };
  };

  const stockStatus = getStockStatus();

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        <View style={styles.imageOverlay}>
          <View style={[styles.stockBadge, { backgroundColor: stockStatus.bgColor }]}>
            <Text style={[styles.stockText, { color: stockStatus.color }]}>
              {stockStatus.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>£{product.price}</Text>
        </View>

        <View style={styles.categorySection}>
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag-outline" size={16} color="#6c5ce7" />
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerSection}>
          <View style={styles.sellerInfo}>
            <Ionicons name="storefront-outline" size={20} color="#6c5ce7" />
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerLabel}>Sold by</Text>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactSeller}>
            <Ionicons name="chatbubble-outline" size={16} color="#6c5ce7" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Product Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Ionicons name="cube-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Stock Available:</Text>
              <Text style={styles.detailValue}>{product.stock} units</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Listed:</Text>
              <Text style={styles.detailValue}>
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recently'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Condition:</Text>
              <Text style={styles.detailValue}>New</Text>
            </View>
          </View>
        </View>

        {/* Similar Products Section */}
        <View style={styles.similarSection}>
          <Text style={styles.sectionTitle}>You might also like</Text>
          <Text style={styles.similarSubtext}>More products in {product.category}</Text>
        </View>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.totalPrice}>£{product.price}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.buyButton, 
            product.stock <= 0 && styles.buyButtonDisabled
          ]} 
          onPress={handleBuyNow}
          disabled={product.stock <= 0}
        >
          <Ionicons 
            name={product.stock <= 0 ? "close-circle" : "bag"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.buyButtonText}>
            {product.stock <= 0 ? 'Sold Out' : 'Buy Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: 'white',
  },
  productImage: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 32,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 14,
    color: '#6c5ce7',
    fontWeight: '600',
    marginLeft: 6,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerDetails: {
    marginLeft: 12,
  },
  sellerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#6c5ce7',
    fontWeight: '600',
    marginLeft: 4,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  similarSection: {
    marginBottom: 100, // Space for bottom bar
  },
  similarSubtext: {
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
