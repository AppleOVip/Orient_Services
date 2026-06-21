// ==========================================
// 🛒 Orient Cart & Checkout Logic
// ==========================================

// 1. State Management
let cart = JSON.parse(localStorage.getItem('orient_cart')) || [];
const COMPANY_EMAIL = "Autopay22022@gmail.com";
const COMPANY_WHATSAPP = "201101791018";

// 2. DOM Elements
const cartBtn = document.getElementById('cart-open-btn');
const closeCartBtn = document.getElementById('cart-close-btn');
const cartDrawer = document.getElementById('cart-drawer');
const uiOverlay = document.getElementById('ui-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');

const openCheckoutBtn = document.getElementById('open-checkout-modal');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('modal-close-btn');

const btnSubmitEmail = document.getElementById('submit-email-btn');
const btnSubmitWA = document.getElementById('submit-wa-btn');

// 3. Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupEventListeners();
});

// 4. Event Listeners
function setupEventListeners() {
    // Open/Close Cart
    cartBtn?.addEventListener('click', toggleCart);
    closeCartBtn?.addEventListener('click', toggleCart);
    uiOverlay?.addEventListener('click', closeAllOverlays);

    // Open/Close Modal
    openCheckoutBtn?.addEventListener('click', () => {
        toggleCart(); // Close cart first
        setTimeout(toggleModal, 300); // Open modal after cart closes
    });
    closeModalBtn?.addEventListener('click', toggleModal);

    // Checkout Buttons
    btnSubmitEmail?.addEventListener('click', () => handleCheckout('email'));
    btnSubmitWA?.addEventListener('click', () => handleCheckout('whatsapp'));
}

// 5. Cart Functions
function toggleCart() {
    const isOpen = !cartDrawer.classList.contains('translate-x-full');
    if (isOpen) {
        cartDrawer.classList.add('translate-x-full');
        hideOverlay();
    } else {
        cartDrawer.classList.remove('translate-x-full');
        showOverlay();
    }
}

function toggleModal() {
    const isHidden = checkoutModal.classList.contains('hidden');
    if (isHidden) {
        checkoutModal.classList.remove('hidden');
        // Small delay to allow display block to apply before animating opacity
        setTimeout(() => {
            checkoutModal.classList.remove('opacity-0');
            checkoutModal.classList.add('flex');
        }, 10);
        showOverlay();
    } else {
        checkoutModal.classList.add('opacity-0');
        setTimeout(() => {
            checkoutModal.classList.add('hidden');
            checkoutModal.classList.remove('flex');
            hideOverlay();
        }, 300);
    }
}

function showOverlay() {
    uiOverlay.classList.remove('hidden');
    setTimeout(() => uiOverlay.classList.remove('opacity-0'), 10);
}

function hideOverlay() {
    uiOverlay.classList.add('opacity-0');
    setTimeout(() => uiOverlay.classList.add('hidden'), 300);
}

function closeAllOverlays() {
    if (!cartDrawer.classList.contains('translate-x-full')) toggleCart();
    if (!checkoutModal.classList.contains('hidden')) toggleModal();
}

// Add Item to Cart (Call this function from your "Add to Cart" buttons)
window.addToCart = function(id, title, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    toggleCart(); // Open cart automatically to show the user
}

window.updateQuantity = function(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(id);
        else {
            saveCart();
            updateCartUI();
        }
    }
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('orient_cart', JSON.stringify(cart));
}

// 6. Render UI
function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        if (totalItems > 0) cartBadge.classList.remove('scale-0');
        else cartBadge.classList.add('scale-0');
    }

    // Render Items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartFooter.classList.add('hidden');
        cartItemsContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-12">
                <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <p class="text-lg font-semibold text-gray-500">Your cart is empty</p>
                <a href="services.html" onclick="toggleCart()" class="text-primary hover:underline font-bold mt-2 inline-block">Browse Services</a>
            </div>
        `;
        return;
    }

    cartFooter.classList.remove('hidden');
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div class="flex-1">
                    <h4 class="font-bold text-dark text-sm mb-1">${item.title}</h4>
                    <div class="text-primary font-black text-sm">${item.price} EGP</div>
                </div>
                
                <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-gray-600 shadow-sm hover:text-red-500 transition">-</button>
                    <span class="font-bold text-sm w-4 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-gray-600 shadow-sm hover:text-primary transition">+</button>
                </div>
                
                <button onclick="removeFromCart('${item.id}')" class="ml-4 p-2 text-gray-400 hover:text-red-500 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        `;
    });

    cartTotalPrice.textContent = `${totalPrice} EGP`;
}

// 7. Checkout Logic
function handleCheckout(method) {
    // Validate Form
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const details = document.getElementById('client-details').value.trim();

    if (!name || !phone || !email || !details) {
        alert('Please fill in all the details before proceeding.');
        return;
    }

    // Format Order Summary
    let orderSummary = "Order Summary:\n";
    orderSummary += "------------------------\n";
    let total = 0;
    cart.forEach(item => {
        orderSummary += `${item.quantity}x ${item.title} - ${item.price * item.quantity} EGP\n`;
        total += item.price * item.quantity;
    });
    orderSummary += "------------------------\n";
    orderSummary += `Total Amount: ${total} EGP\n\n`;

    // Format Full Message
    let fullMessage = `Hello Orient Team, I would like to request the following services:\n\n`;
    fullMessage += orderSummary;
    fullMessage += `Client Details:\n`;
    fullMessage += `- Name: ${name}\n`;
    fullMessage += `- Phone: ${phone}\n`;
    fullMessage += `- Email: ${email}\n\n`;
    fullMessage += `Project Requirements:\n${details}\n`;

    const encodedMessage = encodeURIComponent(fullMessage);

    if (method === 'whatsapp') {
        const waLink = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodedMessage}`;
        window.open(waLink, '_blank');
    } else if (method === 'email') {
        const subject = encodeURIComponent(`New Service Request from ${name}`);
        const mailtoLink = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${encodedMessage}`;
        window.location.href = mailtoLink;
    }

    // Optional: Clear cart after successful redirection
    cart = [];
    saveCart();
    updateCartUI();
    toggleModal();
    document.getElementById('checkout-form').reset();
}