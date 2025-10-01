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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';


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

const OrderCard = ({ order, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#d1ecf1';
      case 'processing': return '#fff3cd';
      case 'shipped': return '#d4edda';
      case 'delivered': return '#d4edda';
      default: return '#e9ecef';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'confirmed': return '#0c5460';
      case 'processing': return '#856404';
      case 'shipped': return '#155724';
      case 'delivered': return '#155724';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{order.confirmationNumber}</Text>
        <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
        <Text style={[styles.orderStatus, { 
          backgroundColor: getStatusColor(order.status),
          color: getStatusTextColor(order.status)
        }]}>
          {order.status.toUpperCase()}
        </Text>
      </View>
      
      {/* Show first item as preview */}
      {order.items.length > 0 && (
        <View style={styles.orderItem}>
          <Image source={{ uri: order.items[0].imageUrl }} style={styles.orderItemImage} />
          <View style={styles.orderItemInfo}>
            <Text style={styles.orderItemName}>
              {order.items[0].name}
              {order.items.length > 1 && ` +${order.items.length - 1} more`}
            </Text>
            <Text style={styles.orderItemPrice}>
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      )}
      
      <View style={styles.orderTotal}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>£{order.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function OrdersScreen({ navigation }) {
  const { currentUser, userProfile } = useAuth();
  const { getOrdersByUser, getTotalSpent, loadOrders } = useOrders();
  
  // Refresh orders when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (currentUser?.uid) {
        loadOrders();
      }
    });

    return unsubscribe;
  }, [navigation, currentUser, loadOrders]);
  
  // Get user's orders
  const userOrders = currentUser ? getOrdersByUser(currentUser.uid) : [];
  
  // Check if user is a seller
  const isSeller = userProfile?.accountType === 'seller';

  const totalOrders = userOrders.length;
  const totalSpent = currentUser ? getTotalSpent(currentUser.uid) : 0;
  const confirmedOrders = userOrders.filter(order => order.status === 'confirmed').length;
  const deliveredOrders = userOrders.filter(order => order.status === 'delivered').length;
  
  // Different stats for buyers vs sellers
  const buyerStats = [
    { icon: 'bag', title: 'Total Orders', value: totalOrders, color: '#6c5ce7' },
    { icon: 'pound', title: 'Total Spent', value: `£${totalSpent.toFixed(2)}`, color: '#28a745' },
    { icon: 'time', title: 'Confirmed', value: confirmedOrders, color: '#ffc107' },
    { icon: 'checkmark-circle', title: 'Delivered', value: deliveredOrders, color: '#17a2b8' },
  ];
  
  const sellerStats = [
    { icon: 'bag', title: 'Total Orders', value: totalOrders, color: '#6c5ce7' },
    { icon: 'pound', title: 'Total Revenue', value: `£${totalSpent.toFixed(2)}`, color: '#28a745' },
    { icon: 'time', title: 'Confirmed', value: confirmedOrders, color: '#ffc107' },
    { icon: 'checkmark-circle', title: 'Delivered', value: deliveredOrders, color: '#17a2b8' },
  ];
  
  const stats = isSeller ? sellerStats : buyerStats;

  const handleExportOrders = () => {
    Alert.alert('Export Orders', 'Export functionality would be implemented here');
  };

  const handleFilter = () => {
    Alert.alert('Filter Orders', 'Filter functionality would be implemented here');
  };

  const handleOrderPress = (order) => {
    // Navigate to order details screen (you can implement this later)
    Alert.alert(
      'Order Details',
      `Order #${order.confirmationNumber}\nStatus: ${order.status}\nTotal: £${order.total.toFixed(2)}`,
      [{ text: 'OK' }]
    );
  };

  const renderEmptyOrders = () => (
    <View style={styles.emptyOrders}>
      <Ionicons name="bag-outline" size={80} color="#ccc" />
      <Text style={styles.emptyOrdersTitle}>No orders yet</Text>
      <Text style={styles.emptyOrdersSubtitle}>
        {isSeller 
          ? 'You haven\'t received any orders yet. Start selling to see orders here!'
          : 'You haven\'t placed any orders yet. Start shopping to see your orders here!'
        }
      </Text>
      {!isSeller && (
        <TouchableOpacity 
          style={styles.shopNowButton}
          onPress={() => navigation.navigate('BuyerMain')}
        >
          <Text style={styles.shopNowButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>
          {isSeller 
            ? 'Track and manage customer orders, view order history, and monitor order status.'
            : 'Track your purchases, view order history, and monitor order status.'
          }
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleExportOrders}>
            <Ionicons name="download" size={16} color="#333" />
            <Text style={styles.actionBtnText}>Export Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleFilter}>
            <Ionicons name="filter" size={16} color="#333" />
            <Text style={styles.actionBtnText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            icon={stat.icon} 
            title={stat.title} 
            value={stat.value} 
            color={stat.color} 
          />
        ))}
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {userOrders.length === 0 ? (
          renderEmptyOrders()
        ) : (
          <FlatList
            data={userOrders}
            renderItem={({ item }) => <OrderCard order={item} onPress={handleOrderPress} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
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
  ordersSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  orderDate: {
    color: '#666',
    fontSize: 14,
  },
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontSize: 16,
  },
  orderItemPrice: {
    color: '#666',
    fontSize: 14,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyOrders: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyOrdersTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyOrdersSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  shopNowButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
