// Demo Data for Testing
// This file contains sample data that can be used to populate the marketplace for testing purposes

const demoProducts = [
    {
        name: "Apple iPad (Gen 10)",
        category: "Smartphone",
        price: 499,
        description: "Latest generation iPad with advanced features and stunning display.",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        stock: 0,
        sellerId: "demo-seller-1",
        sellerEmail: "demo1@brunel.ac.uk"
    },
    {
        name: "Apple iPhone 13",
        category: "Smartphone", 
        price: 599,
        description: "Powerful iPhone with advanced camera system and A15 Bionic chip.",
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        stock: 0,
        sellerId: "demo-seller-2",
        sellerEmail: "demo2@brunel.ac.uk"
    },
    {
        name: "Samsung Galaxy S23",
        category: "Smartphone",
        price: 999,
        description: "Premium Android smartphone with exceptional camera capabilities.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        stock: 0,
        sellerId: "demo-seller-3",
        sellerEmail: "demo3@brunel.ac.uk"
    },
    {
        name: "Razer Kraken Headset",
        category: "Accessories",
        price: 99,
        description: "High-quality gaming headset with superior audio and comfort.",
        imageUrl: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400",
        stock: 0,
        sellerId: "demo-seller-4",
        sellerEmail: "demo4@brunel.ac.uk"
    },
    {
        name: "Dell XPS 15",
        category: "Laptop & PC",
        price: 1799,
        description: "Premium laptop with stunning 4K display and powerful performance.",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        stock: 0,
        sellerId: "demo-seller-5",
        sellerEmail: "demo5@brunel.ac.uk"
    },
    {
        name: "Apple iMac 2023",
        category: "Laptop & PC",
        price: 5196,
        description: "All-in-one desktop with M3 chip and stunning 24-inch display.",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
        stock: 3,
        sellerId: "demo-seller-6",
        sellerEmail: "demo6@brunel.ac.uk"
    },
    {
        name: "Logitech MX Master 3S",
        category: "Accessories",
        price: 99,
        description: "Ergonomic wireless mouse with precision tracking and long battery life.",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        stock: 15,
        sellerId: "demo-seller-7",
        sellerEmail: "demo7@brunel.ac.uk"
    },
    {
        name: "AirPods Pro (2nd Gen)",
        category: "Accessories",
        price: 249,
        description: "Wireless earbuds with active noise cancellation and spatial audio.",
        imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
        stock: 0,
        sellerId: "demo-seller-8",
        sellerEmail: "demo8@brunel.ac.uk"
    },
    {
        name: "MacBook Pro 14-inch",
        category: "Laptop & PC",
        price: 1999,
        description: "Professional laptop with M3 Pro chip and Liquid Retina XDR display.",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        stock: 2,
        sellerId: "demo-seller-9",
        sellerEmail: "demo9@brunel.ac.uk"
    },
    {
        name: "Sony WH-1000XM5",
        category: "Accessories",
        price: 399,
        description: "Premium noise-cancelling headphones with industry-leading sound quality.",
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        stock: 8,
        sellerId: "demo-seller-10",
        sellerEmail: "demo10@brunel.ac.uk"
    },
    {
        name: "Programming Fundamentals",
        category: "Books",
        price: 45,
        description: "Essential programming concepts and practices for computer science students.",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        stock: 12,
        sellerId: "demo-seller-11",
        sellerEmail: "demo11@brunel.ac.uk"
    },
    {
        name: "Data Structures & Algorithms",
        category: "Books",
        price: 65,
        description: "Comprehensive guide to data structures and algorithms with practical examples.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        stock: 5,
        sellerId: "demo-seller-12",
        sellerEmail: "demo12@brunel.ac.uk"
    }
];

const demoUsers = [
    {
        name: "John Smith",
        email: "john.smith@brunel.ac.uk",
        totalSales: 15,
        totalRevenue: 2500
    },
    {
        name: "Sarah Johnson",
        email: "sarah.johnson@brunel.ac.uk", 
        totalSales: 8,
        totalRevenue: 1200
    },
    {
        name: "Mike Chen",
        email: "mike.chen@brunel.ac.uk",
        totalSales: 22,
        totalRevenue: 3500
    }
];

const demoOrders = [
    {
        buyerId: "demo-buyer-1",
        buyerEmail: "buyer1@brunel.ac.uk",
        sellerId: "demo-seller-1",
        productId: "demo-product-1",
        productName: "Apple iPad (Gen 10)",
        productImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        price: 499,
        status: "completed",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        buyerId: "demo-buyer-2",
        buyerEmail: "buyer2@brunel.ac.uk",
        sellerId: "demo-seller-2",
        productId: "demo-product-2",
        productName: "Apple iPhone 13",
        productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        price: 599,
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
];

const demoCampaigns = [
    {
        userId: "demo-seller-1",
        productId: "demo-product-1",
        plan: "premium",
        amount: 15,
        status: "active",
        impressions: 1250,
        clicks: 45,
        ctr: 3.6,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        expiresAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000) // 11 days from now
    }
];

// Function to populate demo data (call this in browser console for testing)
async function populateDemoData() {
    console.log("Populating demo data...");
    
    try {
        // Add demo products
        for (const product of demoProducts) {
            await db.collection('products').add({
                ...product,
                views: Math.floor(Math.random() * 100),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Add demo users
        for (const user of demoUsers) {
            await db.collection('users').add({
                ...user,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Add demo orders
        for (const order of demoOrders) {
            await db.collection('orders').add({
                ...order,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Add demo campaigns
        for (const campaign of demoCampaigns) {
            await db.collection('campaigns').add({
                ...campaign,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        console.log("Demo data populated successfully!");
    } catch (error) {
        console.error("Error populating demo data:", error);
    }
}

// Function to clear all data (use with caution)
async function clearAllData() {
    if (!confirm("Are you sure you want to clear all data? This cannot be undone!")) {
        return;
    }
    
    console.log("Clearing all data...");
    
    try {
        // Clear products
        const productsSnapshot = await db.collection('products').get();
        const productPromises = productsSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(productPromises);
        
        // Clear users
        const usersSnapshot = await db.collection('users').get();
        const userPromises = usersSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(userPromises);
        
        // Clear orders
        const ordersSnapshot = await db.collection('orders').get();
        const orderPromises = ordersSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(orderPromises);
        
        // Clear campaigns
        const campaignsSnapshot = await db.collection('campaigns').get();
        const campaignPromises = campaignsSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(campaignPromises);
        
        console.log("All data cleared successfully!");
    } catch (error) {
        console.error("Error clearing data:", error);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        demoProducts,
        demoUsers,
        demoOrders,
        demoCampaigns,
        populateDemoData,
        clearAllData
    };
}
