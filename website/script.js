// Firebase Configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Stripe Configuration
const stripe = Stripe('pk_test_your_stripe_public_key'); // Replace with your Stripe public key

// Global Variables
let currentUser = null;
let currentPage = 1;
let itemsPerPage = 8;
let allProducts = [];
let filteredProducts = [];
let currentFilter = {};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Check authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            updateUserInterface();
            await loadUserData();
        } else {
            showLoginModal();
        }
    });

    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    switch(currentPage) {
        case 'index.html':
        case '':
            await loadProducts();
            break;
        case 'dashboard.html':
            await loadDashboard();
            break;
        case 'orders.html':
            await loadOrders();
            break;
        case 'marketing.html':
            await loadMarketing();
            break;
        case 'products.html':
            await loadProducts();
            break;
    }

    setupEventListeners();
}

// Authentication Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function showRegisterModal() {
    hideLoginModal();
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

async function login(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        hideLoginModal();
        showNotification('Login successful!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function register(name, email, password) {
    // Validate email domain
    if (!email.endsWith('@brunel.ac.uk')) {
        showNotification('Only @brunel.ac.uk email addresses are allowed', 'error');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        // Create user document in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            totalSales: 0,
            totalRevenue: 0
        });

        hideRegisterModal();
        showNotification('Registration successful!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function logout() {
    try {
        await auth.signOut();
        currentUser = null;
        window.location.href = 'index.html';
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Product Management Functions
async function loadProducts() {
    try {
        const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
        allProducts = [];
        snapshot.forEach(doc => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });
        
        filteredProducts = [...allProducts];
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products', 'error');
    }
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    container.innerHTML = '';

    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });

    updatePagination();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
             alt="${product.name}" class="product-image" 
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="product-footer">
                <span class="stock-status ${getStockStatus(product.stock)}">${getStockStatusText(product.stock)}</span>
                <span class="product-price">£${product.price}</span>
            </div>
            <div class="product-actions">
                <button class="buy-btn" ${product.stock <= 0 ? 'disabled' : ''} 
                        onclick="buyProduct('${product.id}')">
                    ${product.stock <= 0 ? 'Sold Out' : 'Buy Now'}
                </button>
                <button class="product-menu" onclick="showProductDetails('${product.id}')">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

function getStockStatus(stock) {
    if (stock <= 0) return 'sold-out';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
}

function getStockStatusText(stock) {
    if (stock <= 0) return 'Sold Out';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
}

async function buyProduct(productId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    const product = allProducts.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        showNotification('Product is out of stock', 'error');
        return;
    }

    try {
        // Create order
        const orderData = {
            buyerId: currentUser.uid,
            buyerEmail: currentUser.email,
            sellerId: product.sellerId,
            productId: productId,
            productName: product.name,
            productImage: product.imageUrl,
            price: product.price,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('orders').add(orderData);

        // Update product stock
        await db.collection('products').doc(productId).update({
            stock: product.stock - 1
        });

        // Update seller's stats
        await db.collection('users').doc(product.sellerId).update({
            totalSales: firebase.firestore.FieldValue.increment(1),
            totalRevenue: firebase.firestore.FieldValue.increment(product.price)
        });

        showNotification('Order placed successfully!', 'success');
        await loadProducts(); // Refresh products
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error placing order', 'error');
    }
}

// Dashboard Functions
async function loadDashboard() {
    if (!currentUser) return;

    try {
        // Load user's products
        const productsSnapshot = await db.collection('products')
            .where('sellerId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const userProducts = [];
        productsSnapshot.forEach(doc => {
            userProducts.push({ id: doc.id, ...doc.data() });
        });

        displayUserProducts(userProducts);

        // Load user stats
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();

        updateDashboardStats(userData, userProducts);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Error loading dashboard', 'error');
    }
}

function displayUserProducts(products) {
    const container = document.getElementById('myProductsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="no-products">You haven\'t added any products yet</div>';
        return;
    }

    products.forEach(product => {
        const productCard = createUserProductCard(product);
        container.appendChild(productCard);
    });
}

function createUserProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}" 
             alt="${product.name}" class="product-image" 
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="product-footer">
                <span class="stock-status ${getStockStatus(product.stock)}">${getStockStatusText(product.stock)}</span>
                <span class="product-price">£${product.price}</span>
            </div>
            <div class="product-actions">
                <button class="btn-secondary" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-secondary" onclick="deleteProduct('${product.id}')" style="background-color: #dc3545; color: white;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    return card;
}

function updateDashboardStats(userData, products) {
    const totalProducts = products.length;
    const totalSales = userData?.totalSales || 0;
    const totalRevenue = userData?.totalRevenue || 0;
    const totalViews = products.reduce((sum, product) => sum + (product.views || 0), 0);

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalSales').textContent = totalSales;
    document.getElementById('totalRevenue').textContent = `£${totalRevenue.toFixed(2)}`;
    document.getElementById('totalViews').textContent = totalViews;
}

// Orders Functions
async function loadOrders() {
    if (!currentUser) return;

    try {
        const ordersSnapshot = await db.collection('orders')
            .where('buyerId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = [];
        ordersSnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        displayOrders(orders);
        updateOrderStats(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Error loading orders', 'error');
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<div class="no-orders">You haven\'t placed any orders yet</div>';
        return;
    }

    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        container.appendChild(orderCard);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <span class="order-id">Order #${order.id.substring(0, 8)}</span>
            <span class="order-date">${formatDate(order.createdAt)}</span>
            <span class="order-status ${order.status}">${order.status}</span>
        </div>
        <div class="order-items">
            <div class="order-item">
                <img src="${order.productImage}" alt="${order.productName}" class="order-item-image">
                <div class="order-item-info">
                    <div class="order-item-name">${order.productName}</div>
                    <div class="order-item-price">£${order.price}</div>
                </div>
            </div>
        </div>
        <div class="order-total">
            <span>Total:</span>
            <span class="order-total-amount">£${order.price}</span>
        </div>
    `;
    return card;
}

function updateOrderStats(orders) {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalSpent').textContent = `£${totalSpent.toFixed(2)}`;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
}

// Marketing Functions
async function loadMarketing() {
    if (!currentUser) return;

    try {
        // Load user's campaigns
        const campaignsSnapshot = await db.collection('campaigns')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const campaigns = [];
        campaignsSnapshot.forEach(doc => {
            campaigns.push({ id: doc.id, ...doc.data() });
        });

        displayCampaigns(campaigns);
        updateMarketingStats(campaigns);
    } catch (error) {
        console.error('Error loading marketing data:', error);
        showNotification('Error loading marketing data', 'error');
    }
}

function displayCampaigns(campaigns) {
    const container = document.getElementById('campaignsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (campaigns.length === 0) {
        container.innerHTML = '<div class="no-campaigns">You don\'t have any active campaigns</div>';
        return;
    }

    campaigns.forEach(campaign => {
        const campaignCard = createCampaignCard(campaign);
        container.appendChild(campaignCard);
    });
}

function createCampaignCard(campaign) {
    const card = document.createElement('div');
    card.className = 'campaign-card';
    card.innerHTML = `
        <div class="campaign-header">
            <span class="campaign-name">${campaign.plan} Campaign</span>
            <span class="campaign-status ${campaign.status}">${campaign.status}</span>
        </div>
        <div class="campaign-details">
            <div class="campaign-stat">
                <div class="campaign-stat-value">${campaign.impressions || 0}</div>
                <div class="campaign-stat-label">Impressions</div>
            </div>
            <div class="campaign-stat">
                <div class="campaign-stat-value">${campaign.clicks || 0}</div>
                <div class="campaign-stat-label">Clicks</div>
            </div>
            <div class="campaign-stat">
                <div class="campaign-stat-value">${campaign.ctr || 0}%</div>
                <div class="campaign-stat-label">CTR</div>
            </div>
        </div>
    `;
    return card;
}

function updateMarketingStats(campaigns) {
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
    const marketingSpend = campaigns.reduce((sum, c) => sum + (c.amount || 0), 0);

    document.getElementById('activeCampaigns').textContent = activeCampaigns;
    document.getElementById('totalImpressions').textContent = totalImpressions;
    document.getElementById('totalClicks').textContent = totalClicks;
    document.getElementById('marketingSpend').textContent = `£${marketingSpend.toFixed(2)}`;
}

// Product Management Functions
async function addProduct(productData) {
    if (!currentUser) return;

    try {
        const product = {
            ...productData,
            sellerId: currentUser.uid,
            sellerEmail: currentUser.email,
            views: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('products').add(product);
        showNotification('Product added successfully!', 'success');
        hideModal('addProductModal');
        document.getElementById('productForm').reset();
        
        // Reload products
        if (window.location.pathname.includes('dashboard')) {
            await loadDashboard();
        } else {
            await loadProducts();
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product', 'error');
    }
}

async function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Populate edit form
    document.getElementById('editProductId').value = productId;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.imageUrl;
    document.getElementById('editProductStock').value = product.stock;

    showModal('editProductModal');
}

async function updateProduct(productId, productData) {
    try {
        await db.collection('products').doc(productId).update(productData);
        showNotification('Product updated successfully!', 'success');
        hideModal('editProductModal');
        await loadDashboard();
    } catch (error) {
        console.error('Error updating product:', error);
        showNotification('Error updating product', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await db.collection('products').doc(productId).delete();
        showNotification('Product deleted successfully!', 'success');
        await loadDashboard();
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product', 'error');
    }
}

// Marketing Payment Functions
async function initiateMarketingPayment(plan, price) {
    if (!currentUser) {
        showLoginModal();
        return;
    }

    // Load user's products for selection
    const productsSnapshot = await db.collection('products')
        .where('sellerId', '==', currentUser.uid)
        .get();

    const userProducts = [];
    productsSnapshot.forEach(doc => {
        userProducts.push({ id: doc.id, ...doc.data() });
    });

    if (userProducts.length === 0) {
        showNotification('You need to add products before promoting them', 'error');
        return;
    }

    // Store selected plan data
    window.selectedPlan = { plan, price };
    
    // Show product selection modal
    showProductSelectionModal(userProducts);
}

function showProductSelectionModal(products) {
    const container = document.getElementById('productSelection');
    container.innerHTML = '';

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'product-selection-item';
        item.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="product-selection-image">
            <div class="product-selection-info">
                <div class="product-selection-name">${product.name}</div>
                <div class="product-selection-price">£${product.price}</div>
            </div>
        `;
        item.onclick = () => selectProductForPromotion(product);
        container.appendChild(item);
    });

    showModal('productSelectModal');
}

function selectProductForPromotion(product) {
    window.selectedProduct = product;
    hideModal('productSelectModal');
    showPaymentModal();
}

function showPaymentModal() {
    const plan = window.selectedPlan;
    const product = window.selectedProduct;

    document.getElementById('selectedPlanName').textContent = plan.plan;
    document.getElementById('selectedProductName').textContent = product.name;
    document.getElementById('totalAmount').textContent = `£${plan.price}`;

    showModal('paymentModal');
    initializeStripePayment(plan.price);
}

async function initializeStripePayment(amount) {
    try {
        // In a real application, you would create a payment intent on your server
        // For demo purposes, we'll simulate the payment process
        const paymentElement = document.getElementById('stripe-payment-element');
        paymentElement.innerHTML = `
            <div style="padding: 1rem; border: 1px solid #e9ecef; border-radius: 8px; background-color: #f8f9fa;">
                <p>Demo Payment Form</p>
                <p>Amount: £${amount}</p>
                <p>In a real application, this would be a Stripe payment form.</p>
            </div>
        `;
    } catch (error) {
        console.error('Error initializing payment:', error);
        showNotification('Error initializing payment', 'error');
    }
}

async function processMarketingPayment() {
    try {
        const plan = window.selectedPlan;
        const product = window.selectedProduct;

        // Create campaign
        const campaignData = {
            userId: currentUser.uid,
            productId: product.id,
            plan: plan.plan,
            amount: plan.price,
            status: 'active',
            impressions: 0,
            clicks: 0,
            ctr: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            expiresAt: new Date(Date.now() + getCampaignDuration(plan.plan) * 24 * 60 * 60 * 1000)
        };

        await db.collection('campaigns').add(campaignData);

        showNotification('Campaign created successfully!', 'success');
        hideModal('paymentModal');
        await loadMarketing();
    } catch (error) {
        console.error('Error processing payment:', error);
        showNotification('Error processing payment', 'error');
    }
}

function getCampaignDuration(plan) {
    switch(plan) {
        case 'basic': return 7;
        case 'premium': return 14;
        case 'ultimate': return 30;
        default: return 7;
    }
}

// Utility Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;

    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = '#6c5ce7';
    }

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateUserInterface() {
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && currentUser) {
        userAvatar.innerHTML = `<i class="fas fa-user"></i>`;
        userAvatar.title = currentUser.email;
    }
}

async function loadUserData() {
    // Load any user-specific data needed across pages
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentPageElement = document.getElementById('currentPage');
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
}

// Event Listeners
function setupEventListeners() {
    // Authentication modals
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const addProductModal = document.getElementById('addProductModal');
    const editProductModal = document.getElementById('editProductModal');

    // Close modal buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-btn') || e.target.closest('.close-btn')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        }
    });

    // Modal backdrop clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await login(email, password);
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }

            await register(name, email, password);
        });
    }

    // Product form
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const productData = {
                name: formData.get('productName'),
                category: formData.get('productCategory'),
                price: parseFloat(formData.get('productPrice')),
                description: formData.get('productDescription'),
                imageUrl: formData.get('productImage'),
                stock: parseInt(formData.get('productStock'))
            };
            await addProduct(productData);
        });
    }

    // Edit product form
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const productId = document.getElementById('editProductId').value;
            const formData = new FormData(e.target);
            const productData = {
                name: formData.get('productName'),
                category: formData.get('productCategory'),
                price: parseFloat(formData.get('productPrice')),
                description: formData.get('productDescription'),
                imageUrl: formData.get('productImage'),
                stock: parseInt(formData.get('productStock'))
            };
            await updateProduct(productId, productData);
        });
    }

    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            showModal('addProductModal');
        });
    }

    // Marketing plan buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('plan-btn')) {
            const plan = e.target.dataset.plan;
            const price = parseFloat(e.target.dataset.price);
            initiateMarketingPayment(plan, price);
        }
    });

    // Payment submit button
    const submitPaymentBtn = document.getElementById('submit-payment');
    if (submitPaymentBtn) {
        submitPaymentBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await processMarketingPayment();
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filteredProducts = allProducts.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
            currentPage = 1;
            displayProducts();
        });
    }

    // Filter functionality
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const filterPanel = document.getElementById('filterPanel');
            if (filterPanel) {
                filterPanel.style.display = filterPanel.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Apply filters
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const category = document.getElementById('categoryFilter').value;
            const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
            const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
            const stock = document.getElementById('stockFilter').value;

            filteredProducts = allProducts.filter(product => {
                const categoryMatch = !category || product.category === category;
                const priceMatch = product.price >= minPrice && product.price <= maxPrice;
                const stockMatch = !stock || getStockStatus(product.stock) === stock;

                return categoryMatch && priceMatch && stockMatch;
            });

            currentPage = 1;
            displayProducts();
        });
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.getElementById('categoryFilter').value = '';
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            document.getElementById('stockFilter').value = '';
            
            filteredProducts = [...allProducts];
            currentPage = 1;
            displayProducts();
        });
    }

    // Auth modal switches
    const showRegisterLink = document.getElementById('showRegister');
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterModal();
        });
    }

    const showLoginLink = document.getElementById('showLogin');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }

    // User avatar click (logout)
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                logout();
            }
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
