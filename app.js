```javascript
/* =========================================================
   CRAVECART PREMIUM FOOD ORDERING WEBSITE
   File: app.js
   Features:
   - 100+ vegetarian food products
   - Category filtering and search
   - Product sorting
   - Shopping cart
   - Wishlist / favourites
   - Quantity management
   - Coupon system
   - Delivery charges and tax calculation
   - Checkout form
   - Invoice generation, print and download
   - LocalStorage persistence
   - Product quick view
   - Toast notifications
   - Newsletter demo
   - Admin panel support
========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURATION
========================================================= */

const CC = {
    currency: "INR",
    locale: "en-IN",
    taxRate: 0.05,
    deliveryFee: 39,
    freeDeliveryMinimum: 499,
    minimumOrder: 99,
    storage: {
        cart: "cravecart_cart",
        wishlist: "cravecart_wishlist",
        orders: "cravecart_orders",
        products: "cravecart_products",
        coupon: "cravecart_coupon",
        lastOrder: "cravecart_last_order"
    }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.warn("Storage read error:", key, error);
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn("Storage write error:", key, error);
        showToast("Browser storage unavailable.", "error");
        return false;
    }
}

function money(value) {
    return new Intl.NumberFormat(CC.locale, {
        style: "currency",
        currency: CC.currency,
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function makeId(prefix = "CC") {
    return prefix + "-" + Date.now().toString(36).toUpperCase() +
        "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function getImage(name, category) {
    const images = {
        "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
        "Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
        "Biryani": "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=85",
        "Indian": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=85",
        "Chinese": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=85",
        "Dessert": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=85",
        "Drinks": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=85",
        "Snacks": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
        "South Indian": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85",
        "Rolls": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=85"
    };

    const key = Object.keys(images).find(item =>
        String(category).toLowerCase().includes(item.toLowerCase())
    );

    return images[key] || images[name] ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=85";
}

/* =========================================================
   2. PRODUCT DATABASE
========================================================= */

const starterProducts = [
    {
        id: 1, name: "Margherita Pizza", category: "Pizza",
        price: 199, oldPrice: 249, rating: 4.8,
        description: "Classic pizza with mozzarella, tomato sauce and fresh basil.",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=85",
        badge: "Bestseller", veg: true
    },
    {
        id: 2, name: "Farmhouse Pizza", category: "Pizza",
        price: 299, oldPrice: 349, rating: 4.7,
        description: "Loaded with capsicum, onion, mushroom and golden cheese.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
        badge: "Popular", veg: true
    },
    {
        id: 3, name: "Paneer Tikka Pizza", category: "Pizza",
        price: 329, oldPrice: 379, rating: 4.9,
        description: "Indian-style pizza topped with spicy paneer tikka.",
        badge: "Chef's Pick", veg: true
    },
    {
        id: 4, name: "Veggie Supreme Pizza", category: "Pizza",
        price: 349, oldPrice: 399, rating: 4.6,
        description: "A colourful mix of fresh vegetables and cheese.",
        veg: true
    },
    {
        id: 5, name: "Classic Veg Burger", category: "Burger",
        price: 129, oldPrice: 159, rating: 4.5,
        description: "Crispy vegetable patty with lettuce and signature sauce.",
        badge: "Popular", veg: true
    },
    {
        id: 6, name: "Cheese Blast Burger", category: "Burger",
        price: 179, oldPrice: 219, rating: 4.8,
        description: "A delicious burger packed with molten cheese.",
        veg: true
    },
    {
        id: 7, name: "Paneer Crunch Burger", category: "Burger",
        price: 199, oldPrice: 249, rating: 4.7,
        description: "Crispy paneer patty with creamy spicy mayo.",
        veg: true
    },
    {
        id: 8, name: "Aloo Tikki Burger", category: "Burger",
        price: 99, oldPrice: 129, rating: 4.4,
        description: "Golden potato tikki with tangy Indian sauces.",
        veg: true
    },
    {
        id: 9, name: "Veg Dum Biryani", category: "Biryani",
        price: 189, oldPrice: 229, rating: 4.8,
        description: "Fragrant basmati rice cooked with vegetables and spices.",
        badge: "Bestseller", veg: true
    },
    {
        id: 10, name: "Paneer Biryani", category: "Biryani",
        price: 229, oldPrice: 279, rating: 4.9,
        description: "Aromatic rice with marinated paneer and herbs.",
        veg: true
    },
    {
        id: 11, name: "Hyderabadi Veg Biryani", category: "Biryani",
        price: 219, oldPrice: 259, rating: 4.7,
        description: "Traditional-style dum biryani with fragrant spices.",
        veg: true
    },
    {
        id: 12, name: "Paneer Butter Masala", category: "Indian",
        price: 249, oldPrice: 299, rating: 4.9,
        description: "Soft paneer in a rich, creamy tomato gravy.",
        badge: "Chef's Pick", veg: true
    },
    {
        id: 13, name: "Dal Makhani", category: "Indian",
        price: 199, oldPrice: 239, rating: 4.8,
        description: "Slow-cooked black lentils with buttery cream.",
        veg: true
    },
    {
        id: 14, name: "Shahi Paneer", category: "Indian",
        price: 259, oldPrice: 309, rating: 4.7,
        description: "Paneer in a smooth royal cashew and tomato gravy.",
        veg: true
    },
    {
        id: 15, name: "Chole Bhature", category: "Indian",
        price: 149, oldPrice: 179, rating: 4.6,
        description: "Spiced chickpeas served with fluffy fried bhature.",
        veg: true
    },
    {
        id: 16, name: "Veg Hakka Noodles", category: "Chinese",
        price: 159, oldPrice: 199, rating: 4.5,
        description: "Wok-tossed noodles with crunchy vegetables.",
        veg: true
    },
    {
        id: 17, name: "Veg Manchurian", category: "Chinese",
        price: 169, oldPrice: 209, rating: 4.6,
        description: "Vegetable dumplings tossed in tangy Manchurian sauce.",
        veg: true
    },
    {
        id: 18, name: "Chilli Paneer", category: "Chinese",
        price: 219, oldPrice: 259, rating: 4.8,
        description: "Paneer cubes tossed with peppers and spicy sauce.",
        veg: true
    },
    {
        id: 19, name: "Chocolate Brownie", category: "Dessert",
        price: 99, oldPrice: 129, rating: 4.7,
        description: "Rich chocolate brownie with a fudgy centre.",
        veg: true
    },
    {
        id: 20, name: "Chocolate Lava Cake", category: "Dessert",
        price: 129, oldPrice: 159, rating: 4.9,
        description: "Warm chocolate cake with a molten centre.",
        badge: "Bestseller", veg: true
    },
    {
        id: 21, name: "Gulab Jamun", category: "Dessert",
        price: 79, oldPrice: 99, rating: 4.6,
        description: "Soft milk dumplings soaked in fragrant sugar syrup.",
        veg: true
    },
    {
        id: 22, name: "Cold Coffee", category: "Drinks",
        price: 99, oldPrice: 129, rating: 4.5,
        description: "Chilled creamy coffee served over ice.",
        veg: true
    },
    {
        id: 23, name: "Mango Smoothie", category: "Drinks",
        price: 119, oldPrice: 149, rating: 4.7,
        description: "Refreshing mango smoothie made with ripe mangoes.",
        veg: true
    },
    {
        id: 24, name: "Fresh Lime Soda", category: "Drinks",
        price: 59, oldPrice: 79, rating: 4.4,
        description: "Refreshing lime soda with a hint of mint.",
        veg: true
    },
    {
        id: 25, name: "French Fries", category: "Snacks",
        price: 89, oldPrice: 119, rating: 4.6,
        description: "Golden crispy fries seasoned to perfection.",
        veg: true
    },
    {
        id: 26, name: "Peri Peri Fries", category: "Snacks",
        price: 109, oldPrice: 139, rating: 4.7,
        description: "Crispy fries tossed in spicy peri-peri seasoning.",
        veg: true
    },
    {
        id: 27, name: "Samosa (2 pcs)", category: "Snacks",
        price: 49, oldPrice: 69, rating: 4.5,
        description: "Crispy pastry filled with spiced potato and peas.",
        veg: true
    },
    {
        id: 28, name: "Masala Dosa", category: "South Indian",
        price: 129, oldPrice: 159, rating: 4.8,
        description: "Crispy dosa stuffed with spiced potato masala.",
        veg: true
    },
    {
        id: 29, name: "Idli Sambar", category: "South Indian",
        price: 89, oldPrice: 119, rating: 4.6,
        description: "Soft steamed idlis served with sambar and chutney.",
        veg: true
    },
    {
        id: 30, name: "Paneer Kathi Roll", category: "Rolls",
        price: 149, oldPrice: 189, rating: 4.7,
        description: "Spiced paneer wrapped in a soft flaky roll.",
        veg: true
    }
];

/* Create 100+ menu entries using the starter menu. */
function createFullMenu() {
    const products = starterProducts.map(product => ({
        ...product,
        image: product.image || getImage(product.name, product.category)
    }));

    const variants = [
        { suffix: "Special", add: 20 },
        { suffix: "Deluxe", add: 40 },
        { suffix: "Classic", add: 0 }
    ];

    let id = 31;

    starterProducts.forEach((product, index) => {
        variants.forEach((variant, variantIndex) => {
            if (products.length >= 110) return;

            products.push({
                ...product,
                id: id++,
                name: `${product.name} ${variant.suffix}`,
                price: product.price + variant.add,
                oldPrice: product.oldPrice + variant.add,
                badge: variantIndex === 1 ? "Premium" : "",
                description: `${variant.suffix} version of ${product.name}. Freshly prepared vegetarian food.`,
                image: product.image || getImage(product.name, product.category)
            });
        });
    });

    return products;
}

let products = readStorage(CC.storage.products, null);

if (!Array.isArray(products) || products.length === 0) {
    products = createFullMenu();
    writeStorage(CC.storage.products, products);
}

let cart = readStorage(CC.storage.cart, []);
let wishlist = readStorage(CC.storage.wishlist, []);
let orders = readStorage(CC.storage.orders, []);
let activeCategory = "All";
let searchTerm = "";
let activeCoupon = readStorage(CC.storage.coupon, null);
let lastInvoice = readStorage(CC.storage.lastOrder, null);

/* Normalise data in case storage contains invalid entries. */
if (!Array.isArray(cart)) cart = [];
if (!Array.isArray(wishlist)) wishlist = [];
if (!Array.isArray(orders)) orders = [];

cart = cart.filter(item =>
    item && products.some(product => String(product.id) === String(item.id)) &&
    Number(item.quantity) > 0
);

wishlist = wishlist.filter(id =>
    products.some(product => String(product.id) === String(id))
);

/* =========================================================
   3. TOAST NOTIFICATIONS
========================================================= */

function showToast(message, type = "success") {
    let container = $("#toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.setAttribute("aria-live", "polite");
        container.style.cssText =
            "position:fixed;right:20px;bottom:20px;z-index:99999;" +
            "display:flex;flex-direction:column;gap:10px;max-width:90vw;";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `cc-toast cc-toast-${type}`;
    toast.textContent = message;
    toast.style.cssText =
        "padding:14px 18px;border-radius:12px;background:#171717;" +
        "color:#fff;box-shadow:0 8px 28px #0003;font-size:14px;" +
        "animation:ccToastIn .25s ease;";

    if (!$("#cc-toast-styles")) {
        const style = document.createElement("style");
        style.id = "cc-toast-styles";
        style.textContent = `
            @keyframes ccToastIn {
                from {opacity:0;transform:translateY(12px)}
                to {opacity:1;transform:translateY(0)}
            }
            .cc-toast-error {border-left:4px solid #ff4242}
            .cc-toast-success {border-left:4px solid #ff6b00}
        `;
        document.head.appendChild(style);
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = ".25s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* =========================================================
   4. PRODUCT CARD RENDERING
========================================================= */

function productCard(product) {
    const favourite = wishlist.some(id => String(id) === String(product.id));
    const discount = product.oldPrice > product.price
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    return `
        <article class="product-card cc-product-card" data-product-id="${escapeHTML(product.id)}">
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${escapeHTML(product.image || getImage(product.name, product.category))}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';"
                >

                ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
                ${discount ? `<span class="cc-discount-badge">${discount}% OFF</span>` : ""}

                <button
                    class="wishlist-btn ${favourite ? "active" : ""}"
                    type="button"
                    data-action="toggle-favourite"
                    data-id="${escapeHTML(product.id)}"
                    aria-label="${favourite ? "Remove from favourites" : "Add to favourites"}"
                    title="Add to favourites"
                >${favourite ? "♥" : "♡"}</button>
            </div>

            <div class="product-info">
                <div class="product-category">${escapeHTML(product.category || "Vegetarian")}</div>
                <h3 class="product-name">${escapeHTML(product.name)}</h3>
                <p class="product-description">${escapeHTML(product.description || "Freshly prepared and delicious.")}</p>

                <div class="product-rating">
                    <span aria-label="Rating">★</span>
                    <span>${Number(product.rating || 4.5).toFixed(1)}</span>
                    <span class="rating-label">• Fresh & tasty</span>
                </div>

                <div class="product-card-bottom">
                    <div class="product-price">
                        <strong>${money(product.price)}</strong>
                        ${product.oldPrice > product.price
                            ? `<del>${money(product.oldPrice)}</del>`
                            : ""}
                    </div>

                    <button
                        class="add-to-cart-btn"
                        type="button"
                        data-action="add-cart"
                        data-id="${escapeHTML(product.id)}"
                    >+ Add</button>
                </div>
            </div>
        </article>
    `;
}

function getFilteredProducts() {
    let list = [...products];

    if (activeCategory !== "All") {
        list = list.filter(product =>
            String(product.category).toLowerCase() === activeCategory.toLowerCase()
        );
    }

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        list = list.filter(product =>
            `${product.name} ${product.category} ${product.description || ""}`
                .toLowerCase().includes(term)
        );
    }

    const sort = $("#sort-products")?.value || "featured";

    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
}

function renderProducts() {
    const grid = $("#products-grid");
    if (!grid) return;

    const list = getFilteredProducts();

    grid.innerHTML = list.map(productCard).join("");

    const count = $("#product-results-count");
    if (count) count.textContent = `${list.length} items`;

    const noResults = $("#no-results");
    if (noResults) noResults.hidden = list.length !== 0;

    const showAll = $("#show-all-products");
    if (showAll) showAll.hidden = list.length !== 0;

    grid.setAttribute("aria-busy", "false");
}

/* =========================================================
   5. CATEGORY FILTERS
========================================================= */

function renderCategories() {
    const container = $("#category-list");
    if (!container) return;

    const categories = ["All", ...new Set(products.map(product => product.category).filter(Boolean))];

    container.innerHTML = categories.map(category => `
        <button
            type="button"
            class="category-btn ${activeCategory === category ? "active" : ""}"
            data-action="category"
            data-category="${escapeHTML(category)}"
        >${escapeHTML(category === "All" ? "All Items" : category)}</button>
    `).join("");
}

function setCategory(category) {
    activeCategory = category || "All";
    renderCategories();
    renderProducts();
}

/* =========================================================
   6. CART OPERATIONS
========================================================= */

function saveCart() {
    writeStorage(CC.storage.cart, cart);
}

function addToCart(id, quantity = 1) {
    const product = products.find(item => String(item.id) === String(id));

    if (!product) {
        showToast("Product not found.", "error");
        return;
    }

    const existing = cart.find(item => String(item.id) === String(id));

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            quantity,
            name: product.name,
            price: Number(product.price),
            image: product.image
        });
    }

    saveCart();
    renderCart();
    showToast(`${product.name} added to cart!`);
}

function updateQuantity(id, change) {
    const item = cart.find(entry => String(entry.id) === String(id));
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(entry => String(entry.id) !== String(id));
    }

    saveCart();
    renderCart();
}

function removeFromCart(id) {
    const item = cart.find(entry => String(entry.id) === String(id));

    cart = cart.filter(entry => String(entry.id) !== String(id));
    saveCart();
    renderCart();

    if (item) showToast(`${item.name} removed from cart.`);
}

function cartSubtotal() {
    return cart.reduce((sum, item) => {
        const product = products.find(p => String(p.id) === String(item.id));
        const price = product ? Number(product.price) : Number(item.price);
        return sum + price * Number(item.quantity);
    }, 0);
}

function calculateBill() {
    const subtotal = cartSubtotal();
    const delivery = subtotal === 0 || subtotal >= CC.freeDeliveryMinimum
        ? 0
        : CC.deliveryFee;

    let discount = 0;

    if (activeCoupon && subtotal > 0) {
        if (activeCoupon.code === "CRAVE10") {
            discount = Math.min(Math.round(subtotal * 0.10), 150);
        } else if (activeCoupon.code === "WELCOME50" && subtotal >= 299) {
            discount = 50;
        } else if (activeCoupon.code === "FREESHIP" && subtotal >= 199) {
            discount = delivery;
        }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * CC.taxRate * 100) / 100;
    const total = Math.max(0, subtotal + delivery + tax - discount);

    return { subtotal, delivery, discount, tax, total };
}

function renderCart() {
    const itemsContainer = $("#cart-items");
    const { subtotal, delivery, discount, tax, total } = calculateBill();

    const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

    ["#cart-count", "#cart-heading-count"].forEach(selector => {
        const element = $(selector);
        if (element) element.textContent = itemCount;
    });

    if (itemsContainer) {
        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="empty-cart cc-empty-state">
                    <div style="font-size:48px;margin-bottom:12px">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some delicious vegetarian food to get started.</p>
                    <button type="button" class="primary-btn" data-action="close-cart">Explore Menu</button>
                </div>
            `;
        } else {
            itemsContainer.innerHTML = cart.map(item => {
                const product = products.find(p => String(p.id) === String(item.id));
                const name = product?.name || item.name;
                const image = product?.image || item.image || getImage(name, "");
                const price = Number(product?.price ?? item.price);

                return `
                    <div class="cart-item cc-cart-item">
                        <img src="${escapeHTML(image)}" alt="${escapeHTML(name)}"
                            onerror="this.style.display='none'">
                        <div class="cart-item-info">
                            <h4>${escapeHTML(name)}</h4>
                            <p>${money(price)}</p>
                            <div class="cart-quantity">
                                <button type="button" data-action="quantity" data-id="${escapeHTML(item.id)}" data-change="-1" aria-label="Decrease quantity">−</button>
                                <span>${item.quantity}</span>
                                <button type="button" data-action="quantity" data-id="${escapeHTML(item.id)}" data-change="1" aria-label="Increase quantity">+</button>
                            </div>
                        </div>
                        <div class="cart-item-end">
                            <strong>${money(price * item.quantity)}</strong>
                            <button type="button" data-action="remove-cart" data-id="${escapeHTML(item.id)}" aria-label="Remove item">Remove</button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    setText("#cart-subtotal", money(subtotal));
    setText("#cart-delivery", delivery === 0 && subtotal > 0 ? "FREE" : money(delivery));
    setText("#cart-tax", money(tax));
    setText("#cart-discount", `−${money(discount)}`);
    setText("#cart-total", money(total));
    setText("#checkout-total", money(total));

    const discountRow = $("#discount-row");
    if (discountRow) discountRow.hidden = discount <= 0;

    const progressText = $("#delivery-progress-text");
    const progressBar = $("#cart-progress-bar");

    if (subtotal >= CC.freeDeliveryMinimum) {
        if (progressText) progressText.textContent = "🎉 You've unlocked free delivery!";
        if (progressBar) progressBar.style.width = "100%";
    } else {
        const remaining = CC.freeDeliveryMinimum - subtotal;
        if (progressText) progressText.textContent =
            `Add ${money(remaining)} more for free delivery`;
        if (progressBar) {
            progressBar.style.width =
                `${Math.min(100, subtotal / CC.freeDeliveryMinimum * 100)}%`;
        }
    }

    if (cart.length === 0 && activeCoupon) {
        activeCoupon = null;
        writeStorage(CC.storage.coupon, null);
        updateCouponMessage("");
    }
}

/* =========================================================
   7. WISHLIST / FAVOURITES
========================================================= */

function toggleFavourite(id) {
    const exists = wishlist.some(item => String(item) === String(id));

    if (exists) {
        wishlist = wishlist.filter(item => String(item) !== String(id));
        showToast("Removed from favourites.");
    } else {
        wishlist.push(id);
        showToast("Added to favourites ❤️");
    }

    writeStorage(CC.storage.wishlist, wishlist);
    renderProducts();
    renderWishlist();
    updateWishlistCount();
}

function updateWishlistCount() {
    const count = $("#wishlist-count");
    if (count) count.textContent = wishlist.length;
}

function renderWishlist() {
    const container = $("#wishlist-items");
    if (!container) return;

    const favouriteProducts = products.filter(product =>
        wishlist.some(id => String(id) === String(product.id))
    );

    if (favouriteProducts.length === 0) {
        container.innerHTML = `
            <div class="cc-empty-state">
                <div style="font-size:44px">♡</div>
                <h3>No favourites yet</h3>
                <p>Tap the heart on any food item to save it here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = favouriteProducts.map(product => `
        <div class="wishlist-item cc-wishlist-item">
            <img src="${escapeHTML(product.image || getImage(product.name, product.category))}"
                 alt="${escapeHTML(product.name)}" loading="lazy">
            <div class="wishlist-item-info">
                <h4>${escapeHTML(product.name)}</h4>
                <strong>${money(product.price)}</strong>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
                    <button type="button" data-action="add-cart" data-id="${escapeHTML(product.id)}">Add to cart</button>
                    <button type="button" data-action="toggle-favourite" data-id="${escapeHTML(product.id)}">Remove ♥</button>
                </div>
            </div>
        </div>
    `).join("");
}

/* =========================================================
   8. MODAL AND DRAWER CONTROLS
========================================================= */

function openElement(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.hidden = false;
    element.classList.add("active", "open");
    element.setAttribute("aria-hidden", "false");
    document.body.classList.add("cc-modal-open");
}

function closeElement(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.classList.remove("active", "open");
    element.setAttribute("aria-hidden", "true");

    if (id === "cart-drawer" || id.endsWith("-overlay")) {
        element.hidden = true;
    } else {
        element.hidden = true;
    }

    if (!$(".active[role='dialog'], .active.modal, .active.cart-drawer")) {
        document.body.classList.remove("cc-modal-open");
    }
}

function openCart() {
    renderCart();
    openElement("cart-overlay");
    openElement("cart-drawer");
}

function closeCart() {
    closeElement("cart-drawer");
    closeElement("cart-overlay");
}

function openWishlist() {
    renderWishlist();
    openElement("wishlist-overlay");
    openElement("wishlist-modal");
}

function closeWishlist() {
    closeElement("wishlist-modal");
    closeElement("wishlist-overlay");
}

function openCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty.", "error");
        return;
    }

    if (cartSubtotal() < CC.minimumOrder) {
        showToast(`Minimum order is ${money(CC.minimumOrder)}.`, "error");
        return;
    }

    renderCart();
    closeCart();
    openElement("checkout-overlay");
    openElement("checkout-modal");
}

function closeCheckout() {
    closeElement("checkout-modal");
    closeElement("checkout-overlay");
}

function closeInvoice() {
    closeElement("invoice-modal");
}

/* =========================================================
   9. COUPONS
========================================================= */

function updateCouponMessage(message, error = false) {
    const element = $("#coupon-message");
    if (!element) return;

    element.textContent = message;
    element.style.color = error ? "#dc2626" : "#15803d";
}

function applyCoupon() {
    const input = $("#coupon-code");
    if (!input) {
        showToast("Coupon field is unavailable.", "error");
        return;
    }

    const code = input.value.trim().toUpperCase();

    if (!code) {
        updateCouponMessage("Enter a coupon code.", true);
        return;
    }

    if (cart.length === 0) {
        updateCouponMessage("Add products to your cart first.", true);
        return;
    }

    const subtotal = cartSubtotal();

    if (code === "CRAVE10") {
        activeCoupon = { code };
        updateCouponMessage("Coupon applied! Save 10% up to ₹150.");
    } else if (code === "WELCOME50" && subtotal >= 299) {
        activeCoupon = { code };
        updateCouponMessage("Welcome offer applied! ₹50 off.");
    } else if (code === "FREESHIP" && subtotal >= 199) {
        activeCoupon = { code };
        updateCouponMessage("Free delivery coupon applied!");
    } else if (code === "WELCOME50") {
        updateCouponMessage("Add items worth ₹299 to use this coupon.", true);
        return;
    } else if (code === "FREESHIP") {
        updateCouponMessage("Minimum cart value is ₹199.", true);
        return;
    } else {
        updateCouponMessage("Invalid coupon code.", true);
        return;
    }

    writeStorage(CC.storage.coupon, activeCoupon);
    renderCart();
    showToast("Coupon applied successfully!");
}

/* =========================================================
   10. CHECKOUT AND ORDER CREATION
========================================================= */

function fieldValue(id) {
    return document.getElementById(id)?.value?.trim() || "";
}

function checkoutFormSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Your cart is empty.", "error");
        return;
    }

    const name = fieldValue("customer-name");
    const phone = fieldValue("customer-phone");
    const email = fieldValue("customer-email");
    const address = fieldValue("customer-address");
    const city = fieldValue("customer-city");
    const pincode = fieldValue("customer-pincode");

    if (!name || !phone || !address || !city || !pincode) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) {
        showToast("Please enter a valid phone number.", "error");
        return;
    }

    if (!/^\d{6}$/.test(pincode)) {
        showToast("Please enter a valid 6-digit PIN code.", "error");
        return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }

    const bill = calculateBill();

    const order = {
        id: makeId("CCORDER"),
        date: new Date().toISOString(),
        status: "Order received",
        customer: { name, phone, email, address, city, pincode },
        items: cart.map(item => {
            const product = products.find(p => String(p.id) === String(item.id));
            return {
                id: item.id,
                name: product?.name || item.name,
                price: Number(product?.price ?? item.price),
                quantity: Number(item.quantity),
                image: product?.image || item.image || ""
            };
        }),
        bill,
        paymentMethod: "Cash on Delivery",
        coupon: activeCoupon?.code || null
    };

    orders.unshift(order);
    writeStorage(CC.storage.orders, orders);
    writeStorage(CC.storage.lastOrder, order);

    lastInvoice = order;

    cart = [];
    activeCoupon = null;

    writeStorage(CC.storage.cart, cart);
    writeStorage(CC.storage.coupon, null);

    closeCheckout();
    renderCart();
    showInvoice(order);

    const form = $("#checkout-form");
    if (form) form.reset();

    showToast("Order placed successfully! 🎉");
}

/* =========================================================
   11. INVOICE GENERATION
========================================================= */

function invoiceHTML(order) {
    const itemRows = order.items.map(item => `
        <tr>
            <td>${escapeHTML(item.name)}</td>
            <td>${item.quantity}</td>
            <td>${money(item.price)}</td>
            <td>${money(item.price * item.quantity)}</td>
        </tr>
    `).join("");

    const date = new Date(order.date).toLocaleString("en-IN");

    return `
        <div class="cc-invoice-document" id="cc-invoice-document">
            <div class="cc-invoice-header">
                <div>
                    <h2 style="margin:0;color:#ff6b00;font-size:30px">CRAVECART</h2>
                    <p>Fresh food. Happy mood.</p>
                    <p>Vegetarian Food Ordering</p>
                </div>
                <div style="text-align:right">
                    <h3>INVOICE</h3>
                    <p><strong>Order ID:</strong> ${escapeHTML(order.id)}</p>
                    <p><strong>Date:</strong> ${escapeHTML(date)}</p>
                </div>
            </div>

            <hr>

            <h3>Customer details</h3>
            <p><strong>${escapeHTML(order.customer.name)}</strong></p>
            <p>${escapeHTML(order.customer.phone)}</p>
            ${order.customer.email ? `<p>${escapeHTML(order.customer.email)}</p>` : ""}
            <p>${escapeHTML(order.customer.address)}, ${escapeHTML(order.customer.city)} - ${escapeHTML(order.customer.pincode)}</p>

            <table class="cc-invoice-table" style="width:100%;border-collapse:collapse;margin-top:20px">
                <thead>
                    <tr>
                        <th style="text-align:left">Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>${itemRows}</tbody>
            </table>

            <div style="margin:22px 0 0 auto;max-width:320px">
                <p>Subtotal: <strong>${money(order.bill.subtotal)}</strong></p>
                <p>Delivery: <strong>${money(order.bill.delivery)}</strong></p>
                <p>Tax (5%): <strong>${money(order.bill.tax)}</strong></p>
                <p>Discount: <strong>−${money(order.bill.discount)}</strong></p>
                <hr>
                <h3>Grand Total: ${money(order.bill.total)}</h3>
            </div>

            <p><strong>Payment:</strong> ${escapeHTML(order.paymentMethod)}</p>
            <p><strong>Status:</strong> ${escapeHTML(order.status)}</p>
            <p style="text-align:center;margin-top:30px">Thank you for ordering with CraveCart! ❤️</p>
            <p style="text-align:center;font-size:12px">This is a demo invoice generated by the CraveCart website.</p>
        </div>
    `;
}

function showInvoice(order) {
    const content = $("#invoice-content");
    if (content) content.innerHTML = invoiceHTML(order);

    openElement("invoice-modal");
}

function printInvoice() {
    const content = $("#cc-invoice-document") || $("#invoice-content");

    if (!content) {
        showToast("Invoice not found.", "error");
        return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
        showToast("Please allow pop-ups to print the invoice.", "error");
        return;
    }

    printWindow.document.open();
    printWindow.document.write(`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>CraveCart Invoice</title>
            <style>
                body{font-family:Arial,sans-serif;padding:30px;color:#222}
                h2,h3,p{margin-top:8px;margin-bottom:8px}
                table{width:100%;border-collapse:collapse;margin-top:20px}
                th,td{padding:12px;border:1px solid #ddd;text-align:left}
                th{background:#f5f5f5}
                hr{border:0;border-top:1px solid #ddd;margin:20px 0}
                .cc-invoice-header{display:flex;justify-content:space-between;gap:20px}
                @media print{body{padding:0}}
            </style>
        </head>
        <body>${content.innerHTML}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
    }, 400);
}

function downloadInvoice() {
    const order = lastInvoice || readStorage(CC.storage.lastOrder, null);

    if (!order) {
        showToast("No invoice is available yet.", "error");
        return;
    }

    const textContent = [
        "CRAVECART - ORDER INVOICE",
        "====================================",
        `Order ID: ${order.id}`,
        `Date: ${new Date(order.date).toLocaleString("en-IN")}`,
        "",
        "CUSTOMER",
        `Name: ${order.customer.name}`,
        `Phone: ${order.customer.phone}`,
        `Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}`,
        "",
        "ITEMS",
        ...order.items.map(item =>
            `${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}`
        ),
        "",
        `Subtotal: ${money(order.bill.subtotal)}`,
        `Delivery: ${money(order.bill.delivery)}`,
        `Tax: ${money(order.bill.tax)}`,
        `Discount: ${money(order.bill.discount)}`,
        `GRAND TOTAL: ${money(order.bill.total)}`,
        "",
        `Payment: ${order.paymentMethod}`,
        `Status: ${order.status}`,
        "",
        "Thank you for ordering with CraveCart!"
    ].join("\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `CraveCart-Invoice-${order.id}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

/* =========================================================
   12. SEARCH AND SORT
========================================================= */

function handleSearch(value) {
    searchTerm = String(value || "").trim();
    renderProducts();

    const panel = $("#search-panel");
    if (panel) panel.hidden = !searchTerm;
}

function clearSearch() {
    searchTerm = "";

    const input = $("#product-search");
    if (input) input.value = "";

    const panel = $("#search-panel");
    if (panel) panel.hidden = true;

    renderProducts();
}

function setupSearch() {
    const input = $("#product-search");

    if (input) {
        input.addEventListener("input", event => handleSearch(event.target.value));
    }

    const clear = $("#clear-search");
    if (clear) clear.addEventListener("click", clearSearch);

    const toggle = $("#search-toggle");
    if (toggle) {
        toggle.addEventListener("click", () => {
            const panel = $("#search-panel");
            if (!panel) return;

            panel.hidden = !panel.hidden;

            if (!panel.hidden) {
                setTimeout(() => input?.focus(), 50);
            }
        });
    }

    const sort = $("#sort-products");
    if (sort) sort.addEventListener("change", renderProducts);

    const reset = $("#reset-filters");
    if (reset) {
        reset.addEventListener("click", () => {
            activeCategory = "All";
            clearSearch();
            if (sort) sort.value = "featured";
            renderCategories();
            renderProducts();
        });
    }

    const showAll = $("#show-all-products");
    if (showAll) {
        showAll.addEventListener("click", () => {
            activeCategory = "All";
            clearSearch();
            renderCategories();
            renderProducts();
        });
    }
}

/* =========================================================
   13. NEWSLETTER DEMO
========================================================= */

function setupNewsletter() {
    const form = $("#newsletter-form");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const emailInput = $("input[type='email']", form);
        const email = emailInput?.value.trim() || "";

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        const subscribers = readStorage("cravecart_newsletter", []);
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            writeStorage("cravecart_newsletter", subscribers);
        }

        form.reset();
        showToast("Thanks for subscribing! 🎉");
    });
}

/* =========================================================
   14. HEADER, SCROLL AND ANIMATIONS
========================================================= */

function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
}

function setupGeneralUI() {
    setText("#current-year", new Date().getFullYear());

    const backToTop = $("#back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.hidden = window.scrollY < 400;
        }, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    $$("[data-scroll-to]").forEach(button => {
        button.addEventListener("click", () => {
            const target = document.querySelector(button.dataset.scrollTo);
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const navToggle = $("#nav-toggle");
    const navMenu = $("#nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            navToggle.setAttribute(
                "aria-expanded",
                navMenu.classList.contains("active") ? "true" : "false"
            );
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("cc-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        $$(".reveal, .animate-on-scroll, .product-card").forEach(element => {
            element.classList.add("cc-reveal");
            observer.observe(element);
        });

        if (!$("#cc-reveal-style")) {
            const style = document.createElement("style");
            style.id = "cc-reveal-style";
            style.textContent = `
                .cc-reveal{opacity:0;transform:translateY(18px);transition:opacity .5s ease,transform .5s ease}
                .cc-reveal.cc-visible{opacity:1;transform:translateY(0)}
                @media(prefers-reduced-motion:reduce){.cc-reveal{opacity:1;transform:none;transition:none}}
            `;
            document.head.appendChild(style);
        }
    }
}

/* =========================================================
   15. ADMIN SUPPORT
   NOTE: This is only a front-end demo. No secure authentication.
========================================================= */

function adminAddProduct(productData) {
    const product = {
        id: makeId("PRODUCT"),
        name: String(productData.name || "").trim(),
        category: String(productData.category || "Indian").trim(),
        price: Number(productData.price),
        oldPrice: Number(productData.oldPrice || productData.price),
        rating: Number(productData.rating || 4.5),
        description: String(productData.description || "Freshly prepared vegetarian food."),
        image: String(productData.image || getImage(productData.name, productData.category)),
        badge: String(productData.badge || "New"),
        veg: true
    };

    if (!product.name || !Number.isFinite(product.price) || product.price <= 0) {
        showToast("Enter a valid product name and price.", "error");
        return false;
    }

    products.unshift(product);
    writeStorage(CC.storage.products, products);

    renderCategories();
    renderProducts();
    showToast("New product added!");
    return product;
}

function adminDeleteProduct(id) {
    products = products.filter(product => String(product.id) !== String(id));
    cart = cart.filter(item => String(item.id) !== String(id));
    wishlist = wishlist.filter(item => String(item) !== String(id));

    writeStorage(CC.storage.products, products);
    writeStorage(CC.storage.cart, cart);
    writeStorage(CC.storage.wishlist, wishlist);

    renderCategories();
    renderProducts();
    renderCart();
    renderWishlist();

    showToast("Product deleted.");
}

function adminExportOrdersCSV() {
    if (!orders.length) {
        showToast("No orders available to export.", "error");
        return;
    }

    const rows = [
        ["Order ID", "Date", "Customer", "Phone", "Items", "Total", "Status"],
        ...orders.map(order => [
            order.id,
            new Date(order.date).toLocaleString("en-IN"),
            order.customer?.name || "",
            order.customer?.phone || "",
            order.items.map(item => `${item.name} x${item.quantity}`).join("; "),
            order.bill?.total ?? 0,
            order.status || ""
        ])
    ];

    const csv = rows.map(row =>
        row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CraveCart-Orders.csv";
    link.click();

    URL.revokeObjectURL(url);
}

function setupAdminForms() {
    const form = $("#admin-product-form");
    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const data = {
                name: fieldValue("admin-product-name"),
                category: fieldValue("admin-product-category"),
                price: fieldValue("admin-product-price"),
                oldPrice: fieldValue("admin-product-old-price"),
                image: fieldValue("admin-product-image"),
                description: fieldValue("admin-product-description"),
                badge: fieldValue("admin-product-badge")
            };

            const result = adminAddProduct(data);
            if (result) form.reset();
        });
    }

    const exportButton = $("#admin-export-orders");
    if (exportButton) exportButton.addEventListener("click", adminExportOrdersCSV);
}

/* =========================================================
   16. GLOBAL CLICK HANDLER
========================================================= */

document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    switch (action) {
        case "add-cart":
            addToCart(id);
            break;

        case "toggle-favourite":
            toggleFavourite(id);
            break;

        case "quantity":
            updateQuantity(id, Number(button.dataset.change || 0));
            break;

        case "remove-cart":
            removeFromCart(id);
            break;

        case "category":
            setCategory(button.dataset.category);
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
            openCheckout();
            break;

        case "close-checkout":
            closeCheckout();
            break;

        case "close-invoice":
            closeInvoice();
            break;

        case "print-invoice":
            printInvoice();
            break;

        case "download-invoice":
            downloadInvoice();
            break;

        case "apply-coupon":
            applyCoupon();
            break;

        case "delete-product":
            adminDeleteProduct(id);
            break;
    }
});

/* =========================================================
   17. OVERLAY, ESCAPE AND FORM LISTENERS
========================================================= */

function setupModalEvents() {
    const cartOverlay = $("#cart-overlay");
    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }

    const wishlistOverlay = $("#wishlist-overlay");
    if (wishlistOverlay) {
        wishlistOverlay.addEventListener("click", closeWishlist);
    }

    const checkoutOverlay = $("#checkout-overlay");
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener("click", closeCheckout);
    }

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        closeCart();
        closeWishlist();
        closeCheckout();
        closeInvoice();
    });

    const form = $("#checkout-form");
    if (form) form.addEventListener("submit", checkoutFormSubmit);

    const couponButton = $(".apply-coupon");
    if (couponButton && !couponButton.dataset.action) {
        couponButton.addEventListener("click", applyCoupon);
    }
}

/* =========================================================
   18. OPTIONAL GLOBAL HELPERS
========================================================= */

window.CraveCart = {
    getProducts: () => [...products],
    getCart: () => [...cart],
    getWishlist: () => [...wishlist],
    getOrders: () => [...orders],
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleFavourite,
    renderProducts,
    renderCart,
    renderWishlist,
    adminAddProduct,
    adminDeleteProduct,
    adminExportOrdersCSV,
    openCart,
    openWishlist,
    openCheckout,
    showToast
};

/* =========================================================
   19. INITIALISE WEBSITE
========================================================= */

function initCraveCart() {
    renderCategories();
    renderProducts();
    renderCart();
    renderWishlist();
    updateWishlistCount();

    setupSearch();
    setupNewsletter();
    setupGeneralUI();
    setupModalEvents();
    setupAdminForms();

    if (activeCoupon) {
        updateCouponMessage(`Coupon ${activeCoupon.code} is active.`);
    }

    console.log(
        `%c CRAVECART PREMIUM `,
        "background:#ff6b00;color:#fff;padding:8px;font-weight:bold"
    );
    console.log("Products:", products.length);
    console.log("Cart items:", cart.length);
    console.log("CraveCart JavaScript initialised successfully.");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCraveCart);
} else {
    initCraveCart();
}
```
