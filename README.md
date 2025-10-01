# 🎓 UniMarketPlace (Sellora)

A comprehensive university marketplace platform that connects students for buying and selling products within their campus community. Built with React Native for mobile and vanilla web technologies for the web interface.

## 🌟 Features

### For Students (Buyers)
- **Browse Products**: Discover items from fellow students
- **Smart Search**: Find products by category, price, or keywords
- **Secure Messaging**: Chat with sellers directly
- **Order Management**: Track your purchases and order history
- **Profile Management**: Customize your buyer profile

### For Students (Sellers)
- **Product Management**: Add, edit, and manage your product listings
- **Dashboard Analytics**: Track sales and performance metrics
- **Marketing Tools**: Promote your products effectively
- **Order Processing**: Manage incoming orders and customer communications
- **Inventory Control**: Keep track of your available products

### Platform Features
- **Dual Interface**: Mobile app (React Native) and web dashboard
- **Real-time Messaging**: Instant communication between buyers and sellers
- **Firebase Integration**: Secure authentication and data storage
- **Offline Support**: Works even with poor internet connectivity
- **Responsive Design**: Optimized for all device sizes

## 🚀 Tech Stack

### Mobile App (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **UI Components**: Custom components with React Native
- **Icons**: Expo Vector Icons

### Web Dashboard
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome
- **Backend**: Firebase integration
- **Responsive**: Mobile-first design approach

## 📱 Mobile App Structure

```
app/
├── components/          # Reusable UI components
├── context/             # State management (Auth, Cart, Products, Orders)
├── screens/             # App screens
│   ├── buyer/          # Buyer-specific screens
│   └── seller/         # Seller-specific screens
├── config/             # Firebase configuration
├── utils/              # Utility functions
└── assets/             # Images and icons
```

## 🌐 Web Dashboard Structure

```
website/
├── index.html          # Main dashboard
├── products.html       # Product management
├── orders.html         # Order management
├── marketing.html      # Marketing tools
├── dashboard.html      # Analytics dashboard
├── styles.css          # Global styles
└── script.js           # JavaScript functionality
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project setup

### Mobile App Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohamedaAli17/UniMarketPlace.git
   cd UniMarketPlace
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication and Firestore Database
   - Copy your Firebase config to `app/config/firebase.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   
   # For web
   npm run web
   ```

### Web Dashboard Setup

1. **Navigate to website directory**
   ```bash
   cd website
   ```

2. **Configure Firebase**
   - Update `firebase-config-template.js` with your Firebase config
   - Rename it to `firebase-config.js`

3. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage (for product images)
3. Update the configuration files with your Firebase credentials

### Environment Variables
Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

## 📱 Screenshots

*Add screenshots of your app here*

## 🎯 Key Features Implementation

### Authentication System
- Secure user registration and login
- Role-based access (Buyer/Seller)
- Profile management with image upload

### Product Management
- Image upload with camera integration
- Category-based organization
- Price and description management
- Inventory tracking

### Real-time Communication
- In-app messaging system
- Push notifications
- Order status updates

### Shopping Experience
- Shopping cart functionality
- Secure checkout process
- Order history and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Mohamed Ali** - Project Lead & Full Stack Developer
- *Add other team members here*

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/MohamedaAli17/UniMarketPlace/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🗺️ Roadmap

- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] API documentation

## 📊 Project Status

- ✅ Core functionality implemented
- ✅ Mobile app (React Native)
- ✅ Web dashboard
- ✅ Firebase integration
- ✅ User authentication
- ✅ Product management
- ✅ Order system
- 🔄 Testing and optimization
- 📋 Deployment preparation

---

**Built with ❤️ for university students by university students**
