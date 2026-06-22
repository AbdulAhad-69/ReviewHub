import { ProductAPI } from '../api/productApi.js';
import { Router } from '../app.js';

export const Home = async () => {
    let productsHtml = '';
    
    try {
        const response = await ProductAPI.getAllProducts();
        const products = response.data;

        if (products.length === 0) {
            productsHtml = `<div class="col-span-full text-center text-gray-500 py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200 font-medium">No products found. Please run the backend seeder script.</div>`;
        } else {
            // Edge-to-Edge full bleed product cards
            productsHtml = products.map(p => `
                <div onclick="window.Router.navigate('/product/${p._id}')" class="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col h-full">
                    
                    <div class="relative h-56 w-full bg-gray-100 overflow-hidden">
                        <div class="absolute inset-0 border-b border-gray-200/80 z-10 pointer-events-none"></div>
                        <img src="${p.imageUrl}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy">
                        
                        <div class="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-black shadow-md border border-gray-100 flex items-center space-x-1">
                            <svg class="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                            <span class="text-gray-900">${p.metrics.avgRating}</span>
                        </div>
                        <div class="absolute top-3 right-3 z-20 bg-brand-50/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold shadow-md border border-brand-200 flex items-center">
                            <span class="text-brand-700">WS ${(p.metrics.wilsonScore * 100).toFixed(0)}</span>
                        </div>
                    </div>

                    <div class="p-5 flex flex-col flex-1 relative z-20 bg-white">
                        <span class="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-1.5">${p.category}</span>
                        <h3 class="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-brand-600 transition-colors line-clamp-1">${p.name}</h3>
                        <p class="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">${p.description}</p>
                        
                        <div class="pt-4 border-t border-gray-100 flex items-center justify-end mt-auto">
                            <span class="text-xs font-bold text-gray-400 group-hover:text-brand-600 transition-colors flex items-center">
                                View Specs
                                <svg class="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        productsHtml = `<div class="col-span-full text-center text-red-500 py-16 bg-red-50 rounded-2xl border border-red-100 font-bold">Failed to load products. Ensure your backend is running.</div>`;
    }

    return `
        <div class="animate-fade-in pb-16">
            <div class="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mt-6 mb-16 border border-gray-800 mx-4 sm:mx-8 lg:mx-12">
                <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
                <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-brand-600/30 to-transparent blur-3xl z-0 pointer-events-none"></div>
                
                <div class="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
                
                <div class="relative px-6 py-20 md:py-28 text-center max-w-4xl mx-auto z-10">
                    <span class="inline-block py-1.5 px-4 rounded-full bg-black/60 text-brand-400 text-xs font-black tracking-widest uppercase mb-6 border border-brand-500/30 backdrop-blur-md shadow-lg drop-shadow-md">
                        The End of Fake Reviews
                    </span>
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">
                        Buy with Confidence. <br/> <span class="text-brand-500 drop-shadow-lg">Verified Insights.</span>
                    </h1>
                    <p class="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                        Stop suffering from analysis paralysis. ReviewHub connects you with heavily moderated, receipt-verified reviews from actual owners.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5">
                        <button onclick="window.scrollTo({top: document.getElementById('trending-grid').offsetTop - 30, behavior: 'smooth'})" class="w-full sm:w-auto bg-brand-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(var(--brand-500),0.4)] hover:shadow-[0_0_30px_rgba(var(--brand-500),0.6)] hover:-translate-y-0.5 hover:bg-brand-500 transition-all duration-300 text-base">
                            Explore Products
                        </button>
                        <button onclick="window.Router.navigate('/compare')" class="w-full sm:w-auto bg-black/50 backdrop-blur-md text-white font-bold px-8 py-3.5 rounded-xl border border-gray-600 hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 text-base shadow-lg">
                            Compare Engine
                        </button>
                    </div>
                </div>
            </div>

            <div id="trending-grid" class="px-4 sm:px-8 lg:px-12 scroll-mt-24">
                <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200/60">
                    <div>
                        <h2 class="text-3xl font-black text-gray-900 mb-1.5 tracking-tight">Trending Hardware</h2>
                        <p class="text-gray-500 text-sm font-medium">Mathematically sorted by our Wilson Score algorithm.</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    ${productsHtml}
                </div>
            </div>
        </div>
    `;
};