import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

// Load env vars and connect to DB
dotenv.config();
connectDB();

const sampleProducts = [
    {
        name: "Dell XPS 15 (2025)",
        category: "Laptops",
        description: "High-performance laptop perfect for heavy IDE compilation and multitasking.",
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
        specs: { "RAM": "32GB", "Storage": "1TB NVMe", "CPU": "Intel i9" },
        metrics: { avgRating: 4.8, totalReviews: 142, wilsonScore: 0.95 }
    },
    {
        name: "Sony Alpha A7 IV",
        category: "Cameras",
        description: "Hybrid full-frame mirrorless camera for photography hobbyists and professionals.",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        specs: { "Resolution": "33MP", "Video": "4K 60p", "Mount": "Sony E" },
        metrics: { avgRating: 4.9, totalReviews: 89, wilsonScore: 0.92 }
    },
    {
        name: "Keychron Q1 Pro",
        category: "Peripherals",
        description: "Custom mechanical keyboard with full aluminum body and QMK/VIA support.",
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        specs: { "Layout": "75%", "Switches": "Banana", "Body": "Aluminum" },
        metrics: { avgRating: 4.7, totalReviews: 215, wilsonScore: 0.94 }
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); // Clear existing data to prevent duplicates
        await Product.insertMany(sampleProducts);
        console.log('✅ Sample Products Imported!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with seeder: ${error.message}`);
        process.exit(1);
    }
};

importData();