import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import ProfilePicturePicker from '../components/ProfilePicturePicker';

const EditProfileScreen = ({ navigation }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountType: '',
    phone: '',
    bio: '',
    location: '',
    profilePicture: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || currentUser?.email || '',
        accountType: userProfile.accountType || 'buyer',
        phone: userProfile.phone || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        profilePicture: userProfile.profilePicture || '',
      });
    }
  }, [userProfile, currentUser]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleNameChange = useCallback((value) => {
    handleInputChange('name', value);
  }, [handleInputChange]);

  const handleEmailChange = useCallback((value) => {
    handleInputChange('email', value);
  }, [handleInputChange]);

  const handlePhoneChange = useCallback((value) => {
    handleInputChange('phone', value);
  }, [handleInputChange]);

  const handleBioChange = useCallback((value) => {
    handleInputChange('bio', value);
  }, [handleInputChange]);

  const handleLocationChange = useCallback((value) => {
    handleInputChange('location', value);
  }, [handleInputChange]);

  const handleProfilePictureChange = useCallback((imageUri) => {
    handleInputChange('profilePicture', imageUri);
  }, [handleInputChange]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }
    if (formData.name.trim().length < 2) {
      Alert.alert('Validation Error', 'Name must be at least 2 characters long');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Saving profile with data:', formData);
      console.log('Current user UID:', currentUser?.uid);
      
      const updates = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        profilePicture: formData.profilePicture,
        updatedAt: new Date().toISOString(),
        // Note: We don't update email or accountType as these are typically not editable
        // after registration for security reasons
      };

      console.log('Updates to be saved:', updates);
      await updateUserProfile(currentUser.uid, updates);
      
      console.log('Profile updated successfully');
      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', error.message);
      Alert.alert(
        'Error', 
        `Failed to update profile: ${error.message || 'Please try again.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const InputField = memo(({ label, value, onChangeText, placeholder, editable = true, multiline = false }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          !editable && styles.disabledInput,
          multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        placeholderTextColor="#999"
      />
    </View>
  ));

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#6c5ce7" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.avatarSection}>
            <ProfilePicturePicker
              currentImageUri={formData.profilePicture}
              onImageSelected={handleProfilePictureChange}
              userId={currentUser?.uid}
              size={100}
            />
            <Text style={styles.avatarText}>Profile Picture</Text>
            <Text style={styles.avatarSubtext}>Tap to change</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <InputField
              key="name"
              label="Full Name"
              value={formData.name}
              onChangeText={handleNameChange}
              placeholder="Enter your full name"
            />

            <InputField
              key="email"
              label="Email Address"
              value={formData.email}
              onChangeText={handleEmailChange}
              placeholder="Enter your email"
              editable={false}
            />

            <InputField
              key="accountType"
              label="Account Type"
              value={formData.accountType === 'seller' ? 'Business Account' : 'Regular Account'}
              placeholder="Account type"
              editable={false}
            />

            <InputField
              key="phone"
              label="Phone Number"
              value={formData.phone}
              onChangeText={handlePhoneChange}
              placeholder="Enter your phone number"
            />

            <InputField
              key="location"
              label="Location"
              value={formData.location}
              onChangeText={handleLocationChange}
              placeholder="Enter your location (e.g., London, UK)"
            />

            <InputField
              key="bio"
              label="Bio"
              value={formData.bio}
              onChangeText={handleBioChange}
              placeholder="Tell us about yourself..."
              multiline={true}
            />

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#6c5ce7" />
              <Text style={styles.infoText}>
                Email and account type cannot be changed after registration for security reasons.
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.saveButtonText}>Saving...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  avatarSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#6c5ce7',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  avatarSubtext: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#f1f3f4',
    color: '#666',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#6c5ce7',
    marginLeft: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
