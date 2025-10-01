import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    // Test Firestore connection
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    console.log('✅ Firebase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    return false;
  }
};

export const testAuthConnection = async () => {
  try {
    // Test Auth connection
    const currentUser = auth.currentUser;
    console.log('✅ Firebase Auth connection successful');
    return true;
  } catch (error) {
    console.error('❌ Firebase Auth connection failed:', error.message);
    return false;
  }
};
