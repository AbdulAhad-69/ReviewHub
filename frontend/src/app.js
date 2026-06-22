import { AuthAPI } from './api/authApi.js';
import { Navbar } from './components/Navbar.js';
import { Home } from './pages/Home.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { ProductDetail } from './pages/ProductDetail.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { Compare } from './pages/Compare.js';

// 1. Global State Management
export const AppState = {
    user: null,
    isAuthenticated: false,
};

// 2. The Client-Side Router
export const Router = {
    routes: {},
    
    addRoute: function(path, viewFunction) {
        this.routes[path] = viewFunction;
    },
    
    navigate: function(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    },
    
    handleRoute: async function() {
        let path = window.location.pathname;

        // Path normalization
        if (path.endsWith('/index.html')) path = path.replace('/index.html', '/');
        if (path.includes('/frontend/public')) path = path.replace('/frontend/public', '') || '/';
        if (path === '') path = '/';

        let view = this.routes[path];
        let param = null;

        // Dynamic route checking (e.g., /product/123)
        if (!view && path.startsWith('/product/')) {
            view = this.routes['/product/:id'];
            param = path.split('/')[2];
        }

        // Fallback
        if (!view) view = this.routes['/404'];

        const appRoot = document.getElementById('app-root');
        appRoot.innerHTML = `
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        `;

        const html = await view(param);
        appRoot.innerHTML = html;
    }
};

window.Router = Router;

// 3. Application Initialization
const initApp = async () => {
    try {
        const response = await AuthAPI.getMe();
        if (response.success) {
            AppState.user = response.user;
            AppState.isAuthenticated = true;
        }
    } catch (error) {
        console.log('Browsing as guest.');
    }

    // Inject Navbar
    document.getElementById('navbar-container').innerHTML = Navbar();

    // Wire up the definitive routes
    Router.addRoute('/', Home);
    Router.addRoute('/login', Login);
    Router.addRoute('/register', Register);
    Router.addRoute('/product/:id', ProductDetail);
    Router.addRoute('/admin', AdminDashboard);
    Router.addRoute('/compare', Compare);
    Router.addRoute('/404', () => `<div class="text-center py-20"><h1 class="text-6xl font-bold text-gray-300">404</h1></div>`);

    window.addEventListener('popstate', () => Router.handleRoute());
    Router.handleRoute();
};

document.addEventListener('DOMContentLoaded', initApp);