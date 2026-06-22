import { ProductAPI } from '../api/productApi.js';

// Global state for our comparison engine
window.compareState = {
    products: [], 
    item1: null,
    item2: null
};

// Global click listener to close custom dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.compare-dropdown')) {
        [1, 2].forEach(slot => {
            const menu = document.getElementById(`compare-menu-${slot}`);
            const icon = document.getElementById(`compare-icon-${slot}`);
            if (menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
                icon.classList.remove('rotate-180');
            }
        });
    }
});

// Function to toggle the custom dropdowns
window.toggleCompareDropdown = (slot) => {
    const menu = document.getElementById(`compare-menu-${slot}`);
    const icon = document.getElementById(`compare-icon-${slot}`);
    const otherMenu = document.getElementById(`compare-menu-${slot === 1 ? 2 : 1}`);
    const otherIcon = document.getElementById(`compare-icon-${slot === 1 ? 2 : 1}`);

    // Close the other dropdown if it's open
    if (otherMenu && !otherMenu.classList.contains('hidden')) {
        otherMenu.classList.add('hidden');
        otherIcon.classList.remove('rotate-180');
    }

    // Toggle current
    menu.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
};

// Function to handle selection from custom dropdown
window.handleSelectCompare = (slot, productId) => {
    const product = window.compareState.products.find(p => p._id === productId) || null;
    if (slot === 1) window.compareState.item1 = product;
    if (slot === 2) window.compareState.item2 = product;
    
    // Re-render the specific dropdown button UI
    document.getElementById(`dropdown-container-${slot}`).innerHTML = window.generateDropdownHtml(slot, window.compareState.products, product);
    
    // Render the table
    window.renderCompareTable();
};

// Helper function to build the rich UI dropdown component
window.generateDropdownHtml = (slot, products, selectedItem) => {
    const optionsHtml = products.map(p => `
        <div onclick="window.handleSelectCompare(${slot}, '${p._id}')" class="flex items-center p-3 hover:bg-brand-50 rounded-xl cursor-pointer transition-all duration-200 group ${selectedItem?._id === p._id ? 'bg-brand-50 ring-1 ring-brand-200' : ''}">
            <img src="${p.imageUrl}" class="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:border-brand-400 transition-colors mr-3">
            <div class="flex-1">
                <div class="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors">${p.name}</div>
                <div class="text-xs font-semibold text-brand-600 uppercase tracking-wider mt-0.5">${p.category}</div>
            </div>
            ${selectedItem?._id === p._id ? `<svg class="w-5 h-5 text-brand-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>` : ''}
        </div>
    `).join('');

    const buttonContent = selectedItem ? `
        <div class="flex items-center">
            <img src="${selectedItem.imageUrl}" class="w-8 h-8 object-cover rounded-md mr-3 border border-gray-200 shadow-sm bg-white">
            <span class="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">${selectedItem.name}</span>
        </div>
    ` : `
        <div class="flex items-center">
            <div class="w-8 h-8 rounded-md mr-3 border border-dashed border-gray-300 bg-gray-50"></div>
            <span class="font-semibold text-gray-400">Choose a product...</span>
        </div>
    `;

    return `
        <div class="relative compare-dropdown">
            <button onclick="window.toggleCompareDropdown(${slot})" id="compare-btn-${slot}" type="button" class="w-full flex items-center justify-between bg-white border-2 border-gray-100 hover:border-brand-300 rounded-xl p-3 transition-all duration-200 text-left shadow-sm focus:ring-4 focus:ring-brand-500/10 outline-none group">
                ${buttonContent}
                <div class="flex items-center flex-shrink-0">
                    ${selectedItem ? `<span class="hidden sm:inline-block text-xs font-bold text-white bg-brand-500 px-2.5 py-1 rounded-full mr-3 shadow-sm shadow-brand-500/30">Score: ${(selectedItem.metrics.wilsonScore * 100).toFixed(0)}</span>` : ''}
                    <div class="bg-gray-50 p-1.5 rounded-lg border border-gray-200 group-hover:bg-brand-50 group-hover:border-brand-200 transition-colors">
                        <svg id="compare-icon-${slot}" class="w-4 h-4 text-gray-500 group-hover:text-brand-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </button>
            <div id="compare-menu-${slot}" class="hidden absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden origin-top">
                <div class="max-h-[320px] overflow-y-auto p-2 space-y-1">
                    ${optionsHtml}
                </div>
            </div>
        </div>
    `;
};

// Function to generate the side-by-side table
window.renderCompareTable = () => {
    const container = document.getElementById('compare-results');
    const p1 = window.compareState.item1;
    const p2 = window.compareState.item2;

    if (!p1 || !p2) {
        container.innerHTML = `
            <div class="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm mt-8">
                <div class="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">Awaiting Challenger</h3>
                <p class="text-gray-500 font-medium max-w-sm mx-auto">Select two products from the menus above to generate the side-by-side spec matrix.</p>
            </div>`;
        return;
    }

    const allSpecs = new Set([...Object.keys(p1.specs || {}), ...Object.keys(p2.specs || {})]);
    
    const specRows = Array.from(allSpecs).map(key => `
        <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-5 text-sm font-bold text-gray-600 bg-gray-50/30 w-1/3 capitalize border-r border-gray-100">${key}</td>
            <td class="py-4 px-5 text-sm text-gray-800 w-1/3 font-medium border-r border-gray-100">${p1.specs?.[key] || '<span class="text-gray-300 italic">N/A</span>'}</td>
            <td class="py-4 px-5 text-sm text-gray-800 w-1/3 font-medium">${p2.specs?.[key] || '<span class="text-gray-300 italic">N/A</span>'}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden mt-8 animate-fade-in">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-900 text-white">
                        <th class="py-5 px-5 font-bold uppercase tracking-wider text-xs w-1/3 text-gray-400">Feature Matchup</th>
                        <th class="py-5 px-5 font-black text-xl w-1/3 border-l border-gray-700">${p1.name}</th>
                        <th class="py-5 px-5 font-black text-xl w-1/3 border-l border-gray-700">${p2.name}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-gray-100">
                        <td class="py-4 px-5 text-sm font-bold text-gray-600 bg-gray-50/30 border-r border-gray-100">Hardware Profile</td>
                        <td class="py-5 px-5 border-r border-gray-100"><img src="${p1.imageUrl}" class="h-48 w-full object-cover rounded-xl shadow-sm border border-gray-200"></td>
                        <td class="py-5 px-5"><img src="${p2.imageUrl}" class="h-48 w-full object-cover rounded-xl shadow-sm border border-gray-200"></td>
                    </tr>
                    <tr class="border-b border-gray-100">
                        <td class="py-4 px-5 text-sm font-bold text-gray-600 bg-gray-50/30 border-r border-gray-100">Market Category</td>
                        <td class="py-4 px-5 border-r border-gray-100"><span class="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">${p1.category}</span></td>
                        <td class="py-4 px-5"><span class="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">${p2.category}</span></td>
                    </tr>
                    <tr class="border-b border-gray-100">
                        <td class="py-4 px-5 text-sm font-bold text-gray-600 bg-gray-50/30 border-r border-gray-100 flex items-center h-full">
                            Wilson Trust Score
                            <div class="ml-2 w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] cursor-help" title="Algorithmically verified community trust rating out of 100">?</div>
                        </td>
                        <td class="py-4 px-5 border-r border-gray-100">
                            <span class="text-2xl font-black ${p1.metrics.wilsonScore > p2.metrics.wilsonScore ? 'text-green-600' : 'text-gray-900'}">${(p1.metrics.wilsonScore * 100).toFixed(1)}</span>
                            ${p1.metrics.wilsonScore > p2.metrics.wilsonScore ? '<span class="ml-2 text-xs font-bold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-1 rounded">Winner</span>' : ''}
                        </td>
                        <td class="py-4 px-5">
                            <span class="text-2xl font-black ${p2.metrics.wilsonScore > p1.metrics.wilsonScore ? 'text-green-600' : 'text-gray-900'}">${(p2.metrics.wilsonScore * 100).toFixed(1)}</span>
                            ${p2.metrics.wilsonScore > p1.metrics.wilsonScore ? '<span class="ml-2 text-xs font-bold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-1 rounded">Winner</span>' : ''}
                        </td>
                    </tr>
                    <tr class="border-b border-gray-200 bg-gray-50">
                        <td colspan="3" class="py-3 px-5 text-xs font-black text-brand-600 uppercase tracking-widest text-center shadow-inner">Core Specifications</td>
                    </tr>
                    ${specRows}
                </tbody>
            </table>
        </div>
    `;
};

export const Compare = async () => {
    try {
        const response = await ProductAPI.getAllProducts();
        window.compareState.products = response.data;

        // Catch the teleported product from memory
        const prefillId = localStorage.getItem('compare_slot_1');
        if (prefillId) {
            const prefillProduct = response.data.find(p => p._id === prefillId);
            if (prefillProduct) {
                window.compareState.item1 = prefillProduct;
                localStorage.removeItem('compare_slot_1'); 
            }
        }

        return `
            <div class="animate-fade-in py-10 max-w-6xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-12">
                    <h1 class="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Comparison <span class="text-brand-600">Engine</span></h1>
                    <p class="text-gray-500 font-medium max-w-2xl mx-auto">Select two products to cross-reference their technical specifications and algorithmically verified community trust scores.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10">
                    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-200/60 shadow-inner">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Product Slot 1</label>
                        <div id="dropdown-container-1">
                            ${window.generateDropdownHtml(1, response.data, window.compareState.item1)}
                        </div>
                    </div>
                    <div class="bg-gray-50 p-6 rounded-2xl border border-gray-200/60 shadow-inner">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Product Slot 2</label>
                        <div id="dropdown-container-2">
                            ${window.generateDropdownHtml(2, response.data, window.compareState.item2)}
                        </div>
                    </div>
                </div>

                <div id="compare-results">
                    </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-20 text-red-500 font-bold">Error loading products for comparison.</div>`;
    }
};