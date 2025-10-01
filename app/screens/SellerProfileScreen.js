import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useProducts } from './buyer/ProductContext';

const SellerProfileScreen = ({ navigation }) => {
  const { currentUser, userProfile, logout, refreshUserProfile } = useAuth();
  const { getUserProducts } = useProducts();

  // Refresh profile when screen comes into focus (e.g., returning from EditProfile)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (currentUser?.uid) {
        // Refresh the user profile to get latest data
        refreshUserProfile(currentUser.uid);
      }
    });

    return unsubscribe;
  }, [navigation, currentUser, refreshUserProfile]);

  // Get seller's products for statistics
  const sellerProducts = getUserProducts(currentUser?.uid);
  const totalProducts = sellerProducts.length;
  const totalRevenue = sellerProducts.reduce((sum, product) => sum + (product.price * (product.initialStock || product.stock)), 0);
  const lowStockProducts = sellerProducts.filter(product => product.stock <= 5 && product.stock > 0).length;
  const outOfStockProducts = sellerProducts.filter(product => product.stock <= 0).length;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon, title, value, onPress, showArrow = false }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <View style={styles.profileItemIcon}>
          <Ionicons name={icon} size={20} color="#6c5ce7" />
        </View>
        <View style={styles.profileItemContent}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          <Text style={styles.profileItemValue}>{value}</Text>
        </View>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color = '#6c5ce7' }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {userProfile?.profilePicture ? (
              <Image 
                source={{ uri: userProfile.profilePicture }} 
                style={styles.profileImage} 
              />
            ) : (
              <Ionicons name="storefront" size={40} color="#6c5ce7" />
            )}
          </View>
          <Text style={styles.userName}>{userProfile?.name || 'Seller'}</Text>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
          {userProfile?.phone && (
            <Text style={styles.userPhone}>{userProfile.phone}</Text>
          )}
          {userProfile?.location && (
            <Text style={styles.userLocation}>{userProfile.location}</Text>
          )}
          <View style={styles.accountTypeBadge}>
            <Ionicons name="storefront" size={16} color="white" />
            <Text style={styles.accountTypeText}>Business Account</Text>
          </View>
        </View>
      </View>

      {userProfile?.bio && (
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{userProfile.bio}</Text>
          </View>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Business Overview</Text>
        <View style={styles.statsContainer}>
          <StatCard 
            title="Total Products" 
            value={totalProducts} 
            icon="cube" 
            color="#6c5ce7" 
          />
          <StatCard 
            title="Total Revenue" 
            value={`£${totalRevenue.toLocaleString()}`} 
            icon="pound" 
            color="#28a745" 
          />
          <StatCard 
            title="Low Stock" 
            value={lowStockProducts} 
            icon="warning" 
            color="#ffc107" 
          />
          <StatCard 
            title="Out of Stock" 
            value={outOfStockProducts} 
            icon="close-circle" 
            color="#dc3545" 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Settings</Text>
        <ProfileItem
          icon="business-outline"
          title="Business Information"
          value="Update your business details"
          onPress={() => Alert.alert('Coming Soon', 'Business information editing will be available soon')}
          showArrow={true}
        />
        <ProfileItem
          icon="card-outline"
          title="Payment Methods"
          value="Manage your payment settings"
          onPress={() => Alert.alert('Coming Soon', 'Payment method management will be available soon')}
          showArrow={true}
        />
        <ProfileItem
          icon="analytics-outline"
          title="Analytics & Reports"
          value="View detailed sales analytics"
          onPress={() => Alert.alert('Coming Soon', 'Analytics dashboard will be available soon')}
          showArrow={true}
        />
        <ProfileItem
          icon="settings-outline"
          title="Store Settings"
          value="Configure your store preferences"
          onPress={() => Alert.alert('Coming Soon', 'Store settings will be available soon')}
          showArrow={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Management</Text>
        <ProfileItem
          icon="add-circle-outline"
          title="Add New Product"
          value="Create a new product listing"
          onPress={() => navigation.navigate('Dashboard')}
          showArrow={true}
        />
        <ProfileItem
          icon="list-outline"
          title="Manage Products"
          value="Edit and organize your products"
          onPress={() => navigation.navigate('Products')}
          showArrow={true}
        />
        <ProfileItem
          icon="bag-outline"
          title="Order Management"
          value="Track and fulfill customer orders"
          onPress={() => navigation.navigate('Orders')}
          showArrow={true}
        />
        <ProfileItem
          icon="megaphone-outline"
          title="Marketing Campaigns"
          value="Promote your products"
          onPress={() => navigation.navigate('Marketing')}
          showArrow={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Help</Text>
        <ProfileItem
          icon="help-circle-outline"
          title="Seller Help Center"
          value="Get help with selling on Sellora"
          onPress={() => Alert.alert('Coming Soon', 'Seller help center will be available soon')}
          showArrow={true}
        />
        <ProfileItem
          icon="mail-outline"
          title="Contact Support"
          value="Get in touch with our team"
          onPress={() => Alert.alert('Coming Soon', 'Contact form will be available soon')}
          showArrow={true}
        />
        <ProfileItem
          icon="document-text-outline"
          title="Seller Guidelines"
          value="Learn about selling policies"
          onPress={() => Alert.alert('Coming Soon', 'Seller guidelines will be available soon')}
          showArrow={true}
        />
        <ProfileItem
          icon="help-circle-outline"
          title="Help Center"
          value="Get help and support"
          onPress={() => navigation.navigate('HelpCenter')}
          showArrow={true}
        />
        <ProfileItem
          icon="mail-outline"
          title="Contact Us"
          value="Get in touch with our team"
          onPress={() => navigation.navigate('ContactUs')}
          showArrow={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <ProfileItem
          icon="person-outline"
          title="Personal Information"
          value="Update your profile details"
          onPress={() => navigation.navigate('EditProfile')}
          showArrow={true}
        />
        <ProfileItem
          icon="notifications-outline"
          title="Notifications"
          value="Manage your notification preferences"
          onPress={() => navigation.navigate('Notifications')}
          showArrow={true}
        />
        <ProfileItem
          icon="shield-checkmark-outline"
          title="Privacy & Security"
          value="Manage your privacy settings"
          onPress={() => navigation.navigate('PrivacySecurity')}
          showArrow={true}
        />
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#dc3545" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sellora Business Account</Text>
        <Text style={styles.footerSubtext}>Version 1.0.0</Text>
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
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#6c5ce7',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  accountTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  accountTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bioSection: {
    padding: 20,
  },
  bioContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  profileItemValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 20,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});

export default SellerProfileScreen;
