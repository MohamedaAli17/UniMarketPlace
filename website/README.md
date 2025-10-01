# Sellora - University Marketplace

A full-stack university marketplace web application built with HTML, CSS, JavaScript, and Firebase. This application allows students at Brunel University to buy and sell products within their community.

## Features

### Authentication
- ✅ User registration with @brunel.ac.uk email validation
- ✅ Firebase Authentication integration
- ✅ Secure login/logout functionality

### Product Management
- ✅ Product listing page with grid view
- ✅ Add, edit, and delete products
- ✅ Product categories and stock management
- ✅ Search and filter functionality
- ✅ Real-time stock status indicators

### Dashboard
- ✅ Personal dashboard for sellers
- ✅ View own products and statistics
- ✅ Sales tracking and revenue monitoring

### Orders
- ✅ Order placement and tracking
- ✅ Order history for buyers
- ✅ Order status management

### Marketing
- ✅ Product promotion campaigns
- ✅ Three-tier marketing plans (Basic, Premium, Ultimate)
- ✅ Stripe payment integration for marketing
- ✅ Campaign analytics and tracking

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click "Add app" and select Web
   - Copy the configuration object

### 2. Update Firebase Configuration

Open `script.js` and replace the Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products can be read by anyone, written by authenticated users
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.sellerId == request.auth.uid || request.auth.uid == resource.data.sellerId);
    }
    
    // Orders can be read/written by the buyer or seller
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.buyerId == request.auth.uid || resource.data.sellerId == request.auth.uid);
    }
    
    // Campaigns can be read/written by the campaign owner
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Stripe Setup (Optional)

For payment functionality:

1. Create a [Stripe account](https://stripe.com/)
2. Get your publishable key from the dashboard
3. Update the Stripe configuration in `script.js`:

```javascript
const stripe = Stripe('pk_test_your_stripe_public_key');
```

### 5. Run the Application

1. Open `index.html` in a web browser
2. Or serve the files using a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## File Structure

```
website/
├── index.html          # Main products page
├── dashboard.html      # User dashboard
├── orders.html         # Order management
├── marketing.html      # Marketing campaigns
├── products.html       # Products listing
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Usage

### For Students (Buyers)
1. Register with your @brunel.ac.uk email
2. Browse products on the main page
3. Use search and filters to find items
4. Click "Buy Now" to purchase products
5. Track your orders in the Orders page

### For Sellers
1. Register and login to your account
2. Go to Dashboard to add products
3. Fill in product details (name, category, price, description, image, stock)
4. Manage your products (edit/delete)
5. View sales statistics and revenue
6. Promote products using marketing campaigns

### Marketing Campaigns
1. Go to Marketing page
2. Choose a promotion plan:
   - **Basic Boost** (£5): 7 days, 2x visibility
   - **Premium Boost** (£15): 14 days, 5x visibility
   - **Ultimate Boost** (£30): 30 days, 10x visibility
3. Select a product to promote
4. Complete payment (demo mode)
5. Track campaign performance

## Features in Detail

### Email Validation
- Only @brunel.ac.uk email addresses are accepted for registration
- Real-time validation during registration process

### Product Management
- Image upload via URL
- Stock level tracking with visual indicators
- Category-based organization
- Search functionality across name, category, and description

### Order System
- Real-time order placement
- Automatic stock deduction
- Order status tracking
- Seller revenue updates

### Responsive Design
- Mobile-friendly interface
- Grid and list view options
- Adaptive layout for different screen sizes

## Security Features

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Email domain validation for university access
- User-specific data isolation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **Firebase not connecting**: Check your configuration in `script.js`
2. **Authentication not working**: Verify Firebase Auth is enabled
3. **Database errors**: Check Firestore security rules
4. **Images not loading**: Ensure image URLs are valid and accessible

### Development Tips

- Use browser developer tools to debug JavaScript
- Check Firebase console for authentication and database logs
- Test with different @brunel.ac.uk email addresses
- Verify all form validations are working

## Future Enhancements

- Real-time chat between buyers and sellers
- Product image upload (not just URLs)
- Advanced analytics and reporting
- Mobile app development
- Integration with university systems
- Review and rating system
- Category-based notifications

## Support

For technical support or questions, please contact the development team or refer to the Firebase documentation.

## License

This project is created for educational purposes at Brunel University.
