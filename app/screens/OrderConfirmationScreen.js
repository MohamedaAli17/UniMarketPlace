import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderDetails } = route.params;
  const { userProfile } = useAuth();
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  // Generate confirmation number
  const generateConfirmationNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SELL${timestamp}${random}`;
  };

  // Calculate estimated delivery date
  const calculateDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3); // 3 business days
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return deliveryDate.toLocaleDateString('en-GB', options);
  };

  useEffect(() => {
    setEstimatedDelivery(calculateDeliveryDate());
  }, []);

  const confirmationNumber = generateConfirmationNumber();

  const handleTrackOrder = () => {
    Alert.alert(
      'Track Your Order',
      `Your order ${confirmationNumber} is being prepared for shipment. You'll receive tracking information via email once it's dispatched.`,
      [{ text: 'OK' }]
    );
  };

  const handleContinueShopping = () => {
    // Reset the navigation stack to go back to the main tab navigator
    navigation.reset({
      index: 0,
      routes: [{ name: 'BuyerMain' }],
    });
  };

  const handleViewOrders = () => {
    // Navigate to orders screen (you can implement this later)
    Alert.alert('Orders', 'Orders screen coming soon!', [{ text: 'OK' }]);
  };

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        {item.sellerName && (
          <Text style={styles.sellerName}>Sold by: {item.sellerName}</Text>
        )}
        <View style={styles.itemFooter}>
          <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>£{item.price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Success Header */}
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#28a745" />
        </View>
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        <Text style={styles.successSubtitle}>
          Thank you for your purchase, {userProfile?.name || 'Customer'}!
        </Text>
      </View>

      {/* Confirmation Details */}
      <View style={styles.confirmationCard}>
        <Text style={styles.cardTitle}>Order Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Confirmation Number</Text>
          <Text style={styles.confirmationNumber}>{confirmationNumber}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Date</Text>
          <Text style={styles.detailValue}>
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>£{orderDetails.total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method</Text>
          <Text style={styles.detailValue}>**** **** **** {orderDetails.paymentInfo.cardNumber.slice(-4)}</Text>
        </View>
      </View>

      {/* Delivery Information */}
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryHeader}>
          <Ionicons name="truck" size={24} color="#6c5ce7" />
          <Text style={styles.cardTitle}>Delivery Information</Text>
        </View>
        
        <View style={styles.deliveryTimeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Order Confirmed</Text>
              <Text style={styles.timelineSubtitle}>Your order has been received</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotPending]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Processing</Text>
              <Text style={styles.timelineSubtitle}>Preparing your items for shipment</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotPending]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Shipped</Text>
              <Text style={styles.timelineSubtitle}>Your order is on its way</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotPending]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Delivered</Text>
              <Text style={styles.timelineSubtitle}>Expected by {estimatedDelivery}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.deliveryAddress}>
          <Text style={styles.addressTitle}>Delivery Address</Text>
          <Text style={styles.addressText}>
            {orderDetails.paymentInfo.billingAddress}
          </Text>
          <Text style={styles.addressText}>
            {orderDetails.paymentInfo.city}, {orderDetails.paymentInfo.postcode}
          </Text>
        </View>
      </View>

      {/* Purchased Items */}
      <View style={styles.itemsCard}>
        <Text style={styles.cardTitle}>Items Purchased ({orderDetails.items.length})</Text>
        {orderDetails.items.map(renderOrderItem)}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleTrackOrder}
        >
          <Ionicons name="search" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Track Order</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleViewOrders}
          >
            <Ionicons name="list" size={20} color="#6c5ce7" />
            <Text style={styles.secondaryButtonText}>View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleContinueShopping}
          >
            <Ionicons name="home" size={20} color="#6c5ce7" />
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Message */}
      <View style={styles.footerMessage}>
        <Text style={styles.footerText}>
          You'll receive an email confirmation shortly with tracking information. 
          Thank you for shopping with Sellora!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  successHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  confirmationCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  confirmationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  deliveryCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  deliveryTimeline: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: '#28a745',
  },
  timelineDotPending: {
    backgroundColor: '#ddd',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  deliveryAddress: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemsCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 11,
    color: '#6c5ce7',
    marginBottom: 4,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  actionButtons: {
    padding: 16,
  },
  primaryButton: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c5ce7',
    marginHorizontal: 4,
  },
  secondaryButtonText: {
    color: '#6c5ce7',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  footerMessage: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default OrderConfirmationScreen;
