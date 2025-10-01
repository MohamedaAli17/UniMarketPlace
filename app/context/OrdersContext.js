import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load orders from Firebase on app start
  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('orderDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setOrders(ordersData);
      console.log('Loaded orders from Firebase:', ordersData.length);
    } catch (error) {
      console.error('Error loading orders:', error);
      // If Firebase fails, start with empty array
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  const addOrder = async (orderData) => {
    try {
      const newOrder = {
        confirmationNumber: orderData.confirmationNumber || `ORDER_${Date.now()}`,
        items: orderData.items,
        total: orderData.total,
        paymentInfo: orderData.paymentInfo,
        orderDate: orderData.orderDate || new Date().toISOString(),
        status: 'confirmed', // confirmed, processing, shipped, delivered
        estimatedDelivery: orderData.estimatedDelivery,
        buyerId: orderData.buyerId,
        buyerName: orderData.buyerName,
        deliveryAddress: {
          address: orderData.paymentInfo.billingAddress,
          city: orderData.paymentInfo.city,
          postcode: orderData.paymentInfo.postcode,
        },
        trackingNumber: null,
        actualDeliveryDate: null,
      };

      // Save to Firebase
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, newOrder);
      
      // Add the Firebase document ID to the order
      const orderWithId = {
        id: docRef.id,
        ...newOrder
      };

      // Update local state
      setOrders(prev => [orderWithId, ...prev]);
      
      console.log('Order saved to Firebase with ID:', docRef.id);
      return orderWithId;
    } catch (error) {
      console.error('Error saving order to Firebase:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update in Firebase
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      console.log('Order status updated in Firebase:', orderId, newStatus);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const updateOrderTracking = async (orderId, trackingNumber) => {
    try {
      // Update in Firebase
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        trackingNumber: trackingNumber,
        status: 'shipped'
      });

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, trackingNumber, status: 'shipped' }
            : order
        )
      );
      
      console.log('Order tracking updated in Firebase:', orderId, trackingNumber);
    } catch (error) {
      console.error('Error updating order tracking:', error);
      throw error;
    }
  };

  const markOrderDelivered = async (orderId) => {
    try {
      const deliveryDate = new Date().toISOString();
      
      // Update in Firebase
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'delivered',
        actualDeliveryDate: deliveryDate
      });

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: 'delivered',
                actualDeliveryDate: deliveryDate
              }
            : order
        )
      );
      
      console.log('Order marked as delivered in Firebase:', orderId);
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      throw error;
    }
  };

  const getOrdersByUser = (userId) => {
    return orders.filter(order => order.buyerId === userId);
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrderByConfirmationNumber = (confirmationNumber) => {
    return orders.find(order => order.confirmationNumber === confirmationNumber);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getTotalOrders = () => {
    return orders.length;
  };

  const getTotalSpent = (userId) => {
    const userOrders = getOrdersByUser(userId);
    return userOrders.reduce((total, order) => total + order.total, 0);
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const value = {
    orders,
    loading,
    addOrder,
    updateOrderStatus,
    updateOrderTracking,
    markOrderDelivered,
    getOrdersByUser,
    getOrderById,
    getOrderByConfirmationNumber,
    getOrdersByStatus,
    getTotalOrders,
    getTotalSpent,
    clearOrders,
    loadOrders,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
