import { AppState, Router } from '../app.js';
import { AuthAPI } from '../api/authApi.js';
import { Navbar } from '../components/Navbar.js';

window.handleRegister = async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorContainer = document.getElementById('reg-error');
    const submitBtn = document.getElementById('reg-submit');

    submitBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
    submitBtn.disabled = true;
    errorContainer.classList.add('hidden');

    try {
        const response = await AuthAPI.register({ name, email, password });
        
        if (response.success) {
            AppState.user = response.user;
            AppState.isAuthenticated = true;
            document.getElementById('navbar-container').innerHTML = Navbar();
            Router.navigate('/');
        }
    } catch (error) {
        errorContainer.textContent = error.message || "Registration failed. Please try again.";
        errorContainer.classList.remove('hidden');
        submitBtn.innerHTML = "Create Account";
        submitBtn.disabled = false;
    }
};

export const Register = () => {
    return `
        <div class="animate-fade-in flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Join ReviewHub
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Already have an account?
                    <button onclick="window.Router.navigate('/login')" class="font-medium text-brand-600 hover:text-brand-500 transition-colors">
                        Sign in here
                    </button>
                </p>
            </div>

            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-white py-8 px-4 shadow-floating sm:rounded-xl sm:px-10 border border-gray-100">
                    
                    <div id="reg-error" class="hidden mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200"></div>

                    <form class="space-y-6" onsubmit="window.handleRegister(event)">
                        <div>
                            <label for="reg-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                            <div class="mt-1">
                                <input id="reg-name" name="name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all">
                            </div>
                        </div>

                        <div>
                            <label for="reg-email" class="block text-sm font-medium text-gray-700">Email address</label>
                            <div class="mt-1">
                                <input id="reg-email" name="email" type="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all">
                            </div>
                        </div>

                        <div>
                            <label for="reg-password" class="block text-sm font-medium text-gray-700">Password</label>
                            <div class="mt-1">
                                <input id="reg-password" name="password" type="password" required minlength="6" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all">
                            </div>
                        </div>

                        <div>
                            <button id="reg-submit" type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};