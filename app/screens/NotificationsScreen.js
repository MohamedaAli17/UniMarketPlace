import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    priceAlerts: true,
    newMessages: true,
    productRecommendations: false,
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // In a real app, you would save these settings to your backend
    Alert.alert(
      'Settings Saved',
      'Your notification preferences have been updated successfully!',
      [{ text: 'OK' }]
    );
  };

  const NotificationItem = ({ icon, title, description, value, onToggle, disabled = false }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={[styles.notificationIcon, disabled && styles.disabledIcon]}>
          <Ionicons name={icon} size={20} color={disabled ? "#ccc" : "#6c5ce7"} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, disabled && styles.disabledText]}>{title}</Text>
          <Text style={[styles.notificationDescription, disabled && styles.disabledText]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: "#e9ecef", true: "#6c5ce7" }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#6c5ce7" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <NotificationItem
            icon="notifications"
            title="Push Notifications"
            description="Receive notifications on your device"
            value={notifications.pushNotifications}
            onToggle={() => handleToggle('pushNotifications')}
          />
          <NotificationItem
            icon="bag"
            title="Order Updates"
            description="Get notified about order status changes"
            value={notifications.orderUpdates}
            onToggle={() => handleToggle('orderUpdates')}
          />
          <NotificationItem
            icon="chatbubble"
            title="New Messages"
            description="Notifications for new messages from sellers"
            value={notifications.newMessages}
            onToggle={() => handleToggle('newMessages')}
          />
          <NotificationItem
            icon="pricetag"
            title="Price Alerts"
            description="Get notified when items you're watching go on sale"
            value={notifications.priceAlerts}
            onToggle={() => handleToggle('priceAlerts')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <NotificationItem
            icon="mail"
            title="Email Notifications"
            description="Receive notifications via email"
            value={notifications.emailNotifications}
            onToggle={() => handleToggle('emailNotifications')}
          />
          <NotificationItem
            icon="megaphone"
            title="Marketing Emails"
            description="Receive promotional offers and updates"
            value={notifications.marketingEmails}
            onToggle={() => handleToggle('marketingEmails')}
          />
          <NotificationItem
            icon="star"
            title="Product Recommendations"
            description="Get personalized product suggestions"
            value={notifications.productRecommendations}
            onToggle={() => handleToggle('productRecommendations')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <View style={styles.quietHoursContainer}>
            <View style={styles.quietHoursIcon}>
              <Ionicons name="moon" size={20} color="#6c5ce7" />
            </View>
            <View style={styles.quietHoursContent}>
              <Text style={styles.quietHoursTitle}>Do Not Disturb</Text>
              <Text style={styles.quietHoursDescription}>Set quiet hours to avoid notifications</Text>
            </View>
            <TouchableOpacity 
              style={styles.setupButton}
              onPress={() => Alert.alert('Coming Soon', 'Quiet hours setup will be available soon')}
            >
              <Text style={styles.setupButtonText}>Setup</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color="white" />
          <Text style={styles.saveButtonText}>Save Settings</Text>
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
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disabledIcon: {
    backgroundColor: '#f1f3f4',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },
  disabledText: {
    color: '#ccc',
  },
  quietHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  quietHoursIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quietHoursContent: {
    flex: 1,
  },
  quietHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quietHoursDescription: {
    fontSize: 14,
    color: '#666',
  },
  setupButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  setupButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default NotificationsScreen;
