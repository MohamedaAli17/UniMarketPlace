import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { addOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    postcode: '',
    email: currentUser?.email || '',
    phone: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Card number validation (basic)
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Expiry date validation
    if (!paymentInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    }

    // CVV validation
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    // Cardholder name validation
    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    // Billing address validation
    if (!paymentInfo.billingAddress.trim()) {
      newErrors.billingAddress = 'Please enter billing address';
    }

    // City validation
    if (!paymentInfo.city.trim()) {
      newErrors.city = 'Please enter city';
    }

    // Postcode validation
    if (!paymentInfo.postcode.trim()) {
      newErrors.postcode = 'Please enter postcode';
    }

    // Email validation
    if (!paymentInfo.email.trim() || !/\S+@\S+\.\S+/.test(paymentInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    if (!paymentInfo.phone.trim()) {
      newErrors.phone = 'Please enter phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setPaymentInfo(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate confirmation number
      const confirmationNumber = `SELL${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      // Calculate estimated delivery date (3 business days)
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 3);
      
      // Prepare order details
      const orderDetails = {
        confirmationNumber,
        items: cartItems,
        total: getCartTotal(),
        paymentInfo: paymentInfo,
        orderDate: new Date().toISOString(),
        estimatedDelivery: deliveryDate.toISOString(),
        buyerId: currentUser.uid,
        buyerName: userProfile?.name || 'Customer',
      };

      // Save order to Firebase
      const savedOrder = await addOrder(orderDetails);
      console.log('Order saved successfully:', savedOrder);

      // Clear cart and navigate to confirmation screen
      clearCart();
      navigation.navigate('OrderConfirmation', { orderDetails: savedOrder });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartSummary = () => (
    <View style={styles.cartSummary}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cartItems.map((item) => (
        <View key={item.id} style={styles.summaryItem}>
          <Text style={styles.summaryItemName}>{item.name}</Text>
          <Text style={styles.summaryItemDetails}>
            {item.quantity} × £{item.price}
          </Text>
        </View>
      ))}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total ({cartItems.length} items)</Text>
        <Text style={styles.totalAmount}>£{getCartTotal().toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderPaymentForm = () => (
    <View style={styles.paymentForm}>
      <Text style={styles.sectionTitle}>Payment Information</Text>
      
      {/* Card Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Card Number *</Text>
        <TextInput
          style={[styles.input, errors.cardNumber && styles.inputError]}
          value={paymentInfo.cardNumber}
          onChangeText={(value) => handleInputChange('cardNumber', value)}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
        />
        {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
      </View>

      {/* Expiry Date and CVV */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Expiry Date *</Text>
          <TextInput
            style={[styles.input, errors.expiryDate && styles.inputError]}
            value={paymentInfo.expiryDate}
            onChangeText={(value) => handleInputChange('expiryDate', value)}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
          />
          {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>CVV *</Text>
          <TextInput
            style={[styles.input, errors.cvv && styles.inputError]}
            value={paymentInfo.cvv}
            onChangeText={(value) => handleInputChange('cvv', value)}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
        </View>
      </View>

      {/* Cardholder Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cardholder Name *</Text>
        <TextInput
          style={[styles.input, errors.cardholderName && styles.inputError]}
          value={paymentInfo.cardholderName}
          onChangeText={(value) => handleInputChange('cardholderName', value)}
          placeholder="John Doe"
          autoCapitalize="words"
        />
        {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Billing Information</Text>

      {/* Billing Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Billing Address *</Text>
        <TextInput
          style={[styles.input, errors.billingAddress && styles.inputError]}
          value={paymentInfo.billingAddress}
          onChangeText={(value) => handleInputChange('billingAddress', value)}
          placeholder="123 Main Street"
          autoCapitalize="words"
        />
        {errors.billingAddress && <Text style={styles.errorText}>{errors.billingAddress}</Text>}
      </View>

      {/* City and Postcode */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>City *</Text>
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            value={paymentInfo.city}
            onChangeText={(value) => handleInputChange('city', value)}
            placeholder="London"
            autoCapitalize="words"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Postcode *</Text>
          <TextInput
            style={[styles.input, errors.postcode && styles.inputError]}
            value={paymentInfo.postcode}
            onChangeText={(value) => handleInputChange('postcode', value)}
            placeholder="SW1A 1AA"
            autoCapitalize="characters"
          />
          {errors.postcode && <Text style={styles.errorText}>{errors.postcode}</Text>}
        </View>
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={paymentInfo.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={paymentInfo.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          placeholder="+44 20 7946 0958"
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCartSummary()}
        {renderPaymentForm()}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={[
            styles.placeOrderButton,
            isProcessing && styles.placeOrderButtonDisabled
          ]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <Ionicons name="hourglass-outline" size={20} color="white" />
              <Text style={styles.placeOrderButtonText}>Processing Payment...</Text>
            </View>
          ) : (
            <View style={styles.orderContainer}>
              <Ionicons name="card-outline" size={20} color="white" />
              <Text style={styles.placeOrderButtonText}>
                Place Order - £{getCartTotal().toFixed(2)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cartSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryItemName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  summaryItemDetails: {
    fontSize: 14,
    color: '#666',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  paymentForm: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  bottomSection: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  placeOrderButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CheckoutScreen;
