// ==========================================
// 🛒 Orient Global Cart Logic
// ==========================================

// 1. جلب السلة من الذاكرة المحلية أو إنشاء سلة جديدة
let cart = JSON.parse(localStorage.getItem('orient_cart')) || [];

// 2. ربط عناصر الـ HTML (مع التأكد من وجودها)
const cartBtn = document.getElementById('cart-open-btn');
const closeCartBtn = document.getElementById('cart-close-btn');
const cartDrawer = document.getElementById('cart-drawer');
const uiOverlay = document.getElementById('ui-overlay');
const cartBadge = document.getElementById('cart-badge');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');
const openCheckoutBtn = document.getElementById('open-checkout-modal'); // زرار الدفع

// 3. تهيئة السلة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupEventListeners();
});

// 4. مراقبة الأحداث (الضغط على الزراير)
function setupEventListeners() {
    // فتح وقفل السلة
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (uiOverlay) uiOverlay.addEventListener('click', closeAllOverlays);

    // التوجيه لصفحة الدفع الجديدة (بدلاً من البوب أب القديم)
    if (openCheckoutBtn) {
        openCheckoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html'; // توجيه لصفحة الدفع
            } else {
                alert('Your cart is empty! Please add some services first.');
            }
        });
    }
}

// 5. دوال التحكم في السلة (اللوجيك الأساسي)
function toggleCart() {
    if (!cartDrawer) return;
    const isOpen = !cartDrawer.classList.contains('translate-x-full');
    if (isOpen) {
        cartDrawer.classList.add('translate-x-full');
        hideOverlay();
    } else {
        cartDrawer.classList.remove('translate-x-full');
        showOverlay();
    }
}

function showOverlay() {
    if (!uiOverlay) return;
    uiOverlay.classList.remove('hidden');
    setTimeout(() => uiOverlay.classList.remove('opacity-0'), 10);
}

function hideOverlay() {
    if (!uiOverlay) return;
    uiOverlay.classList.add('opacity-0');
    setTimeout(() => uiOverlay.classList.add('hidden'), 300);
}

function closeAllOverlays() {
    if (cartDrawer && !cartDrawer.classList.contains('translate-x-full')) toggleCart();
}

// إضافة منتج للسلة
window.addToCart = function(id, title, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    toggleCart(); // فتح السلة تلقائياً ليرى المستخدم ما أضافه
}

// تعديل كمية المنتج
window.updateQuantity = function(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id); // لو الكمية بقت صفر، امسح المنتج
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// حذف المنتج تماماً من السلة
window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// حفظ السلة في الذاكرة
function saveCart() {
    localStorage.setItem('orient_cart', JSON.stringify(cart));
}

// 6. تحديث واجهة المستخدم (UI)
function updateCartUI() {
    // تحديث الشارة (الرقم الأحمر فوق السلة)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.classList.remove('scale-0');
        } else {
            cartBadge.classList.add('scale-0');
        }
    }

    if (!cartItemsContainer) return;

    // تفريغ محتوى السلة قبل إعادة رسمه
    cartItemsContainer.innerHTML = '';
    
    // حالة السلة فارغة
    if (cart.length === 0) {
        if (cartFooter) cartFooter.classList.add('hidden');
        cartItemsContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-12">
                <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <p class="text-lg font-semibold text-gray-500">Your cart is empty</p>
                <a href="services.html" class="text-primary hover:underline font-bold mt-2 inline-block">Browse Services</a>
            </div>
        `;
        return;
    }

    // إظهار التوتال لو السلة فيها منتجات
    if (cartFooter) cartFooter.classList.remove('hidden');
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

    if (cartTotalPrice) cartTotalPrice.textContent = `${totalPrice} EGP`;
}