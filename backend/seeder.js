import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Review from './models/Review.js'; 
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const exactProducts = [
    {
        name: "Apple MacBook Pro 16-inch (M3 Max)",
        category: "Laptops",
        description: "The ultimate pro laptop. Features the M3 Max chip with a 16-core CPU, 40-core GPU, and up to 128GB of unified memory. The Liquid Retina XDR display is industry-leading.",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=pad&w=800&h=800&bg=ffffff&q=80",
        specs: { "CPU": "Apple M3 Max", "RAM": "128GB Unified", "Storage": "4TB NVMe", "Display": "Liquid Retina XDR" },
        metrics: { avgRating: 4.9, totalReviews: 342, wilsonScore: 0.96 }
    },
    {
        name: "Dell XPS 15 (OLED)",
        category: "Laptops",
        description: "A premium Windows ultrabook machined from a single block of aluminum. Features a stunning 3.5K OLED touchscreen and an NVIDIA RTX 4070 for creative workloads.",
        imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=pad&w=800&h=800&bg=ffffff&q=80",
        specs: { "CPU": "Intel Core i9", "RAM": "64GB DDR5", "GPU": "RTX 4070", "Display": "3.5K OLED" },
        metrics: { avgRating: 4.7, totalReviews: 215, wilsonScore: 0.92 }
    },
    {
        name: "Sony Alpha a7S III",
        category: "Cameras",
        description: "The undisputed king of low-light video. A 12.1MP full-frame sensor capable of 4K 120p 10-bit 4:2:2 recording with zero overheating limits.",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=pad&w=800&h=800&bg=ffffff&q=80",
        specs: { "Sensor": "12.1MP Full-Frame", "Video": "4K 120p", "ISO": "409,600 Max", "Mount": "Sony E" },
        metrics: { avgRating: 4.8, totalReviews: 412, wilsonScore: 0.95 }
    },
    {
        name: "Keychron Q1 Pro Wireless",
        category: "Peripherals",
        description: "An enthusiast-grade 75% mechanical keyboard. Full CNC aluminum body, double-gasket design, and fully customizable via QMK/VIA software.",
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=pad&w=800&h=800&bg=ffffff&q=80",
        specs: { "Layout": "75%", "Switches": "K Pro Red", "Connectivity": "Bluetooth 5.1", "Body": "Aluminum" },
        metrics: { avgRating: 4.6, totalReviews: 189, wilsonScore: 0.89 }
    },
    {
        name: "Sony WH-1000XM5",
        category: "Audio",
        description: "Industry-leading noise cancellation powered by two processors and eight microphones. Features ultra-comfortable soft fit leather and 30 hours of battery life.",
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=pad&w=800&h=800&bg=ffffff&q=80",
        specs: { "Type": "Over-Ear", "ANC": "Adaptive Dual Processor", "Battery": "30 Hours", "Bluetooth": "5.2" },
        metrics: { avgRating: 4.7, totalReviews: 856, wilsonScore: 0.94 }
    },
    {
        name: "Samsung Odyssey Neo G9",
        category: "Monitors",
        description: "A ridiculous 49-inch curved gaming monitor. Quantum Mini-LED technology delivers 2000-nit peak brightness with a 240Hz refresh rate.",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=pad&w=800&h=800&bg=ffffff&q=80",
        specs: { "Size": "49-inch Ultrawide", "Panel": "Mini-LED", "Refresh": "240Hz", "Curve": "1000R" },
        metrics: { avgRating: 4.5, totalReviews: 124, wilsonScore: 0.87 }
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); 
        await Review.deleteMany();  

        await Product.insertMany(exactProducts);
        
        console.log(`✅ ${exactProducts.length} Exact, Verified Products Successfully Injected!`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error with seeder: ${error.message}`);
        process.exit(1);
    }
};

importData();