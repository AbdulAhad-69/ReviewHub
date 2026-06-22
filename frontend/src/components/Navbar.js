import { AppState, Router } from '../app.js';
import { AuthAPI } from '../api/authApi.js';
import { ProductAPI } from '../api/productApi.js';

window.handleLogout = async () => {
    try {
        await AuthAPI.logout();
    } catch (error) {
        console.warn("Backend logout warning, proceeding with local wipe.", error);
    } finally {
        AppState.user = null;
        AppState.isAuthenticated = false;
        window.location.href = '/';
    }
};

// Global Search Engine Logic
window.searchTimeout = null;
window.handleGlobalSearch = async (query) => {
    const resultsContainer = document.getElementById('search-results');
    
    if (!query || query.trim().length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(async () => {
        try {
            const res = await ProductAPI.getAllProducts();
            const filtered = res.data.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) || 
                p.category.toLowerCase().includes(query.toLowerCase())
            );

            if (filtered.length === 0) {
                resultsContainer.innerHTML = `<div class="p-4 text-sm font-bold text-gray-400 text-center">No products found for "${query}"</div>`;
            } else {
                resultsContainer.innerHTML = filtered.slice(0, 6).map(p => `
                    <div onclick="window.Router.navigate('/product/${p._id}'); document.getElementById('search-results').classList.add('hidden'); document.getElementById('global-search').value = '';" class="flex items-center p-3 hover:bg-brand-50 cursor-pointer border-b border-gray-50 last:border-0 transition-all group">
                        <img src="${p.imageUrl}" class="w-12 h-12 object-contain bg-white rounded-lg border border-gray-200 p-1 mr-3 group-hover:border-brand-300 transition-colors">
                        <div>
                            <div class="text-sm font-bold text-gray-900 group-hover:text-brand-700 transition-colors">${p.name}</div>
                            <div class="text-xs font-black text-brand-600 uppercase tracking-wider mt-0.5">${p.category}</div>
                        </div>
                    </div>
                `).join('');
            }
            resultsContainer.classList.remove('hidden');
        } catch (error) {
            console.error("Search engine failed to execute", error);
        }
    }, 300);
};

document.addEventListener('click', (e) => {
    const searchBox = document.getElementById('search-container');
    if (searchBox && !searchBox.contains(e.target)) {
        const results = document.getElementById('search-results');
        if (results) results.classList.add('hidden');
    }
});

export const Navbar = () => {
    const authLinks = AppState.isAuthenticated ? `
        <div class="flex items-center space-x-3 sm:space-x-5">
            ${AppState.user.role === 'admin' ? `
                <button onclick="window.Router.navigate('/admin')" class="hidden sm:inline-flex items-center text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-all duration-200 shadow-sm hover:shadow">
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    Command Center
                </button>
            ` : ''}
            
            <div class="flex items-center sm:pl-4 sm:border-l border-gray-200 space-x-4">
                <div class="flex items-center space-x-3 group cursor-default">
                    <div class="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-brand-100 group-hover:scale-110 group-hover:shadow-brand-500/30 transition-all duration-300">
                        ${AppState.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="hidden md:flex flex-col group-hover:translate-x-1 transition-transform duration-300">
                        <span class="text-sm font-extrabold text-gray-900 leading-tight group-hover:text-brand-700 transition-colors">${AppState.user.name.split(' ')[0]}</span>
                        <span class="text-xs font-medium text-gray-500 capitalize leading-tight">${AppState.user.role.replace('_', ' ')}</span>
                    </div>
                </div>
                
                <button onclick="window.handleLogout()" class="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group" title="Log out">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
        </div>
    ` : `
        <div class="flex items-center space-x-2 sm:space-x-4">
            <button onclick="window.Router.navigate('/login')" class="hidden sm:block text-sm font-bold text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">Log in</button>
            <button onclick="window.Router.navigate('/register')" class="text-sm font-bold bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">Sign up</button>
        </div>
    `;

    return `
        <nav class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div class="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
                <div class="flex justify-between h-20 items-center relative">
                    
                    <div class="flex items-center space-x-8">
                        <div class="flex-shrink-0 flex items-center cursor-pointer group" onclick="window.Router.navigate('/')">
                            <div class="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg mr-2.5 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:-rotate-6 group-hover:scale-105 transition-all duration-300">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <span class="text-3xl font-black text-gray-900 tracking-tighter">Review<span class="text-brand-600">Hub</span></span>
                        </div>
                        
                        <div class="hidden lg:flex space-x-2">
                            <a href="#" onclick="window.Router.navigate('/'); return false;" class="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200">Home</a>
                            <a href="#" onclick="window.Router.navigate('/compare'); return false;" class="text-sm font-bold text-gray-500 hover:text-brand-700 px-4 py-2 rounded-lg hover:bg-brand-50 transition-all duration-200 flex items-center">
                                <svg class="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                Compare
                            </a>
                        </div>
                    </div>

                    <div id="search-container" class="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 group z-20">
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <input type="text" id="global-search" oninput="window.handleGlobalSearch(this.value)" autocomplete="off" class="block w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-xl leading-5 bg-gray-50 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-0 focus:border-brand-500 transition-all duration-200 shadow-inner" placeholder="Search laptops, cameras, hardware...">
                        </div>
                        
                        <div id="search-results" class="hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top animate-fade-in">
                            </div>
                    </div>

                    <div class="flex items-center z-10">
                        ${authLinks}
                        
                        <button onclick="document.getElementById('mobile-menu').classList.toggle('hidden')" class="lg:hidden ml-4 text-gray-500 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div id="mobile-menu" class="hidden lg:hidden border-t border-gray-200 bg-white shadow-xl absolute w-full z-40">
                <div class="px-4 pt-2 pb-6 space-y-1">
                    <a href="#" onclick="window.Router.navigate('/'); document.getElementById('mobile-menu').classList.add('hidden'); return false;" class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-4 py-3 rounded-lg text-base font-bold transition-colors">Home</a>
                    <a href="#" onclick="window.Router.navigate('/compare'); document.getElementById('mobile-menu').classList.add('hidden'); return false;" class="text-gray-600 hover:text-brand-700 hover:bg-brand-50 block px-4 py-3 rounded-lg text-base font-bold transition-colors">Compare Engine</a>
                    
                    ${AppState.isAuthenticated ? `
                        ${AppState.user.role === 'admin' ? `<button onclick="window.Router.navigate('/admin'); document.getElementById('mobile-menu').classList.add('hidden');" class="w-full text-left text-brand-600 hover:bg-brand-50 block px-4 py-3 rounded-lg text-base font-bold transition-colors">Admin Desk</button>` : ''}
                        <button onclick="window.handleLogout()" class="w-full text-left text-red-500 hover:bg-red-50 block px-4 py-3 rounded-lg text-base font-bold transition-colors mt-4 border-t border-gray-100 pt-4">Log out</button>
                    ` : `
                        <div class="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
                            <button onclick="window.Router.navigate('/login'); document.getElementById('mobile-menu').classList.add('hidden');" class="w-full justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 py-2.5 rounded-lg text-sm font-bold transition-colors">Log in</button>
                            <button onclick="window.Router.navigate('/register'); document.getElementById('mobile-menu').classList.add('hidden');" class="w-full justify-center text-white bg-brand-600 hover:bg-brand-700 py-2.5 rounded-lg text-sm font-bold transition-colors">Sign up</button>
                        </div>
                    `}
                </div>
            </div>
        </nav>
    `;
};