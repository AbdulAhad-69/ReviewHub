import { ProductAPI } from '../api/productApi.js';
import { Router } from '../app.js';

export const Home = async () => {
    let productsHtml = '';
    
    try {
        // Fetch products from our Node/Express backend
        const response = await ProductAPI.getAllProducts();
        const products = response.data;

        if (products.length === 0) {
            productsHtml = `<div class="col-span-full text-center text-gray-500 py-10">No products found. Please run the backend seeder script.</div>`;
        } else {
            // Map the data into dynamic UI cards
            productsHtml = products.map(p => `
                <div class="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-floating transition-all cursor-pointer group" onclick="window.Router.navigate('/product/${p._id}')">
                    <div class="h-48 overflow-hidden bg-gray-100 relative">
                        <img src="${p.imageUrl}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm flex items-center space-x-1">
                            <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <span>${p.metrics.avgRating}</span>
                        </div>
                    </div>
                    <div class="p-5">
                        <span class="text-xs font-semibold text-brand-600 uppercase tracking-wider">${p.category}</span>
                        <h3 class="text-lg font-bold text-gray-900 mt-1 mb-2 truncate">${p.name}</h3>
                        <p class="text-sm text-gray-500 line-clamp-2 mb-4">${p.description}</p>
                        <div class="flex items-center justify-between mt-auto">
                            <span class="text-xs text-gray-400 font-medium">${p.metrics.totalReviews} Verified Reviews</span>
                            <span class="text-xs font-semibold bg-brand-50 text-brand-700 px-2 py-1 rounded">Wilson Score: ${(p.metrics.wilsonScore * 100).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        productsHtml = `<div class="col-span-full text-center text-red-500 py-10 bg-red-50 rounded-xl">Failed to load products. Ensure backend is running.</div>`;
    }

    return `
        <div class="animate-fade-in">
            <div class="relative bg-surface-dark rounded-2xl overflow-hidden shadow-floating mt-6 mb-12">
                <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div class="relative px-8 py-20 md:py-28 text-center max-w-4xl mx-auto">
                    <span class="inline-block py-1 px-3 rounded-full bg-brand-900/50 text-brand-100 text-xs font-semibold tracking-wider uppercase mb-4 border border-brand-500/30">
                        The End of Fake Reviews
                    </span>
                    <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Buy with Confidence. <br/> <span class="text-brand-500">Verified Insights.</span>
                    </h1>
                    <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Stop suffering from analysis paralysis. ReviewHub connects you with heavily moderated, receipt-verified reviews from actual owners.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onclick="window.scrollTo({top: document.getElementById('trending-grid').offsetTop - 100, behavior: 'smooth'})" class="bg-brand-500 text-white font-semibold px-8 py-3 rounded-lg shadow-soft hover:bg-brand-600 transition-colors text-lg">
                            Explore Products
                        </button>
                    </div>
                </div>
            </div>

            <div id="trending-grid" class="py-8 scroll-mt-24">
                <div class="flex justify-between items-end mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-1">Trending Gear</h2>
                        <p class="text-gray-500 text-sm">Mathematically sorted by our Wilson Score algorithm.</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${productsHtml}
                </div>
            </div>
        </div>
    `;
};