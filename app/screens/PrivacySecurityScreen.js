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

const PrivacySecurityScreen = ({ navigation }) => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataCollection: true,
    analytics: false,
  });

  const handleToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    Alert.alert(
      'Settings Saved',
      'Your privacy and security settings have been updated successfully!',
      [{ text: 'OK' }]
    );
  };

  const PrivacyItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => (
    <TouchableOpacity style={styles.privacyItem} onPress={type === 'button' ? onToggle : undefined}>
      <View style={styles.privacyLeft}>
        <View style={styles.privacyIcon}>
          <Ionicons name={icon} size={20} color="#6c5ce7" />
        </View>
        <View style={styles.privacyContent}>
          <Text style={styles.privacyTitle}>{title}</Text>
          <Text style={styles.privacyDescription}>{description}</Text>
        </View>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#e9ecef", true: "#6c5ce7" }}
          thumbColor={value ? "#ffffff" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Privacy</Text>
          <PrivacyItem
            icon="eye"
            title="Profile Visibility"
            description="Make your profile visible to other users"
            value={privacySettings.profileVisibility}
            onToggle={() => handleToggle('profileVisibility')}
          />
          <PrivacyItem
            icon="mail"
            title="Show Email Address"
            description="Display your email on your profile"
            value={privacySettings.showEmail}
            onToggle={() => handleToggle('showEmail')}
          />
          <PrivacyItem
            icon="call"
            title="Show Phone Number"
            description="Display your phone number on your profile"
            value={privacySettings.showPhone}
            onToggle={() => handleToggle('showPhone')}
          />
          <PrivacyItem
            icon="chatbubble"
            title="Allow Messages"
            description="Let other users send you messages"
            value={privacySettings.allowMessages}
            onToggle={() => handleToggle('allowMessages')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>
          <PrivacyItem
            icon="analytics"
            title="Data Collection"
            description="Allow collection of usage data to improve the app"
            value={privacySettings.dataCollection}
            onToggle={() => handleToggle('dataCollection')}
          />
          <PrivacyItem
            icon="bar-chart"
            title="Analytics"
            description="Share anonymous usage statistics"
            value={privacySettings.analytics}
            onToggle={() => handleToggle('analytics')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <PrivacyItem
            icon="key"
            title="Change Password"
            description="Update your account password"
            type="button"
            onToggle={() => Alert.alert('Coming Soon', 'Password change will be available soon')}
          />
          <PrivacyItem
            icon="shield-checkmark"
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            type="button"
            onToggle={() => Alert.alert('Coming Soon', 'Two-factor authentication will be available soon')}
          />
          <PrivacyItem
            icon="log-out"
            title="Sign Out All Devices"
            description="Sign out from all devices except this one"
            type="button"
            onToggle={() => Alert.alert('Coming Soon', 'Sign out all devices will be available soon')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <PrivacyItem
            icon="download"
            title="Download My Data"
            description="Get a copy of all your data"
            type="button"
            onToggle={() => Alert.alert('Coming Soon', 'Data download will be available soon')}
          />
          <PrivacyItem
            icon="trash"
            title="Delete Account"
            description="Permanently delete your account and all data"
            type="button"
            onToggle={() => Alert.alert('Coming Soon', 'Account deletion will be available soon')}
          />
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
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
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

export default PrivacySecurityScreen;
