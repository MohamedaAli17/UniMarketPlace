import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Demo data
const demoCampaigns = [
  {
    id: '1',
    plan: 'Premium Boost',
    productName: 'Apple iPad (Gen 10)',
    status: 'active',
    impressions: 1250,
    clicks: 45,
    ctr: 3.6,
    amount: 15,
  },
  {
    id: '2',
    plan: 'Basic Boost',
    productName: 'MacBook Pro 14-inch',
    status: 'expired',
    impressions: 800,
    clicks: 20,
    ctr: 2.5,
    amount: 5,
  },
];

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

const PlanCard = ({ plan, price, features, isPopular, onSelect }) => (
  <View style={[styles.planCard, isPopular && styles.popularPlan]}>
    {isPopular && (
      <View style={styles.popularBadge}>
        <Text style={styles.popularBadgeText}>Most Popular</Text>
      </View>
    )}
    
    <View style={styles.planHeader}>
      <Text style={styles.planName}>{plan}</Text>
      <Text style={styles.planPrice}>£{price}</Text>
      <Text style={styles.planDuration}>7 days promotion</Text>
    </View>
    
    <View style={styles.planFeatures}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons name="checkmark" size={16} color="#28a745" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
    
    <TouchableOpacity style={styles.planBtn} onPress={onSelect}>
      <Text style={styles.planBtnText}>Choose Plan</Text>
    </TouchableOpacity>
  </View>
);

const CampaignCard = ({ campaign }) => (
  <View style={styles.campaignCard}>
    <View style={styles.campaignHeader}>
      <Text style={styles.campaignName}>{campaign.plan} Campaign</Text>
      <Text style={[
        styles.campaignStatus,
        { backgroundColor: campaign.status === 'active' ? '#d4edda' : '#f8d7da' }
      ]}>
        {campaign.status.toUpperCase()}
      </Text>
    </View>
    
    <Text style={styles.campaignProduct}>{campaign.productName}</Text>
    
    <View style={styles.campaignStats}>
      <View style={styles.campaignStat}>
        <Text style={styles.campaignStatValue}>{campaign.impressions}</Text>
        <Text style={styles.campaignStatLabel}>Impressions</Text>
      </View>
      <View style={styles.campaignStat}>
        <Text style={styles.campaignStatValue}>{campaign.clicks}</Text>
        <Text style={styles.campaignStatLabel}>Clicks</Text>
      </View>
      <View style={styles.campaignStat}>
        <Text style={styles.campaignStatValue}>{campaign.ctr}%</Text>
        <Text style={styles.campaignStatLabel}>CTR</Text>
      </View>
    </View>
  </View>
);

export default function MarketingScreen() {
  const { userProfile } = useAuth();
  const [campaigns] = useState(demoCampaigns);
  
  // Check if user is a seller
  const isSeller = userProfile?.accountType === 'seller';
  
  // If user is not a seller, show access denied message
  if (!isSeller) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Ionicons name="lock-closed" size={64} color="#dc3545" />
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedMessage}>
          Marketing features are only available for Business Account (Seller) users.
        </Text>
        <Text style={styles.accessDeniedSubtext}>
          You need a seller account to promote products and run marketing campaigns.
        </Text>
      </View>
    );
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const marketingSpend = campaigns.reduce((sum, c) => sum + c.amount, 0);

  const marketingPlans = [
    {
      name: 'Basic Boost',
      price: 5,
      features: [
        'Featured in search results',
        'Highlighted product card',
        '2x visibility boost',
        'Basic analytics'
      ]
    },
    {
      name: 'Premium Boost',
      price: 15,
      features: [
        'Top of search results',
        'Featured banner placement',
        '5x visibility boost',
        'Advanced analytics',
        'Email notifications'
      ],
      isPopular: true
    },
    {
      name: 'Ultimate Boost',
      price: 30,
      features: [
        'Homepage featured',
        'Category leader',
        '10x visibility boost',
        'Full analytics suite',
        'Priority support',
        'Social media promotion'
      ]
    }
  ];

  const handlePlanSelect = (plan) => {
    Alert.alert(
      'Select Plan',
      `You selected ${plan.name} for £${plan.price}. This would open product selection and payment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => Alert.alert('Success', 'Campaign created successfully!') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketing & Promotion</Text>
        <Text style={styles.headerSubtitle}>Boost your product visibility and reach more customers.</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard icon="megaphone" title="Active Campaigns" value={activeCampaigns} />
        <StatCard icon="eye" title="Total Impressions" value={totalImpressions} />
        <StatCard icon="mouse" title="Total Clicks" value={totalClicks} />
        <StatCard icon="pound" title="Marketing Spend" value={`£${marketingSpend}`} />
      </View>

      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Choose Your Marketing Plan</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansScroll}>
          {marketingPlans.map((plan, index) => (
            <PlanCard
              key={index}
              plan={plan.name}
              price={plan.price}
              features={plan.features}
              isPopular={plan.isPopular}
              onSelect={() => handlePlanSelect(plan)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.campaignsSection}>
        <Text style={styles.sectionTitle}>Active Campaigns</Text>
        <FlatList
          data={campaigns}
          renderItem={({ item }) => <CampaignCard campaign={item} />}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
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
  plansSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  plansScroll: {
    marginHorizontal: -16,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularPlan: {
    borderWidth: 2,
    borderColor: '#6c5ce7',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6c5ce7',
    marginBottom: 4,
  },
  planDuration: {
    color: '#666',
    fontSize: 14,
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 14,
  },
  planBtn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  planBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  campaignsSection: {
    padding: 16,
  },
  campaignCard: {
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
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignName: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  campaignStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  campaignProduct: {
    color: '#666',
    marginBottom: 16,
    fontSize: 14,
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  campaignStat: {
    alignItems: 'center',
  },
  campaignStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  campaignStatLabel: {
    color: '#666',
    fontSize: 12,
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
