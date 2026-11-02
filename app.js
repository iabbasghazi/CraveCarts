/* =========================================================
   CRAVECART — PREMIUM FOOD ORDERING WEBSITE
   File: app.js
   HTML: index.html
   CSS: style.css
   Admin demo password: cravecart100
   ========================================================= */

"use strict";

/* =========================
   1. CONFIGURATION
========================= */

const CONFIG = {
    brand: "CraveCart",
    adminPassword: "cravecart100",
    currency: "INR",
    currencySymbol: "₹",
    deliveryFee: 35,
    freeDeliveryAbove: 499,
    taxRate: 0.05,
    storagePrefix: "cravecart_"
};

const STORAGE_KEYS = {
    cart: CONFIG.storagePrefix + "cart",
    wishlist: CONFIG.storagePrefix + "wishlist",
    orders: CONFIG.storagePrefix + "orders",
    products: CONFIG.storagePrefix + "products",
    coupon: CONFIG.storagePrefix + "coupon"
};


/* =========================
   2. HELPER FUNCTIONS
========================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

function loadStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        console.warn("Storage read error:", error);
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn("Storage save error:", error);
        showToast("Browser storage unavailable.", "error");
    }
}

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: CONFIG.currency,
        maximumFractionDigits: 0
    }).format(Number(amount) || 0);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function createId(prefix = "CC") {
    return prefix + "-" +
        Date.now().toString(36).toUpperCase() +
        "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function showToast(message, type = "success") {
    let toast = $("#cc-toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cc-toast";
        toast.setAttribute("role", "status");

        Object.assign(toast.style, {
            position: "fixed",
            right: "20px",
            bottom: "20px",
            zIndex: "99999",
            maxWidth: "calc(100vw - 40px)",
            padding: "14px 20px",
            borderRadius: "14px",
            color: "#fff",
            background: "#171717",
            boxShadow: "0 10px 35px rgba(0,0,0,.3)",
            fontSize: "14px",
            opacity: "0",
            transform: "translateY(12px)",
            transition: "all .25s ease"
        });

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.borderLeft =
        type === "error" ? "4px solid #ff4040" :
        type === "warning" ? "4px solid #ffc107" :
        "4px solid #ff6b00";

    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(12px)";
    }, 2800);
}


/* =========================
   3. PRODUCT DATABASE
========================= */

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Classic Margherita Pizza",
        category: "Pizza",
        price: 249,
        oldPrice: 299,
        rating: 4.8,
        reviews: 124,
        badge: "Bestseller",
        veg: true,
        time: "20–25 min",
        description: "Mozzarella, fresh basil and our signature tomato sauce.",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 2,
        name: "Farmhouse Pizza",
        category: "Pizza",
        price: 329,
        oldPrice: 379,
        rating: 4.7,
        reviews: 98,
        badge: "Popular",
        veg: true,
        time: "25–30 min",
        description: "Loaded with capsicum, onion, mushroom and cheese.",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 3,
        name: "Paneer Tikka Pizza",
        category: "Pizza",
        price: 349,
        oldPrice: 399,
        rating: 4.9,
        reviews: 112,
        badge: "Chef's Pick",
        veg: true,
        time: "25–30 min",
        description: "Smoky paneer tikka with creamy cheese and herbs.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 4,
        name: "Classic Veg Burger",
        category: "Burgers",
        price: 149,
        oldPrice: 179,
        rating: 4.6,
        reviews: 86,
        badge: "",
        veg: true,
        time: "15–20 min",
        description: "Crispy vegetable patty, lettuce and house sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 5,
        name: "Double Cheese Burger",
        category: "Burgers",
        price: 199,
        oldPrice: 229,
        rating: 4.8,
        reviews: 105,
        badge: "Popular",
        veg: true,
        time: "15–20 min",
        description: "Double cheese, crunchy vegetables and creamy sauce.",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 6,
        name: "Crispy Veg Wrap",
        category: "Wraps",
        price: 129,
        oldPrice: 159,
        rating: 4.5,
        reviews: 57,
        badge: "",
        veg: true,
        time: "15 min",
        description: "Crispy veggies wrapped with fresh salad and sauce.",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 7,
        name: "Paneer Tikka Wrap",
        category: "Wraps",
        price: 179,
        oldPrice: 209,
        rating: 4.8,
        reviews: 77,
        badge: "Bestseller",
        veg: true,
        time: "15–20 min",
        description: "Spiced paneer, crunchy salad and mint dressing.",
        image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 8,
        name: "Creamy White Pasta",
        category: "Pasta",
        price: 229,
        oldPrice: 259,
        rating: 4.7,
        reviews: 89,
        badge: "",
        veg: true,
        time: "20 min",
        description: "Creamy white sauce pasta with herbs and parmesan.",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 9,
        name: "Spicy Red Sauce Pasta",
        category: "Pasta",
        price: 219,
        oldPrice: 249,
        rating: 4.6,
        reviews: 62,
        badge: "",
        veg: true,
        time: "20 min",
        description: "Pasta tossed in rich tomato and chilli sauce.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 10,
        name: "Paneer Butter Masala",
        category: "Indian",
        price: 279,
        oldPrice: 319,
        rating: 4.9,
        reviews: 143,
        badge: "Bestseller",
        veg: true,
        time: "25 min",
        description: "Soft paneer in a rich buttery tomato gravy.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 11,
        name: "Dal Makhani",
        category: "Indian",
        price: 229,
        oldPrice: 259,
        rating: 4.8,
        reviews: 93,
        badge: "",
        veg: true,
        time: "25 min",
        description: "Slow-cooked black lentils with butter and spices.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 12,
        name: "Veg Biryani",
        category: "Indian",
        price: 199,
        oldPrice: 239,
        rating: 4.7,
        reviews: 117,
        badge: "Popular",
        veg: true,
        time: "20–25 min",
        description: "Fragrant basmati rice with vegetables and spices.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 13,
        name: "Hakka Noodles",
        category: "Chinese",
        price: 179,
        oldPrice: 209,
        rating: 4.5,
        reviews: 74,
        badge: "",
        veg: true,
        time: "15–20 min",
        description: "Wok-tossed noodles with crunchy vegetables.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 14,
        name: "Veg Manchurian",
        category: "Chinese",
        price: 189,
        oldPrice: 219,
        rating: 4.6,
        reviews: 68,
        badge: "",
        veg: true,
        time: "20 min",
        description: "Crispy vegetable balls in a savoury Indo-Chinese sauce.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 15,
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 119,
        oldPrice: 149,
        rating: 4.9,
        reviews: 132,
        badge: "Sweet Pick",
        veg: true,
        time: "10 min",
        description: "Rich chocolate brownie with a soft centre.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 16,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 159,
        oldPrice: 189,
        rating: 4.8,
        reviews: 88,
        badge: "",
        veg: true,
        time: "10–15 min",
        description: "Decadent chocolate cake layered with chocolate cream.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 17,
        name: "Fresh Lime Soda",
        category: "Drinks",
        price: 69,
        oldPrice: 89,
        rating: 4.5,
        reviews: 46,
        badge: "",
        veg: true,
        time: "5 min",
        description: "Refreshing lime soda served chilled.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 18,
        name: "Cold Coffee",
        category: "Drinks",
        price: 109,
        oldPrice: 129,
        rating: 4.7,
        reviews: 71,
        badge: "Popular",
        veg: true,
        time: "5–10 min",
        description: "Chilled coffee blended with milk and ice cream.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85"
    }
];

let products = loadStorage(STORAGE_KEYS.products, DEFAULT_PRODUCTS);

if (!Array.isArray(products) || products.length === 0) {
    products = [...DEFAULT_PRODUCTS];
}

let cart = loadStorage(STORAGE_KEYS.cart, []);
let wishlist = loadStorage(STORAGE_KEYS.wishlist, []);
let orders = loadStorage(STORAGE_KEYS.orders, []);

let activeCategory = "All";
let searchQuery = "";
let sortMode = "featured";
let activeCoupon = loadStorage(STORAGE_KEYS.coupon, null);


/* =========================
   4. CATEGORIES
========================= */

const CATEGORY_ICONS = {
    All: "🍽️",
    Pizza: "🍕",
    Burgers: "🍔",
    Wraps: "🌯",
    Pasta: "🍝",
    Indian: "🍛",
    Chinese: "🥡",
    Desserts: "🍰",
    Drinks: "🥤"
};

function getCategories() {
    return ["All", ...new Set(products.map(product => product.category))];
}


/* =========================
   5. PRODUCT RENDERING
========================= */

function getFilteredProducts() {
    let list = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const query = searchQuery.toLowerCase();

        const matchesSearch =
            !query ||
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            (product.description || "").toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    if (sortMode === "price-low") {
        list.sort((a, b) => a.price - b.price);
    } else if (sortMode === "price-high") {
        list.sort((a, b) => b.price - a.price);
    } else if (sortMode === "rating") {
        list.sort((a, b) => b.rating - a.rating);
    } else if (sortMode === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
}

function productCard(product) {
    const isLiked = wishlist.includes(product.id);

    return `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x450/171717/FF6B00?text=CraveCart';"
                >

                ${product.badge ? `
                    <span class="product-badge">
                        ${escapeHTML(product.badge)}
                    </span>
                ` : ""}

                <button
                    class="wishlist-button ${isLiked ? "is-liked" : ""}"
                    type="button"
                    data-action="wishlist"
                    data-id="${product.id}"
                    aria-label="Toggle wishlist"
                    title="Add to wishlist"
                >${isLiked ? "♥" : "♡"}</button>
            </div>

            <div class="product-info">
                <div class="product-meta">
                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>
                    <span class="product-rating">
                        ★ ${Number(product.rating || 0).toFixed(1)}
                    </span>
                </div>

                <h3 class="product-title">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description || "")}
                </p>

                <div class="product-footer">
                    <div class="product-pricing">
                        <strong>${formatPrice(product.price)}</strong>
                        ${product.oldPrice > product.price ? `
                            <del>${formatPrice(product.oldPrice)}</del>
                        ` : ""}
                    </div>

                    <button
                        class="add-to-cart-button"
                        type="button"
                        data-action="add-cart"
                        data-id="${product.id}"
                    >
                        <span aria-hidden="true">+</span>
                        Add
                    </button>
                </div>

                <div class="product-delivery">
                    <span>◷ ${escapeHTML(product.time || "20–30 min")}</span>
                    <span>● Pure Veg</span>
                </div>
            </div>
        </article>
    `;
}

function renderProducts() {
    const grid =
        $("#products-grid") ||
        $("#product-grid") ||
        $("[data-products-grid]");

    if (!grid) return;

    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div style="font-size:48px">🍽️</div>
                <h3>No dishes found</h3>
                <p>Try another search or category.</p>
                <button type="button" data-action="clear-search">
                    Show all dishes
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(productCard).join("");
    updateProductCount(filtered.length);
}

function updateProductCount(count) {
    const element =
        $("#product-count") ||
        $("[data-product-count]");

    if (element) {
        element.textContent = `${count} dishes`;
    }
}

function renderCategories() {
    const container =
        $("#category-list") ||
        $("#categories-list") ||
        $("[data-category-list]");

    if (!container) return;

    container.innerHTML = getCategories().map(category => `
        <button
            type="button"
            class="category-button ${activeCategory === category ? "active" : ""}"
            data-action="category"
            data-category="${escapeHTML(category)}"
        >
            <span>${CATEGORY_ICONS[category] || "🍴"}</span>
            <span>${escapeHTML(category)}</span>
        </button>
    `).join("");
}


/* =========================
   6. CART SYSTEM
========================= */

function saveCart() {
    saveStorage(STORAGE_KEYS.cart, cart);
}

function getProduct(productId) {
    return products.find(product => String(product.id) === String(productId));
}

function addToCart(productId, quantity = 1) {
    const product = getProduct(productId);

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    const existing = cart.find(item => String(item.id) === String(productId));

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            quantity: Math.max(1, quantity)
        });
    }

    saveCart();
    renderCart();
    showToast(`${product.name} added to your cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => String(item.id) !== String(productId));
    saveCart();
    renderCart();
    showToast("Item removed from cart.");
}

function updateCartQuantity(productId, change) {
    const item = cart.find(
        entry => String(entry.id) === String(productId)
    );

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderCart();
}

function getCartItems() {
    return cart
        .map(item => {
            const product = getProduct(item.id);
            if (!product) return null;

            return {
                ...product,
                quantity: Math.max(1, Number(item.quantity) || 1),
                lineTotal:
                    product.price * Math.max(1, Number(item.quantity) || 1)
            };
        })
        .filter(Boolean);
}

function getCartTotals() {
    const items = getCartItems();

    const subtotal = items.reduce(
        (total, item) => total + item.lineTotal, 0
    );

    const delivery =
        subtotal === 0 || subtotal >= CONFIG.freeDeliveryAbove
            ? 0
            : CONFIG.deliveryFee;

    const discount =
        activeCoupon === "CRAVE10"
            ? Math.min(Math.round(subtotal * 0.10), 150)
            : 0;

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * CONFIG.taxRate);

    return {
        subtotal,
        delivery,
        discount,
        tax,
        total: subtotal + delivery + tax - discount
    };
}

function renderCart() {
    const items = getCartItems();
    const totals = getCartTotals();

    const cartContainer =
        $("#cart-items") ||
        $("#cart-items-container") ||
        $("[data-cart-items]");

    if (cartContainer) {
        if (items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <div style="font-size:48px">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious food to get started.</p>
                    <button type="button" data-action="close-cart">
                        Explore menu
                    </button>
                </div>
            `;
        } else {
            cartContainer.innerHTML = items.map(item => `
                <div class="cart-item" data-cart-item="${item.id}">
                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                        onerror="this.onerror=null;this.src='https://placehold.co/120x120/171717/FF6B00?text=Food';"
                    >

                    <div class="cart-item-info">
                        <h4>${escapeHTML(item.name)}</h4>
                        <strong>${formatPrice(item.lineTotal)}</strong>

                        <div class="quantity-control">
                            <button
                                type="button"
                                data-action="quantity-minus"
                                data-id="${item.id}"
                                aria-label="Decrease quantity"
                            >−</button>

                            <span>${item.quantity}</span>

                            <button
                                type="button"
                                data-action="quantity-plus"
                                data-id="${item.id}"
                                aria-label="Increase quantity"
                            >+</button>
                        </div>
                    </div>

                    <button
                        class="remove-cart-item"
                        type="button"
                        data-action="remove-cart"
                        data-id="${item.id}"
                        aria-label="Remove item"
                    >×</button>
                </div>
            `).join("");
        }
    }

    setText(["cart-subtotal", "subtotal"], formatPrice(totals.subtotal));
    setText(["cart-delivery", "delivery-fee"], formatPrice(totals.delivery));
    setText(["cart-tax", "tax-amount"], formatPrice(totals.tax));
    setText(["cart-discount", "discount-amount"], formatPrice(totals.discount));
    setText(["cart-total", "grand-total", "total-price"], formatPrice(totals.total));

    const badgeCount = items.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    setText(["cart-count", "cart-badge"], badgeCount);

    $$("[data-cart-count]").forEach(element => {
        element.textContent = badgeCount;
    });

    const freeDeliveryMessage =
        $("#free-delivery-message") ||
        $("[data-free-delivery-message]");

    if (freeDeliveryMessage) {
        freeDeliveryMessage.textContent =
            totals.subtotal >= CONFIG.freeDeliveryAbove
                ? "🎉 You've unlocked free delivery!"
                : `Add ${formatPrice(CONFIG.freeDeliveryAbove - totals.subtotal)} more for free delivery.`;
    }
}

function setText(ids, value) {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}


/* =========================
   7. WISHLIST
========================= */

function toggleWishlist(productId) {
    const product = getProduct(productId);
    if (!product) return;

    if (wishlist.includes(product.id)) {
        wishlist = wishlist.filter(id => id !== product.id);
        showToast("Removed from wishlist.");
    } else {
        wishlist.push(product.id);
        showToast("Added to wishlist ♥");
    }

    saveStorage(STORAGE_KEYS.wishlist, wishlist);
    renderProducts();
    renderWishlist();
}

function renderWishlist() {
    const container =
        $("#wishlist-items") ||
        $("#wishlist-products") ||
        $("[data-wishlist-items]");

    if (!container) return;

    const items = products.filter(product => wishlist.includes(product.id));

    container.innerHTML = items.length
        ? items.map(productCard).join("")
        : `
            <div class="empty-state">
                <div style="font-size:42px">♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Save your favourite dishes here.</p>
            </div>
        `;

    setText(["wishlist-count"], wishlist.length);
}


/* =========================
   8. MODAL / DRAWER HELPERS
========================= */

function openElement(element) {
    if (!element) return;

    element.classList.add("open", "active", "show");
    element.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeElement(element) {
    if (!element) return;

    element.classList.remove("open", "active", "show");
    element.setAttribute("aria-hidden", "true");

    if (!$(".modal.open, .modal.active, .drawer.open, .drawer.active, .cart-drawer.open, .cart-drawer.active")) {
        document.body.classList.remove("modal-open");
    }
}

function openCart() {
    const drawer =
        $("#cart-drawer") ||
        $("#cart-sidebar") ||
        $(".cart-drawer");

    openElement(drawer);
}

function closeCart() {
    const drawer =
        $("#cart-drawer") ||
        $("#cart-sidebar") ||
        $(".cart-drawer");

    closeElement(drawer);
}

function openWishlist() {
    const modal =
        $("#wishlist-modal") ||
        $("#wishlist-drawer");

    renderWishlist();
    openElement(modal);
}

function closeWishlist() {
    closeElement($("#wishlist-modal") || $("#wishlist-drawer"));
}


/* =========================
   9. COUPON SYSTEM
========================= */

function applyCoupon() {
    const input =
        $("#coupon-code") ||
        $("#coupon-input") ||
        $("[name='coupon']");

    if (!input) {
        showToast("Coupon field not found.", "error");
        return;
    }

    const code = input.value.trim().toUpperCase();

    if (!code) {
        showToast("Enter a coupon code first.", "warning");
        return;
    }

    if (code === "CRAVE10") {
        activeCoupon = code;
        saveStorage(STORAGE_KEYS.coupon, activeCoupon);
        renderCart();
        showToast("CRAVE10 applied! You saved 10%.");
    } else {
        showToast("Invalid coupon code.", "error");
    }
}

function clearCoupon() {
    activeCoupon = null;
    saveStorage(STORAGE_KEYS.coupon, null);
    renderCart();
}


/* =========================
   10. CHECKOUT & BILL
========================= */

function openCheckout() {
    if (getCartItems().length === 0) {
        showToast("Your cart is empty!", "warning");
        return;
    }

    const modal =
        $("#checkout-modal") ||
        $("#checkout-dialog");

    if (!modal) {
        showToast("Checkout modal not found in index.html.", "error");
        return;
    }

    renderCart();
    openElement(modal);
}

function closeCheckout() {
    closeElement($("#checkout-modal") || $("#checkout-dialog"));
}

function getInputValue(selectors) {
    for (const selector of selectors) {
        const element = $(selector);
        if (element) return element.value.trim();
    }
    return "";
}

function handleCheckout(event) {
    if (event) event.preventDefault();

    const items = getCartItems();

    if (items.length === 0) {
        showToast("Your cart is empty!", "warning");
        return;
    }

    const customerName = getInputValue([
        "#customer-name",
        "#checkout-name",
        "[name='name']"
    ]);

    const phone = getInputValue([
        "#customer-phone",
        "#checkout-phone",
        "[name='phone']"
    ]);

    const address = getInputValue([
        "#customer-address",
        "#checkout-address",
        "[name='address']"
    ]);

    const email = getInputValue([
        "#customer-email",
        "#checkout-email",
        "[name='email']"
    ]);

    if (!customerName || !phone || !address) {
        showToast("Please fill in your name, phone and address.", "warning");
        return;
    }

    if (!/^[0-9+\-\s()]{10,18}$/.test(phone)) {
        showToast("Please enter a valid phone number.", "error");
        return;
    }

    const totals = getCartTotals();

    const order = {
        id: createId("CCORDER"),
        date: new Date().toISOString(),
        customer: {
            name: customerName,
            phone,
            email,
            address
        },
        items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            lineTotal: item.lineTotal
        })),
        totals,
        coupon: activeCoupon,
        paymentMethod: "Cash on Delivery",
        status: "Demo Order — Not Sent to Restaurant"
    };

    orders.unshift(order);
    saveStorage(STORAGE_KEYS.orders, orders);

    cart = [];
    activeCoupon = null;

    saveCart();
    saveStorage(STORAGE_KEYS.coupon, null);

    closeCheckout();
    closeCart();
    renderCart();

    showInvoice(order);
    showToast("Demo order created successfully!");

    const form = event?.target;
    if (form && typeof form.reset === "function") form.reset();
}

function showInvoice(order) {
    const modal = $("#invoice-modal");

    const invoiceHTML = buildInvoiceHTML(order);

    if (modal) {
        const body =
            $("#invoice-content", modal) ||
            $(".invoice-content", modal) ||
            $(".modal-body", modal);

        if (body) {
            body.innerHTML = invoiceHTML;
        } else {
            modal.innerHTML = `
                <button type="button" data-action="close-invoice" aria-label="Close invoice">×</button>
                ${invoiceHTML}
            `;
        }

        openElement(modal);
    } else {
        const win = window.open("", "_blank");

        if (!win) {
            showToast("Please allow pop-ups to view the invoice.", "warning");
            return;
        }

        win.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>CraveCart Invoice</title>
                <style>
                    body{font-family:Arial,sans-serif;padding:30px;max-width:800px;margin:auto;color:#222}
                    h1{color:#ff6b00}
                    table{width:100%;border-collapse:collapse;margin:20px 0}
                    th,td{text-align:left;padding:10px;border-bottom:1px solid #ddd}
                    .right{text-align:right}
                    .notice{padding:12px;background:#fff1e8;border-radius:8px}
                    button{padding:12px 20px;background:#ff6b00;color:#fff;border:0;border-radius:8px;cursor:pointer}
                    @media print{button{display:none}}
                </style>
            </head>
            <body>
                ${invoiceHTML}
                <button onclick="window.print()">Print / Save PDF</button>
            </body>
            </html>
        `);

        win.document.close();
    }
}

function buildInvoiceHTML(order) {
    const rows = order.items.map(item => `
        <tr>
            <td>${escapeHTML(item.name)}</td>
            <td>${item.quantity}</td>
            <td>${formatPrice(item.price)}</td>
            <td>${formatPrice(item.lineTotal)}</td>
        </tr>
    `).join("");

    return `
        <div class="invoice-document">
            <h1 style="color:#ff6b00">CraveCart</h1>
            <p><strong>Food. Mood. Delivered.</strong></p>
            <hr>

            <h2>Order Invoice</h2>

            <p>
                <strong>Order ID:</strong> ${escapeHTML(order.id)}<br>
                <strong>Date:</strong> ${new Date(order.date).toLocaleString("en-IN")}<br>
                <strong>Status:</strong> ${escapeHTML(order.status)}
            </p>

            <h3>Customer Details</h3>
            <p>
                ${escapeHTML(order.customer.name)}<br>
                ${escapeHTML(order.customer.phone)}<br>
                ${escapeHTML(order.customer.email || "Email not provided")}<br>
                ${escapeHTML(order.customer.address)}
            </p>

            <table style="width:100%;border-collapse:collapse">
                <thead>
                    <tr>
                        <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Item</th>
                        <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Qty</th>
                        <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Price</th>
                        <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Amount</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>

            <div style="max-width:340px;margin-left:auto">
                <p>Subtotal: <strong>${formatPrice(order.totals.subtotal)}</strong></p>
                <p>Delivery: <strong>${formatPrice(order.totals.delivery)}</strong></p>
                <p>Tax (estimate): <strong>${formatPrice(order.totals.tax)}</strong></p>
                <p>Discount: <strong>${formatPrice(order.totals.discount)}</strong></p>
                <h2>Total: ${formatPrice(order.totals.total)}</h2>
            </div>

            <p><strong>Payment:</strong> Cash on Delivery (demo only)</p>

            <div style="padding:12px;background:#fff1e8;border-radius:8px">
                <strong>Demo invoice:</strong> This is a local demonstration order.
                No restaurant has been notified and no payment has been collected.
            </div>

            <p>Thank you for choosing CraveCart! ❤️</p>

            <button type="button" onclick="window.print()"
                style="padding:12px 20px;background:#ff6b00;color:white;border:0;border-radius:8px;cursor:pointer">
                Print / Save as PDF
            </button>
        </div>
    `;
}

function closeInvoice() {
    closeElement($("#invoice-modal"));
}


/* =========================
   11. ADMIN PANEL
========================= */

/*
  DEMO SECURITY WARNING:
  Password placed in client-side JavaScript is visible to visitors.
  This is not production-grade authentication.
*/

function openAdminLogin() {
    const modal =
        $("#admin-login-modal") ||
        $("#admin-login");

    if (modal) {
        openElement(modal);
        return;
    }

    const password = prompt("Enter CraveCart admin password:");

    if (password === null) return;

    if (password === CONFIG.adminPassword) {
        showAdminPanel();
    } else {
        showToast("Incorrect admin password.", "error");
    }
}

function closeAdminLogin() {
    closeElement($("#admin-login-modal") || $("#admin-login"));
}

function handleAdminLogin(event) {
    if (event) event.preventDefault();

    const passwordInput =
        $("#admin-password") ||
        $("#admin-login-password") ||
        $("[name='admin-password']");

    if (!passwordInput) {
        showToast("Admin password field not found.", "error");
        return;
    }

    if (passwordInput.value === CONFIG.adminPassword) {
        closeAdminLogin();
        passwordInput.value = "";
        showAdminPanel();
    } else {
        showToast("Incorrect admin password.", "error");
        passwordInput.value = "";
        passwordInput.focus();
    }
}

function showAdminPanel() {
    let panel = $("#admin-panel");

    if (!panel) {
        panel = document.createElement("section");
        panel.id = "admin-panel";

        Object.assign(panel.style, {
            position: "fixed",
            inset: "0",
            zIndex: "99990",
            overflowY: "auto",
            padding: "24px",
            background: "#101010",
            color: "#f5f5f5",
            fontFamily: "Arial, sans-serif"
        });

        document.body.appendChild(panel);
    }

    renderAdminPanel();
    openElement(panel);
}

function closeAdminPanel() {
    closeElement($("#admin-panel"));
}

function renderAdminPanel() {
    const panel = $("#admin-panel");
    if (!panel) return;

    const revenue = orders.reduce(
        (sum, order) => sum + (order.totals?.total || 0), 0
    );

    panel.innerHTML = `
        <div style="max-width:1200px;margin:auto">
            <header style="display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap">
                <div>
                    <h1 style="color:#ff6b00;margin-bottom:6px">CraveCart Admin</h1>
                    <p style="color:#aaa;margin-top:0">Local demo dashboard</p>
                </div>

                <button type="button" data-action="admin-close"
                    style="padding:12px 18px;background:#ff6b00;color:#fff;border:0;border-radius:10px;cursor:pointer">
                    Close Panel ✕
                </button>
            </header>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:24px 0">
                ${adminStat("Products", products.length)}
                ${adminStat("Orders", orders.length)}
                ${adminStat("Wishlist Saves", wishlist.length)}
                ${adminStat("Demo Order Total", formatPrice(revenue))}
            </div>

            <section style="background:#1c1c1c;padding:20px;border-radius:16px;margin-bottom:20px">
                <h2>Add New Product</h2>

                <form id="admin-product-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
                    <input name="name" placeholder="Product name" required>
                    <input name="category" placeholder="Category e.g. Pizza" required>
                    <input name="price" type="number" min="1" placeholder="Price" required>
                    <input name="oldPrice" type="number" min="0" placeholder="Old price">
                    <input name="image" type="url" placeholder="Image URL" required>
                    <input name="description" placeholder="Short description">
                    <input name="rating" type="number" min="1" max="5" step=".1" value="4.5" placeholder="Rating">

                    <button type="submit"
                        style="padding:12px;background:#ff6b00;color:white;border:0;border-radius:8px;cursor:pointer">
                        Add Product
                    </button>
                </form>
            </section>

            <section style="background:#1c1c1c;padding:20px;border-radius:16px;margin-bottom:20px">
                <h2>Product Inventory</h2>
                <div style="overflow-x:auto">
                    <table style="width:100%;border-collapse:collapse;min-width:600px">
                        <thead>
                            <tr>
                                <th style="text-align:left;padding:10px">Product</th>
                                <th style="text-align:left;padding:10px">Category</th>
                                <th style="text-align:left;padding:10px">Price</th>
                                <th style="text-align:left;padding:10px">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(product => `
                                <tr>
                                    <td style="padding:10px;border-top:1px solid #333">${escapeHTML(product.name)}</td>
                                    <td style="padding:10px;border-top:1px solid #333">${escapeHTML(product.category)}</td>
                                    <td style="padding:10px;border-top:1px solid #333">${formatPrice(product.price)}</td>
                                    <td style="padding:10px;border-top:1px solid #333">
                                        <button type="button"
                                            data-action="admin-delete-product"
                                            data-id="${product.id}"
                                            style="background:#d32f2f;color:white;border:0;padding:8px 10px;border-radius:6px;cursor:pointer">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </section>

            <section style="background:#1c1c1c;padding:20px;border-radius:16px;margin-bottom:20px">
                <h2>Recent Orders</h2>

                ${orders.length ? orders.slice(0, 30).map(order => `
                    <article style="padding:14px;border-bottom:1px solid #333">
                        <strong>${escapeHTML(order.id)}</strong>
                        <p>${escapeHTML(order.customer?.name || "Customer")} · ${formatPrice(order.totals?.total || 0)}</p>
                        <small style="color:#aaa">${new Date(order.date).toLocaleString("en-IN")}</small>
                        <p style="color:#ffb37f">${escapeHTML(order.status || "Demo order")}</p>
                        <button type="button"
                            data-action="admin-view-invoice"
                            data-id="${escapeHTML(order.id)}"
                            style="padding:8px 12px;border:0;border-radius:6px;cursor:pointer">
                            View Invoice
                        </button>
                    </article>
                `).join("") : "<p>No demo orders yet.</p>"}
            </section>

            <div style="display:flex;gap:12px;flex-wrap:wrap">
                <button type="button" data-action="admin-export"
                    style="padding:12px;background:#ff6b00;color:white;border:0;border-radius:8px;cursor:pointer">
                    Export Orders CSV
                </button>

                <button type="button" data-action="admin-reset-products"
                    style="padding:12px;background:#444;color:white;border:0;border-radius:8px;cursor:pointer">
                    Restore Default Products
                </button>
            </div>

            <p style="color:#aaa;margin-top:24px;line-height:1.6">
                Demo dashboard only: products and orders are stored in this browser.
                This panel does not provide secure authentication or a real server-side order system.
            </p>
        </div>
    `;

    $$("input", panel).forEach(input => {
        Object.assign(input.style, {
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #444",
            background: "#111",
            color: "#fff",
            minWidth: "0"
        });
    });
}

function adminStat(label, value) {
    return `
        <div style="padding:20px;background:#1c1c1c;border-radius:14px">
            <p style="color:#aaa;margin:0 0 10px">${escapeHTML(label)}</p>
            <h2 style="margin:0;color:#ff6b00">${escapeHTML(value)}</h2>
        </div>
    `;
}

function handleAdminProductAdd(event) {
    event.preventDefault();

    const form = event.target;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const category = String(data.get("category") || "").trim();
    const price = Number(data.get("price"));
    const oldPrice = Number(data.get("oldPrice")) || price;
    const image = String(data.get("image") || "").trim();
    const description = String(data.get("description") || "").trim();
    const rating = Number(data.get("rating")) || 4.5;

    if (!name || !category || !image || !Number.isFinite(price) || price <= 0) {
        showToast("Please provide valid product details.", "error");
        return;
    }

    products.push({
        id: Date.now(),
        name,
        category,
        price,
        oldPrice,
        rating: Math.min(5, Math.max(1, rating)),
        reviews: 0,
        badge: "New",
        veg: true,
        time: "20–30 min",
        description,
        image
    });

    saveStorage(STORAGE_KEYS.products, products);

    renderCategories();
    renderProducts();
    renderAdminPanel();

    showToast("Product added successfully!");
}

function deleteAdminProduct(productId) {
    const product = getProduct(productId);
    if (!product) return;

    if (!confirm(`Delete "${product.name}"?`)) return;

    products = products.filter(item => String(item.id) !== String(productId));
    cart = cart.filter(item => String(item.id) !== String(productId));
    wishlist = wishlist.filter(id => String(id) !== String(productId));

    saveStorage(STORAGE_KEYS.products, products);
    saveCart();
    saveStorage(STORAGE_KEYS.wishlist, wishlist);

    renderCategories();
    renderProducts();
    renderCart();
    renderWishlist();
    renderAdminPanel();

    showToast("Product deleted.");
}

function resetDefaultProducts() {
    if (!confirm("Restore the original product list?")) return;

    products = DEFAULT_PRODUCTS.map(product => ({ ...product }));

    saveStorage(STORAGE_KEYS.products, products);

    renderCategories();
    renderProducts();
    renderAdminPanel();

    showToast("Default products restored.");
}

function exportOrdersCSV() {
    if (orders.length === 0) {
        showToast("No orders to export.", "warning");
        return;
    }

    const columns = [
        "Order ID",
        "Date",
        "Customer",
        "Phone",
        "Address",
        "Items",
        "Subtotal",
        "Delivery",
        "Tax",
        "Discount",
        "Total",
        "Status"
    ];

    const rows = orders.map(order => [
        order.id,
        order.date,
        order.customer?.name || "",
        order.customer?.phone || "",
        order.customer?.address || "",
        order.items.map(item => `${item.name} x${item.quantity}`).join("; "),
        order.totals?.subtotal || 0,
        order.totals?.delivery || 0,
        order.totals?.tax || 0,
        order.totals?.discount || 0,
        order.totals?.total || 0,
        order.status || ""
    ]);

    const csvCell = value =>
        '"' + String(value ?? "").replace(/"/g, '""') + '"';

    const csv = [columns, ...rows]
        .map(row => row.map(csvCell).join(","))
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "cravecart-orders.csv";
    anchor.click();

    URL.revokeObjectURL(url);
    showToast("Orders CSV exported.");
}

function adminViewInvoice(orderId) {
    const order = orders.find(item => String(item.id) === String(orderId));

    if (!order) {
        showToast("Order not found.", "error");
        return;
    }

    showInvoice(order);
}


/* =========================
   12. MOBILE NAVIGATION
========================= */

function toggleMobileMenu() {
    const menu =
        $("#nav-menu") ||
        $("#mobile-menu") ||
        $(".nav-links");

    if (!menu) return;

    menu.classList.toggle("open");
    menu.classList.toggle("active");

    const button =
        $("#menu-toggle") ||
        $("[data-action='menu-toggle']");

    if (button) {
        button.setAttribute(
            "aria-expanded",
            menu.classList.contains("open") ? "true" : "false"
        );
    }
}


/* =========================
   13. SEARCH & SORT
========================= */

function handleSearch(event) {
    searchQuery = event.target.value.trim();
    renderProducts();
}

function handleSort(event) {
    sortMode = event.target.value;
    renderProducts();
}


/* =========================
   14. EVENT DELEGATION
========================= */

document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    switch (action) {
        case "add-cart":
            addToCart(id);
            break;

        case "wishlist":
            toggleWishlist(id);
            break;

        case "category":
            activeCategory = button.dataset.category || "All";
            renderCategories();
            renderProducts();
            break;

        case "quantity-plus":
            updateCartQuantity(id, 1);
            break;

        case "quantity-minus":
            updateCartQuantity(id, -1);
            break;

        case "remove-cart":
            removeFromCart(id);
            break;

        case "open-cart":
            openCart();
            break;

        case "close-cart":
            closeCart();
            break;

        case "open-wishlist":
            openWishlist();
            break;

        case "close-wishlist":
            closeWishlist();
            break;

        case "checkout":
        case "open-checkout":
            openCheckout();
            break;

        case "close-checkout":
            closeCheckout();
            break;

        case "apply-coupon":
            applyCoupon();
            break;

        case "clear-coupon":
            clearCoupon();
            break;

        case "close-invoice":
            closeInvoice();
            break;

        case "admin-login":
        case "open-admin":
            openAdminLogin();
            break;

        case "admin-close":
            closeAdminPanel();
            break;

        case "admin-delete-product":
            deleteAdminProduct(id);
            break;

        case "admin-export":
            exportOrdersCSV();
            break;

        case "admin-reset-products":
            resetDefaultProducts();
            break;

        case "admin-view-invoice":
            adminViewInvoice(id);
            break;

        case "menu-toggle":
            toggleMobileMenu();
            break;

        case "clear-search":
            searchQuery = "";

            const searchInput =
                $("#search-input") ||
                $("#product-search") ||
                $("[data-search]");

            if (searchInput) searchInput.value = "";

            activeCategory = "All";
            renderCategories();
            renderProducts();
            break;
    }
});

document.addEventListener("submit", event => {
    if (event.target.id === "checkout-form") {
        handleCheckout(event);
    }

    if (
        event.target.id === "admin-login-form" ||
        event.target.id === "admin-login"
    ) {
        handleAdminLogin(event);
    }

    if (event.target.id === "admin-product-form") {
        handleAdminProductAdd(event);
    }
});

document.addEventListener("input", event => {
    if (
        event.target.matches("#search-input") ||
        event.target.matches("#product-search") ||
        event.target.matches("[data-search]")
    ) {
        handleSearch(event);
    }
});

document.addEventListener("change", event => {
    if (
        event.target.matches("#sort-select") ||
        event.target.matches("[data-sort]")
    ) {
        handleSort(event);
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeWishlist();
        closeCheckout();
        closeInvoice();
        closeAdminLogin();
        closeAdminPanel();
    }
});


/* =========================
   15. CLICK OUTSIDE MODALS
========================= */

document.addEventListener("click", event => {
    const backdropSelectors = [
        "#cart-drawer",
        "#wishlist-modal",
        "#checkout-modal",
        "#invoice-modal",
        "#admin-login-modal"
    ];

    backdropSelectors.forEach(selector => {
        const element = $(selector);

        if (element && event.target === element) {
            closeElement(element);
        }
    });
});


/* =========================
   16. SCROLL ANIMATIONS
========================= */

function initScrollAnimations() {
    const animated = $$(
        ".product-card, .feature-card, .section-heading, [data-animate]"
    );

    if (!("IntersectionObserver" in window)) {
        animated.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "none";
        });
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08
    });

    animated.forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}


/* =========================
   17. FOOTER YEAR
========================= */

function setFooterYear() {
    const yearElement =
        $("#current-year") ||
        $("#footer-year") ||
        $("[data-current-year]");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


/* =========================
   18. INITIALIZE WEBSITE
========================= */

function initCraveCart() {
    renderCategories();
    renderProducts();
    renderCart();
    renderWishlist();
    setFooterYear();

    const adminLoginForm = $("#admin-login-form");

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", handleAdminLogin);
    }

    const checkoutForm = $("#checkout-form");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", handleCheckout);
    }

    const searchInput =
        $("#search-input") ||
        $("#product-search") ||
        $("[data-search]");

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    const sortSelect =
        $("#sort-select") ||
        $("[data-sort]");

    if (sortSelect) {
        sortSelect.addEventListener("change", handleSort);
    }

    initScrollAnimations();

    console.log(
        "%c🍔 CraveCart Loaded Successfully!",
        "color:#FF6B00;font-size:16px;font-weight:bold"
    );

    console.log(
        "Demo mode: cart, products and orders are saved in this browser."
    );
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCraveCart);
} else {
    initCraveCart();
}
