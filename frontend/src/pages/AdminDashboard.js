import { AdminAPI } from '../api/adminApi.js';
import { AppState, Router } from '../app.js';

window.handleApprove = async (reviewId, btnElement) => {
    btnElement.innerHTML = "Approving...";
    btnElement.disabled = true;

    try {
        const response = await AdminAPI.approveReview(reviewId);
        if (response.success) {
            // Visually remove the row from the table
            document.getElementById(`row-${reviewId}`).classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => document.getElementById(`row-${reviewId}`).remove(), 500);
        }
    } catch (error) {
        alert("Failed to approve: " + error.message);
        btnElement.innerHTML = "Approve";
        btnElement.disabled = false;
    }
};

window.handleReject = async (reviewId, btnElement) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    
    btnElement.innerHTML = "Trashing...";
    btnElement.disabled = true;

    try {
        const response = await AdminAPI.rejectReview(reviewId);
        if (response.success) {
            document.getElementById(`row-${reviewId}`).classList.add('bg-red-50', 'opacity-0', 'transition-all', 'duration-500');
            setTimeout(() => document.getElementById(`row-${reviewId}`).remove(), 500);
        }
    } catch (error) {
        alert("Failed to reject: " + error.message);
        btnElement.innerHTML = "Reject";
        btnElement.disabled = false;
    }
};

export const AdminDashboard = async () => {
    // Ultimate security check: Prevent non-admins from even rendering the UI
    if (!AppState.isAuthenticated || AppState.user.role !== 'admin') {
        return `
            <div class="text-center py-20">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p class="text-gray-500">You do not have the required clearance to view this sector.</p>
                <button onclick="window.Router.navigate('/')" class="mt-6 text-brand-600 font-medium hover:underline">Return to safety</button>
            </div>
        `;
    }

    try {
        const response = await AdminAPI.getQueue();
        const queue = response.data;

        const tableRows = queue.length > 0 ? queue.map(r => `
            <tr id="row-${r._id}" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${r.userId.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-brand-600 cursor-pointer hover:underline" onclick="window.Router.navigate('/product/${r.productId._id}')">${r.productId.name}</td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title="${r.content}">${r.content}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(r.createdAt).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-3">
                    ${r.receiptUrl
                ? `<a href="${r.receiptUrl}" target="_blank" class="text-brand-600 hover:text-brand-800 transition-colors flex items-center text-xs border border-brand-200 px-2 py-1 rounded bg-white">
                             <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                             Receipt
                           </a>`
                : `<span class="text-gray-400 text-xs italic">No File</span>`
            }
                    <div class="flex space-x-2">
                        <button onclick="window.handleReject('${r._id}', this)" class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded shadow-sm transition-colors text-xs font-bold border border-red-200">Reject</button>
                        <button onclick="window.handleApprove('${r._id}', this)" class="bg-brand-50 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded shadow-sm transition-colors text-xs font-bold border border-brand-200">Approve</button>
                    </div>
                </td>
            </tr>
        `).join('') : `<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">The moderation queue is currently empty.</td></tr>`;

        return `
            <div class="animate-fade-in py-8">
                <div class="flex justify-between items-end mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Command Center</h1>
                        <p class="text-gray-500 mt-1">Review and verify community submissions.</p>
                    </div>
                    <div class="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                        ${queue.length} Pending Actions
                    </div>
                </div>

                <div class="bg-white shadow-soft rounded-xl border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 class="text-lg font-semibold text-gray-800">Verification Queue</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Snippet</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="text-center py-20 text-red-500">System Error: ${error.message}</div>`;
    }
};