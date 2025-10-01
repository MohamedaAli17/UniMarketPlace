import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpCenterScreen = ({ navigation }) => {
  const HelpItem = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.helpItem} onPress={onPress}>
      <View style={styles.helpLeft}>
        <View style={styles.helpIcon}>
          <Ionicons name={icon} size={20} color="#6c5ce7" />
        </View>
        <View style={styles.helpContent}>
          <Text style={styles.helpTitle}>{title}</Text>
          <Text style={styles.helpDescription}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const FAQItem = ({ question, answer }) => (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
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
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          <HelpItem
            icon="search"
            title="Search Help Articles"
            description="Find answers to common questions"
            onPress={() => Alert.alert('Coming Soon', 'Search functionality will be available soon')}
          />
          <HelpItem
            icon="chatbubble"
            title="Live Chat Support"
            description="Chat with our support team in real-time"
            onPress={() => Alert.alert('Coming Soon', 'Live chat will be available soon')}
          />
          <HelpItem
            icon="mail"
            title="Email Support"
            description="Send us an email and we'll get back to you"
            onPress={() => navigation.navigate('ContactUs')}
          />
          <HelpItem
            icon="call"
            title="Phone Support"
            description="Call us for immediate assistance"
            onPress={() => Alert.alert('Phone Support', 'Call us at: +44 20 8891 0121\n\nAvailable: Mon-Fri 9AM-6PM')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <FAQItem
            question="How do I create an account?"
            answer="You can create an account by tapping 'Register' on the login screen and providing your Brunel University email address."
          />
          <FAQItem
            question="How do I list a product for sale?"
            answer="Go to your seller dashboard and tap 'Add Product'. Fill in the product details and upload photos."
          />
          <FAQItem
            question="How do I contact a seller?"
            answer="Go to any product page and tap the 'Message Seller' button to start a conversation."
          />
          <FAQItem
            question="What payment methods are accepted?"
            answer="We currently support cash on delivery and bank transfers. More payment options coming soon!"
          />
          <FAQItem
            question="How do I report a problem?"
            answer="You can report issues through the 'Contact Us' section or by messaging our support team directly."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Help</Text>
          <HelpItem
            icon="person"
            title="Account Settings"
            description="Manage your profile and account preferences"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <HelpItem
            icon="lock-closed"
            title="Password & Security"
            description="Reset password and manage security settings"
            onPress={() => navigation.navigate('PrivacySecurity')}
          />
          <HelpItem
            icon="notifications"
            title="Notification Settings"
            description="Customize your notification preferences"
            onPress={() => navigation.navigate('Notifications')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selling Help</Text>
          <HelpItem
            icon="storefront"
            title="Seller Guidelines"
            description="Learn about selling policies and best practices"
            onPress={() => Alert.alert('Seller Guidelines', '• Only sell items you own\n• Provide accurate descriptions\n• Respond to messages promptly\n• Meet buyers in safe, public locations\n• Follow university policies')}
          />
          <HelpItem
            icon="trending-up"
            title="Marketing Tips"
            description="Tips to help you sell your items faster"
            onPress={() => Alert.alert('Marketing Tips', '• Take clear, well-lit photos\n• Write detailed descriptions\n• Price items competitively\n• Respond to messages quickly\n• Keep your listings updated')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Sellora - University Marketplace</Text>
            <Text style={styles.appInfoText}>Version 1.0.0</Text>
            <Text style={styles.appInfoText}>For Brunel University Students</Text>
          </View>
        </View>
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: 14,
    color: '#666',
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default HelpCenterScreen;
