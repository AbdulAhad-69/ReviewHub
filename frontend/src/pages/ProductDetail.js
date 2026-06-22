import { ProductAPI } from '../api/productApi.js';
import { AppState, Router } from '../app.js';

// Global state for our multi-attribute rating form
window.reviewDraft = { value: 5, durability: 5, features: 5 };

window.setRating = (attribute, score) => {
    window.reviewDraft[attribute] = score;
    document.getElementById(`score-${attribute}`).innerText = score;
};

// Global function to teleport to the compare engine
window.sendToCompare = (productId) => {
    localStorage.setItem('compare_slot_1', productId);
    window.Router.navigate('/compare');
    setTimeout(() => { if (window.renderCompareTable) window.renderCompareTable(); }, 50);
};

window.submitReview = async (event, productId) => {
    event.preventDefault();
    
    const content = document.getElementById('review-content').value;
    const receiptFile = document.getElementById('review-receipt').files[0]; 
    const submitBtn = document.getElementById('review-submit-btn');
    const errorMsg = document.getElementById('review-error');

    submitBtn.innerHTML = "Uploading & Submitting...";
    submitBtn.disabled = true;
    errorMsg.classList.add('hidden');

    try {
        const reviewData = { content, attributes: window.reviewDraft };
        const response = await ProductAPI.submitReview(productId, reviewData, receiptFile);
        
        if (response.success) {
            window.Router.handleRoute(); 
        }
    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
        submitBtn.innerHTML = "Post Verified Review";
        submitBtn.disabled = false;
    }
};

export const ProductDetail = async (productId) => {
    try {
        const [productRes, reviewsRes] = await Promise.all([
            ProductAPI.getProductById(productId),
            ProductAPI.getProductReviews(productId)
        ]);

        const p = productRes.data;
        const reviews = reviewsRes.data;

        const specsHtml = p.specs ? Object.entries(p.specs).map(([key, val]) => `
            <div class="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span class="text-gray-500">${key}</span>
                <span class="font-medium text-gray-900">${val}</span>
            </div>
        `).join('') : '<p class="text-sm text-gray-500">No specifications provided.</p>';

        const reviewsHtml = reviews.length > 0 ? reviews.map(r => `
            <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <div class="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                            ${r.userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-gray-900">${r.userId.name} ${r.isVerified ? '<span class="text-blue-500" title="Verified Owner">✓</span>' : ''}</p>
                            <p class="text-xs text-gray-500">${new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-gray-500">Overall</div>
                        <div class="font-bold text-gray-900">${((r.attributes.value + r.attributes.durability + r.attributes.features) / 3).toFixed(1)} <span class="text-yellow-400">★</span></div>
                    </div>
                </div>
                <p class="text-gray-700 text-sm mb-3">${r.content}</p>
                <div class="flex space-x-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <span>Value: ${r.attributes.value}/5</span>
                    <span>Durability: ${r.attributes.durability}/5</span>
                    <span>Features: ${r.attributes.features}/5</span>
                </div>
                ${r.receiptUrl && AppState.user && AppState.user.role === 'admin' ? `
                <div class="mt-3 pt-3 border-t border-gray-100">
                    <a href="${r.receiptUrl}" target="_blank" class="text-xs text-brand-600 hover:underline flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        View Receipt (Admin Only)
                    </a>
                </div>
                ` : ''}
            </div>
        `).join('') : '<p class="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>';

        let reviewFormHtml = '';

        if (!AppState.isAuthenticated) {
            reviewFormHtml = `
                <div class="bg-gray-50 border border-gray-200 p-6 rounded-xl text-center mb-8">
                    <p class="text-gray-600 mb-3">You must be logged in to share your experience.</p>
                    <button onclick="window.Router.navigate('/login')" class="bg-white text-brand-600 font-medium py-2 px-6 rounded border border-brand-200 hover:bg-brand-50 transition-colors text-sm">Log In to Review</button>
                </div>
            `;
        } else {
            const hasReviewed = reviews.some(r => r.userId._id === AppState.user._id);

            if (hasReviewed) {
                reviewFormHtml = `
                    <div class="bg-surface-dark border border-gray-700 p-6 rounded-xl text-center mb-8 shadow-floating">
                        <div class="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 class="text-white font-bold text-lg mb-1">Review Submitted</h3>
                        <p class="text-gray-400 text-sm">You have already shared your experience for this product. Thank you for contributing to the community!</p>
                    </div>
                `;
            } else {
                reviewFormHtml = `
                    <div class="bg-surface-dark text-white p-6 rounded-xl shadow-floating mb-8">
                        <h3 class="font-bold text-lg mb-4">Write a Review</h3>
                        <div id="review-error" class="hidden mb-3 p-2 bg-red-500/20 text-red-200 text-xs rounded border border-red-500/50"></div>
                        <form onsubmit="window.submitReview(event, '${p._id}')">
                            <div class="grid grid-cols-3 gap-4 mb-4 text-sm">
                                <div>
                                    <label class="block text-gray-400 mb-1">Value: <span id="score-value" class="text-white font-bold">5</span></label>
                                    <input type="range" min="1" max="5" value="5" class="w-full accent-brand-500" oninput="window.setRating('value', this.value)">
                                </div>
                                <div>
                                    <label class="block text-gray-400 mb-1">Durability: <span id="score-durability" class="text-white font-bold">5</span></label>
                                    <input type="range" min="1" max="5" value="5" class="w-full accent-brand-500" oninput="window.setRating('durability', this.value)">
                                </div>
                                <div>
                                    <label class="block text-gray-400 mb-1">Features: <span id="score-features" class="text-white font-bold">5</span></label>
                                    <input type="range" min="1" max="5" value="5" class="w-full accent-brand-500" oninput="window.setRating('features', this.value)">
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-400 text-sm mb-2">Proof of Purchase (Optional)</label>
                                <div class="flex items-center justify-center w-full">
                                   <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                                       <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                         <svg class="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                           <p id="file-name-display" class="text-xs text-gray-400 text-center px-4 truncate w-full"><span class="font-semibold">Click to upload</span> a receipt or photo</p>
                                       </div>
                                       <input id="review-receipt" type="file" class="hidden" accept="image/*" onchange="document.getElementById('file-name-display').innerHTML = this.files[0] ? '<span class=\\'font-semibold text-brand-400\\'>' + this.files[0].name + '</span>' : '<span class=\\'font-semibold\\'>Click to upload</span> a receipt or photo'" />
                                    </label>
                                </div>
                             </div>
                             
                            <textarea id="review-content" required minlength="20" placeholder="Detail your experience with this product... (min 20 chars)" class="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-brand-500 mb-4 h-24"></textarea>
                            <button id="review-submit-btn" type="submit" class="w-full bg-brand-500 text-white font-semibold py-2 rounded-lg hover:bg-brand-600 transition-colors text-sm">Post Verified Review</button>
                        </form>
                    </div>
                `;
            }
        }

        return `
            <div class="animate-fade-in py-8">
                <button onclick="window.Router.navigate('/')" class="text-gray-500 hover:text-brand-600 text-sm font-medium mb-6 flex items-center">
                    ← Back to Products
                </button>
                
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div class="lg:col-span-5">
                        <div class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden sticky top-24">
                            <img src="${p.imageUrl}" class="w-full h-80 object-cover bg-gray-100">
                            <div class="p-6">
                                <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">${p.category}</span>
                                
                                <div class="flex items-start justify-between mt-1 mb-2">
                                    <h1 class="text-2xl font-bold text-gray-900 leading-tight">${p.name}</h1>
                                    <button onclick="window.sendToCompare('${p._id}')" class="flex-shrink-0 ml-4 bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow flex items-center group">
                                        <svg class="w-3.5 h-3.5 mr-1.5 opacity-70 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                        Compare
                                    </button>
                                </div>

                                <p class="text-gray-600 text-sm mb-6">${p.description}</p>
                                
                                <h3 class="font-bold text-gray-900 mb-3 border-b pb-2">Technical Specifications</h3>
                                <div class="text-sm">
                                    ${specsHtml}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-7">
                        <div class="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                            <div>
                                <h2 class="text-3xl font-bold text-gray-900">${p.metrics.avgRating} <span class="text-yellow-400 text-2xl">★</span></h2>
                                <p class="text-sm text-gray-500">Based on ${p.metrics.totalReviews} total reviews</p>
                            </div>
                            <div class="text-right">
                                <div class="inline-block bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-bold border border-brand-200">
                                    Wilson Score: ${(p.metrics.wilsonScore * 100).toFixed(1)}
                                </div>
                            </div>
                        </div>

                        ${reviewFormHtml}
                        
                        <h3 class="font-bold text-lg text-gray-900 mb-4">Community Insights</h3>
                        <div class="space-y-4">
                            ${reviewsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-20 text-red-500">Error loading product details.</div>`;
    }
};