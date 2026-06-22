import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Review from './models/Review.js'; 
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const generateHundredProducts = () => {
    const products = [];
    
    // 25 Unique, Realistic Hardware Photographs
    const categories = [
        {
            name: "Laptops",
            brands: [
                { name: "MacBook Pro", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80" },
                { name: "Dell XPS", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80" },
                { name: "ThinkPad X1", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80" },
                { name: "Razer Blade", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80" },
                { name: "ASUS ROG", image: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=800&q=80" }
            ]
        },
        {
            name: "Cameras",
            brands: [
                { name: "Sony Alpha", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" },
                { name: "Canon EOS", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80" },
                { name: "Nikon Z", image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80" },
                { name: "Fujifilm X-T", image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80" },
                { name: "Panasonic Lumix", image: "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&q=80" }
            ]
        },
        {
            name: "Peripherals",
            brands: [
                { name: "Keychron Q", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80" },
                { name: "Logitech MX", image: "https://images.unsplash.com/photo-1615663245857-ac9310038829?w=800&q=80" },
                { name: "Razer Huntsman", image: "https://images.unsplash.com/photo-1605542037922-83b6f007e034?w=800&q=80" },
                { name: "Corsair K", image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&q=80" },
                { name: "SteelSeries", image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80" }
            ]
        },
        {
            name: "Audio",
            brands: [
                { name: "Sony WH", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80" },
                { name: "Sennheiser", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80" },
                { name: "Bose QC", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
                { name: "AirPods Max", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&q=80" },
                { name: "Shure AONIC", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80" }
            ]
        },
        {
            name: "Monitors",
            brands: [
                { name: "Samsung Odyssey", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80" },
                { name: "LG UltraGear", image: "https://images.unsplash.com/photo-1552831388-6a0b35077328?w=800&q=80" },
                { name: "Dell UltraSharp", image: "https://images.unsplash.com/photo-1616763355548-1b606f439fce?w=800&q=80" },
                { name: "ASUS ProArt", image: "https://images.unsplash.com/photo-1586952518485-11b180e92764?w=800&q=80" },
                { name: "BenQ PD", image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80" }
            ]
        }
    ];

    const descriptions = [
        "Engineered for unparalleled performance, offering robust multitasking and next-generation processing power.",
        "A premium choice for professionals who demand exceptional build quality and top-tier reliability.",
        "Sleek, modern, and highly efficient. Designed to seamlessly integrate into your daily workflow.",
        "Experience flagship-level features with uncompromising speed and an ultra-durable chassis."
    ];

    categories.forEach(cat => {
        cat.brands.forEach(brandObj => {
            // Generate 4 generations/variations per brand to hit exactly 100
            for (let i = 1; i <= 4; i++) {
                const score = (Math.random() * (0.98 - 0.70) + 0.70).toFixed(2);
                const reviews = Math.floor(Math.random() * 500) + 10;
                const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);

                products.push({
                    name: `${brandObj.name} Gen ${i} (202${i+1})`,
                    category: cat.name,
                    description: descriptions[i - 1],
                    imageUrl: brandObj.image,
                    specs: {
                        "Generation": `Mark ${i}`,
                        "Release Year": `202${i+1}`,
                        "Build Quality": "Premium Aluminum/Composite"
                    },
                    metrics: { avgRating: Number(rating), totalReviews: reviews, wilsonScore: Number(score) }
                });
            }
        });
    });

    return products;
};

const sampleProducts = generateHundredProducts();

const importData = async () => {
    try {
        await Product.deleteMany(); 
        await Review.deleteMany();  

        await Product.insertMany(sampleProducts);
        
        console.log(`✅ ${sampleProducts.length} Distinct Products Successfully Injected!`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error with seeder: ${error.message}`);
        process.exit(1);
    }
};

importData();