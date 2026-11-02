```javascript
/* =========================================================
   CRAVECART PREMIUM — app.js
   Features:
   - Food product catalog with photos
   - Search and category filters
   - Sorting
   - Cart and quantity controls
   - Wishlist
   - Coupon codes
   - Checkout form
   - Bill / invoice generation
   - Print or save invoice as PDF
   - LocalStorage persistence
   ========================================================= */

"use strict";

/* =========================================================
   1. CONFIGURATION
========================================================= */

const CONFIG = {
  storeName: "CraveCart",
  currency: "INR",
  locale: "en-IN",

  deliveryFee: 35,
  freeDeliveryMinimum: 499,

  // Illustrative demo tax. Change according to your actual tax setup.
  demoTaxRate: 0.05,

  storage: {
    cart: "cravecart_cart",
    wishlist: "cravecart_wishlist",
    orders: "cravecart_orders",
    customer: "cravecart_customer",
    coupon: "cravecart_coupon"
  }
};

/* =========================================================
   2. HELPERS
========================================================= */

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

function safeRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read storage:", key);
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Could not save storage:", key);
    showToast("Browser storage unavailable. Changes may not persist.");
    return false;
  }
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

function money(amount) {
  return new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.currency,
    maximumFractionDigits: 2
  }).format(Number(amount) || 0);
}

function makeId(prefix = "CC") {
  return (
    prefix +
    "-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase()
  );
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function saveCart() {
  safeWrite(CONFIG.storage.cart, state.cart);
}

function saveWishlist() {
  safeWrite(CONFIG.storage.wishlist, state.wishlist);
}

function saveOrders() {
  safeWrite(CONFIG.storage.orders, state.orders);
}

function findProduct(id) {
  return PRODUCTS.find(product => product.id === String(id));
}

/* =========================================================
   3. PRODUCT CATALOG
   All products are vegetarian.
   Photo links are external and require internet access.
========================================================= */

const PRODUCTS = [
  {
    id: "veg-burger",
    name: "Classic Veg Burger",
    category: "Burgers",
    price: 129,
    oldPrice: 159,
    rating: 4.7,
    reviews: 218,
    badge: "BESTSELLER",
    emoji: "🍔",
    description: "Crispy veg patty, fresh lettuce and creamy sauce.",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=85",
    featured: true
  },
  {
    id: "cheese-burger",
    name: "Double Cheese Burger",
    category: "Burgers",
    price: 189,
    oldPrice: 219,
    rating: 4.8,
    reviews: 172,
    badge: "POPULAR",
    emoji: "🍔",
    description: "A delicious double-layer cheese and veg patty burger.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "paneer-burger",
    name: "Spicy Paneer Burger",
    category: "Burgers",
    price: 169,
    oldPrice: 199,
    rating: 4.6,
    reviews: 146,
    badge: "SPICY",
    emoji: "🍔",
    description: "Spiced paneer patty with crunchy vegetables.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "vegan-burger",
    name: "Garden Fresh Burger",
    category: "Burgers",
    price: 149,
    oldPrice: 179,
    rating: 4.5,
    reviews: 95,
    badge: "FRESH",
    emoji: "🥬",
    description: "Fresh greens, tomato and a hearty plant-based patty.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "classic-pizza",
    name: "Classic Margherita",
    category: "Pizza",
    price: 199,
    oldPrice: 249,
    rating: 4.8,
    reviews: 304,
    badge: "BESTSELLER",
    emoji: "🍕",
    description: "Classic tomato sauce, mozzarella and basil.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=85",
    featured: true
  },
  {
    id: "farmhouse-pizza",
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 279,
    oldPrice: 319,
    rating: 4.7,
    reviews: 189,
    badge: "POPULAR",
    emoji: "🍕",
    description: "Loaded with capsicum, onion, tomato and cheese.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "cheese-pizza",
    name: "Four Cheese Pizza",
    category: "Pizza",
    price: 329,
    oldPrice: 379,
    rating: 4.9,
    reviews: 167,
    badge: "PREMIUM",
    emoji: "🧀",
    description: "Rich, cheesy pizza with a golden crust.",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "corn-pizza",
    name: "Sweet Corn Pizza",
    category: "Pizza",
    price: 229,
    oldPrice: 269,
    rating: 4.5,
    reviews: 83,
    badge: "FAVOURITE",
    emoji: "🍕",
    description: "Sweet corn, mozzarella and Italian herbs.",
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "paneer-pizza",
    name: "Paneer Tikka Pizza",
    category: "Pizza",
    price: 299,
    oldPrice: 349,
    rating: 4.7,
    reviews: 128,
    badge: "SPICY",
    emoji: "🍕",
    description: "Tandoori paneer, onions and smoky sauce.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "white-pasta",
    name: "Creamy White Pasta",
    category: "Pasta",
    price: 219,
    oldPrice: 259,
    rating: 4.7,
    reviews: 138,
    badge: "POPULAR",
    emoji: "🍝",
    description: "Creamy white sauce pasta with herbs.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "red-pasta",
    name: "Arrabbiata Pasta",
    category: "Pasta",
    price: 199,
    oldPrice: 239,
    rating: 4.6,
    reviews: 107,
    badge: "SPICY",
    emoji: "🍝",
    description: "Penne pasta in a rich tomato chilli sauce.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "alfredo-pasta",
    name: "Alfredo Mushroom Pasta",
    category: "Pasta",
    price: 259,
    oldPrice: 299,
    rating: 4.8,
    reviews: 119,
    badge: "CHEF'S PICK",
    emoji: "🍝",
    description: "Mushrooms, cream sauce and parmesan-style cheese.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "pink-pasta",
    name: "Pink Sauce Pasta",
    category: "Pasta",
    price: 239,
    oldPrice: 279,
    rating: 4.6,
    reviews: 89,
    badge: "POPULAR",
    emoji: "🍝",
    description: "A balanced blend of tomato and creamy sauce.",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veg-momos",
    name: "Steamed Veg Momos",
    category: "Momos",
    price: 99,
    oldPrice: 129,
    rating: 4.6,
    reviews: 205,
    badge: "BESTSELLER",
    emoji: "🥟",
    description: "Soft steamed dumplings with vegetable filling.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "fried-momos",
    name: "Crispy Fried Momos",
    category: "Momos",
    price: 119,
    oldPrice: 149,
    rating: 4.5,
    reviews: 143,
    badge: "CRISPY",
    emoji: "🥟",
    description: "Golden fried momos served with spicy dip.",
    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "tandoori-momos",
    name: "Tandoori Momos",
    category: "Momos",
    price: 149,
    oldPrice: 179,
    rating: 4.8,
    reviews: 164,
    badge: "HOT",
    emoji: "🥟",
    description: "Smoky tandoori-style dumplings with mint chutney.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veg-sandwich",
    name: "Garden Veg Sandwich",
    category: "Sandwiches",
    price: 109,
    oldPrice: 139,
    rating: 4.4,
    reviews: 72,
    badge: "FRESH",
    emoji: "🥪",
    description: "Fresh vegetables, cheese and herb spread.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "cheese-sandwich",
    name: "Grilled Cheese Sandwich",
    category: "Sandwiches",
    price: 139,
    oldPrice: 169,
    rating: 4.7,
    reviews: 112,
    badge: "POPULAR",
    emoji: "🥪",
    description: "Grilled bread filled with melted cheese.",
    image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "paneer-sandwich",
    name: "Paneer Tikka Sandwich",
    category: "Sandwiches",
    price: 159,
    oldPrice: 189,
    rating: 4.6,
    reviews: 86,
    badge: "SPICY",
    emoji: "🥪",
    description: "Smoky paneer tikka with onions and peppers.",
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "french-fries",
    name: "Classic French Fries",
    category: "Sides",
    price: 89,
    oldPrice: 109,
    rating: 4.5,
    reviews: 192,
    badge: "CRISPY",
    emoji: "🍟",
    description: "Golden fries with a pinch of seasoning.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "peri-fries",
    name: "Peri Peri Fries",
    category: "Sides",
    price: 109,
    oldPrice: 129,
    rating: 4.6,
    reviews: 156,
    badge: "SPICY",
    emoji: "🍟",
    description: "Crispy fries tossed in peri peri seasoning.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "cheese-balls",
    name: "Cheese Balls",
    category: "Sides",
    price: 119,
    oldPrice: 149,
    rating: 4.5,
    reviews: 91,
    badge: "CHEESY",
    emoji: "🧀",
    description: "Crunchy bites with a molten cheese centre.",
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "garlic-bread",
    name: "Cheesy Garlic Bread",
    category: "Sides",
    price: 129,
    oldPrice: 159,
    rating: 4.7,
    reviews: 127,
    badge: "POPULAR",
    emoji: "🥖",
    description: "Toasted garlic bread topped with cheese.",
    image: "https://images.unsplash.com/photo-1619531040576-f9416740661f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "choco-brownie",
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 99,
    oldPrice: 129,
    rating: 4.8,
    reviews: 173,
    badge: "SWEET PICK",
    emoji: "🍫",
    description: "Rich chocolate brownie for dessert lovers.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "cheesecake",
    name: "Classic Cheesecake",
    category: "Desserts",
    price: 169,
    oldPrice: 199,
    rating: 4.7,
    reviews: 98,
    badge: "PREMIUM",
    emoji: "🍰",
    description: "Creamy cheesecake with a buttery base.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "choco-cake",
    name: "Chocolate Cake Slice",
    category: "Desserts",
    price: 139,
    oldPrice: 169,
    rating: 4.6,
    reviews: 84,
    badge: "CHOCOLATE",
    emoji: "🍰",
    description: "Chocolate sponge layered with rich frosting.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "ice-cream",
    name: "Vanilla Ice Cream",
    category: "Desserts",
    price: 79,
    oldPrice: 99,
    rating: 4.5,
    reviews: 71,
    badge: "CLASSIC",
    emoji: "🍨",
    description: "Smooth vanilla ice cream.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "choco-shake",
    name: "Chocolate Shake",
    category: "Drinks",
    price: 129,
    oldPrice: 159,
    rating: 4.7,
    reviews: 142,
    badge: "POPULAR",
    emoji: "🥤",
    description: "Creamy chocolate milkshake.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "strawberry-shake",
    name: "Strawberry Shake",
    category: "Drinks",
    price: 139,
    oldPrice: 169,
    rating: 4.6,
    reviews: 92,
    badge: "FRESH",
    emoji: "🍓",
    description: "Sweet strawberry shake with a creamy finish.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "cold-coffee",
    name: "Classic Cold Coffee",
    category: "Drinks",
    price: 119,
    oldPrice: 149,
    rating: 4.6,
    reviews: 131,
    badge: "CHILLED",
    emoji: "☕",
    description: "Chilled coffee blended until frothy.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "lemonade",
    name: "Fresh Lemonade",
    category: "Drinks",
    price: 69,
    oldPrice: 89,
    rating: 4.4,
    reviews: 65,
    badge: "REFRESHING",
    emoji: "🍋",
    description: "Refreshing lemon drink served chilled.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "paneer-wrap",
    name: "Paneer Tikka Wrap",
    category: "Wraps",
    price: 159,
    oldPrice: 189,
    rating: 4.7,
    reviews: 103,
    badge: "POPULAR",
    emoji: "🌯",
    description: "Tandoori paneer wrapped with fresh vegetables.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "falafel-wrap",
    name: "Falafel Wrap",
    category: "Wraps",
    price: 149,
    oldPrice: 179,
    rating: 4.5,
    reviews: 76,
    badge: "VEGGIE",
    emoji: "🌯",
    description: "Falafel, crunchy greens and a creamy dressing.",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veg-burrito",
    name: "Veggie Burrito",
    category: "Wraps",
    price: 179,
    oldPrice: 219,
    rating: 4.6,
    reviews: 88,
    badge: "FILLING",
    emoji: "🌯",
    description: "Rice, beans and vegetables in a soft tortilla.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veg-biryani",
    name: "Hyderabadi Veg Biryani",
    category: "Indian",
    price: 199,
    oldPrice: 239,
    rating: 4.8,
    reviews: 216,
    badge: "BESTSELLER",
    emoji: "🍛",
    description: "Aromatic basmati rice with vegetables and spices.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    category: "Indian",
    price: 229,
    oldPrice: 269,
    rating: 4.7,
    reviews: 137,
    badge: "TANDOORI",
    emoji: "🍢",
    description: "Marinated paneer with a smoky grilled finish.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    category: "Indian",
    price: 189,
    oldPrice: 219,
    rating: 4.7,
    reviews: 121,
    badge: "CLASSIC",
    emoji: "🍲",
    description: "Slow-cooked black lentils in a creamy sauce.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    category: "Indian",
    price: 159,
    oldPrice: 189,
    rating: 4.6,
    reviews: 164,
    badge: "FAVOURITE",
    emoji: "🍛",
    description: "Spiced chickpeas with fluffy fried bhature.",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    category: "Indian",
    price: 119,
    oldPrice: 149,
    rating: 4.7,
    reviews: 176,
    badge: "SOUTH INDIAN",
    emoji: "🥞",
    description: "Crispy dosa with potato masala and chutney.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veg-thali",
    name: "Premium Veg Thali",
    category: "Indian",
    price: 249,
    oldPrice: 299,
    rating: 4.8,
    reviews: 201,
    badge: "FULL MEAL",
    emoji: "🍱",
    description: "A hearty selection of vegetarian Indian dishes.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "hakka-noodles",
    name: "Veg Hakka Noodles",
    category: "Chinese",
    price: 149,
    oldPrice: 179,
    rating: 4.5,
    reviews: 109,
    badge: "POPULAR",
    emoji: "🍜",
    description: "Stir-fried noodles with crunchy vegetables.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veg-fried-rice",
    name: "Veg Fried Rice",
    category: "Chinese",
    price: 139,
    oldPrice: 169,
    rating: 4.5,
    reviews: 96,
    badge: "CLASSIC",
    emoji: "🍚",
    description: "Wok-tossed rice with vegetables and herbs.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "spring-rolls",
    name: "Veg Spring Rolls",
    category: "Chinese",
    price: 119,
    oldPrice: 149,
    rating: 4.4,
    reviews: 82,
    badge: "CRISPY",
    emoji: "🥢",
    description: "Crispy vegetable rolls with dipping sauce.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "chilli-paneer",
    name: "Chilli Paneer",
    category: "Chinese",
    price: 199,
    oldPrice: 239,
    rating: 4.7,
    reviews: 118,
    badge: "SPICY",
    emoji: "🌶️",
    description: "Paneer tossed in a spicy Indo-Chinese sauce.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "mojito",
    name: "Mint Mojito",
    category: "Drinks",
    price: 89,
    oldPrice: 109,
    rating: 4.5,
    reviews: 69,
    badge: "REFRESHING",
    emoji: "🍹",
    description: "Cool mint and lime drink.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "mango-shake",
    name: "Mango Shake",
    category: "Drinks",
    price: 129,
    oldPrice: 159,
    rating: 4.7,
    reviews: 103,
    badge: "SEASONAL",
    emoji: "🥭",
    description: "A rich mango drink with a creamy texture.",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "oreo-shake",
    name: "Cookie Cream Shake",
    category: "Drinks",
    price: 149,
    oldPrice: 179,
    rating: 4.8,
    reviews: 133,
    badge: "INDULGENT",
    emoji: "🥤",
    description: "Creamy cookie and chocolate shake.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "chocolate-waffle",
    name: "Chocolate Waffle",
    category: "Desserts",
    price: 159,
    oldPrice: 189,
    rating: 4.6,
    reviews: 87,
    badge: "SWEET PICK",
    emoji: "🧇",
    description: "Golden waffle finished with chocolate sauce.",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "pancakes",
    name: "Classic Pancakes",
    category: "Desserts",
    price: 169,
    oldPrice: 199,
    rating: 4.5,
    reviews: 79,
    badge: "BRUNCH",
    emoji: "🥞",
    description: "Fluffy pancakes with sweet toppings.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "loaded-nachos",
    name: "Loaded Veg Nachos",
    category: "Sides",
    price: 149,
    oldPrice: 179,
    rating: 4.5,
    reviews: 74,
    badge: "SHAREABLE",
    emoji: "🌮",
    description: "Crunchy nachos with salsa and cheese.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "cheese-quesadilla",
    name: "Cheese Quesadilla",
    category: "Wraps",
    price: 179,
    oldPrice: 219,
    rating: 4.6,
    reviews: 85,
    badge: "CHEESY",
    emoji: "🫓",
    description: "Toasted tortilla filled with vegetables and cheese.",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "veggie-tacos",
    name: "Veggie Tacos",
    category: "Wraps",
    price: 169,
    oldPrice: 199,
    rating: 4.5,
    reviews: 73,
    badge: "MEXICAN",
    emoji: "🌮",
    description: "Tacos filled with vegetables and fresh salsa.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "tomato-soup",
    name: "Creamy Tomato Soup",
    category: "Sides",
    price: 89,
    oldPrice: 109,
    rating: 4.4,
    reviews: 62,
    badge: "COMFORT",
    emoji: "🍲",
    description: "Warm tomato soup with a smooth finish.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "garden-salad",
    name: "Garden Fresh Salad",
    category: "Sides",
    price: 119,
    oldPrice: 149,
    rating: 4.3,
    reviews: 57,
    badge: "FRESH",
    emoji: "🥗",
    description: "Fresh seasonal vegetables with a light dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "caprese-salad",
    name: "Tomato Mozzarella Salad",
    category: "Sides",
    price: 169,
    oldPrice: 199,
    rating: 4.5,
    reviews: 65,
    badge: "LIGHT",
    emoji: "🥗",
    description: "Tomato, mozzarella and fragrant basil.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "choco-cookie",
    name: "Chocolate Cookies",
    category: "Desserts",
    price: 69,
    oldPrice: 89,
    rating: 4.4,
    reviews: 91,
    badge: "SNACK",
    emoji: "🍪",
    description: "Crunchy cookies with chocolate chips.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "fruit-bowl",
    name: "Fresh Fruit Bowl",
    category: "Desserts",
    price: 109,
    oldPrice: 139,
    rating: 4.5,
    reviews: 48,
    badge: "FRESH",
    emoji: "🍓",
    description: "A colourful selection of fresh fruit.",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    category: "Drinks",
    price: 129,
    oldPrice: 159,
    rating: 4.6,
    reviews: 87,
    badge: "COFFEE",
    emoji: "🧋",
    description: "Espresso with chilled milk over ice.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "masala-chaas",
    name: "Masala Chaas",
    category: "Drinks",
    price: 59,
    oldPrice: 79,
    rating: 4.4,
    reviews: 53,
    badge: "REFRESHING",
    emoji: "🥛",
    description: "Traditional spiced buttermilk.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85"
  }
];

/* =========================================================
   4. APP STATE
========================================================= */

const state = {
  cart: safeRead(CONFIG.storage.cart, []),
  wishlist: safeRead(CONFIG.storage.wishlist, []),
  orders: safeRead(CONFIG.storage.orders, []),
  customer: safeRead(CONFIG.storage.customer, {}),
  coupon: safeRead(CONFIG.storage.coupon, null),

  activeCategory: "All",
  search: "",
  sort: "featured",

  lastOrder: null
};

if (!Array.isArray(state.cart)) state.cart = [];
if (!Array.isArray(state.wishlist)) state.wishlist = [];
if (!Array.isArray(state.orders)) state.orders = [];

/* =========================================================
   5. PRODUCT IMAGE FALLBACK
========================================================= */

function imageFallback(emoji = "🍽️") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">
      <rect width="100%" height="100%" fill="#191919"/>
      <text x="50%" y="50%" dominant-baseline="middle"
        text-anchor="middle" font-size="100">${emoji}</text>
    </svg>
  `;

  return "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(svg);
}

function attachImageFallbacks(root = document) {
  $$("img[data-fallback]", root).forEach(img => {
    img.addEventListener("error", () => {
      img.src = imageFallback(img.dataset.fallback);
    }, { once: true });
  });
}

/* =========================================================
   6. TOAST NOTIFICATIONS
========================================================= */

let toastTimer;

function showToast(message, type = "success") {
  let toast = $("#toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* =========================================================
   7. CATEGORY RENDERING
========================================================= */

function getCategories() {
  return [
    "All",
    ...new Set(PRODUCTS.map(product => product.category))
  ];
}

function renderCategories() {
  const container = $("#category-list");

  if (!container) return;

  container.innerHTML = getCategories().map(category => `
    <button
      type="button"
      class="category-btn ${
        state.activeCategory === category ? "active" : ""
      }"
      data-category="${escapeHTML(category)}"
    >
      ${category === "All" ? "🍽️" : "✦"}
      ${escapeHTML(category)}
    </button>
  `).join("");
}

/* =========================================================
   8. PRODUCT CARD
========================================================= */

function productCard(product, index = 0) {
  const wished = state.wishlist.includes(product.id);

  const image = escapeHTML(product.image);
  const emoji = escapeHTML(product.emoji || "🍽️");

  const discount = product.oldPrice > product.price
    ? Math.round(
        (1 - product.price / product.oldPrice) * 100
      )
    : 0;

  return `
    <article
      class="product-card"
      data-product-id="${escapeHTML(product.id)}"
      style="animation-delay:${Math.min(index * 35, 350)}ms"
    >
      <div class="product-image product-image-wrap">
        <img
          src="${image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          data-fallback="${emoji}"
        >

        ${
          product.badge
            ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
            : ""
        }

        <button
          type="button"
          class="wishlist-btn ${wished ? "active" : ""}"
          data-action="wishlist"
          data-id="${escapeHTML(product.id)}"
          aria-label="${wished ? "Remove from" : "Add to"} wishlist"
          aria-pressed="${wished}"
        >
          ${wished ? "♥" : "♡"}
        </button>
      </div>

      <div class="product-info product-details">
        <span class="product-category">
          ${escapeHTML(product.category)}
        </span>

        <h3>${escapeHTML(product.name)}</h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-rating rating">
          <span>★ ${Number(product.rating).toFixed(1)}</span>
          <span>(${Number(product.reviews) || 0} reviews)</span>
        </div>

        <div class="product-bottom">
          <div>
            <span class="product-price">
              ${money(product.price)}
            </span>

            ${
              product.oldPrice > product.price
                ? `<span class="old-price">${money(product.oldPrice)}</span>`
                : ""
            }

            ${
              discount
                ? `<div class="product-category">${discount}% OFF</div>`
                : ""
            }
          </div>

          <button
            type="button"
            class="add-to-cart"
            data-action="add"
            data-id="${escapeHTML(product.id)}"
          >
            <span>＋</span> Add
          </button>
        </div>
      </div>
    </article>
  `;
}

/* =========================================================
   9. SEARCH, CATEGORY AND SORT
========================================================= */

function getFilteredProducts() {
  let products = [...PRODUCTS];

  if (state.activeCategory !== "All") {
    products = products.filter(product =>
      product.category === state.activeCategory
    );
  }

  if (state.search.trim()) {
    const query = state.search.toLowerCase().trim();

    products = products.filter(product => {
      const searchable = [
        product.name,
        product.category,
        product.description,
        product.badge
      ].join(" ").toLowerCase();

      return searchable.includes(query);
    });
  }

  switch (state.sort) {
    case "price-low":
      products.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      products.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;

    case "name":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "featured":
    default:
      products.sort((a, b) =>
        Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      );
      break;
  }

  return products;
}

function renderProducts() {
  const grid = $("#products-grid");

  if (!grid) return;

  const products = getFilteredProducts();

  if (!products.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No food found 😕</h3>
        <p>Try a different search or category.</p>
        <button class="btn btn-primary" data-action="reset-filters">
          Show All Food
        </button>
      </div>
    `;

    return;
  }

  grid.innerHTML = products
    .map((product, index) => productCard(product, index))
    .join("");

  attachImageFallbacks(grid);
}

/* =========================================================
   10. CART HELPERS
========================================================= */

function getCartItems() {
  return state.cart
    .map(item => {
      const product = findProduct(item.id);

      if (!product) return null;

      const quantity = Math.max(
        1,
        Math.min(99, Number(item.quantity) || 1)
      );

      return {
        ...product,
        quantity,
        lineTotal: product.price * quantity
      };
    })
    .filter(Boolean);
}

function getCartCount() {
  return getCartItems().reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

function getSubtotal() {
  return getCartItems().reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );
}

function getCouponDiscount(subtotal) {
  if (!state.coupon) return 0;

  if (
    state.coupon.code === "CRAVE10" &&
    subtotal >= 299
  ) {
    return Math.min(subtotal * 0.1, 150);
  }

  if (
    state.coupon.code === "WELCOME50" &&
    subtotal >= 399
  ) {
    return 50;
  }

  return 0;
}

function getTotals() {
  const subtotal = getSubtotal();

  const discount = Math.min(
    subtotal,
    getCouponDiscount(subtotal)
  );

  const delivery = subtotal === 0
    ? 0
    : subtotal >= CONFIG.freeDeliveryMinimum
      ? 0
      : CONFIG.deliveryFee;

  // Illustrative demo tax only. Confirm applicable tax rules
  // before using these figures in a real business.
  const taxableAmount = Math.max(0, subtotal - discount);
  const demoTax = taxableAmount * CONFIG.demoTaxRate;

  const total = Math.max(
    0,
    taxableAmount + delivery + demoTax
  );

  return {
    subtotal,
    discount,
    delivery,
    demoTax,
    total
  };
}

/* =========================================================
   11. CART ACTIONS
========================================================= */

function addToCart(id) {
  const product = findProduct(id);

  if (!product) {
    showToast("Product not found.", "error");
    return;
  }

  const existing = state.cart.find(item => item.id === id);

  if (existing) {
    if (existing.quantity >= 99) {
      showToast("Maximum quantity reached.", "error");
      return;
    }

    existing.quantity += 1;
  } else {
    state.cart.push({
      id,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  showToast(`${product.name} added to cart!`);
}

function changeQuantity(id, delta) {
  const item = state.cart.find(entry => entry.id === id);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter(entry => entry.id !== id);
  } else if (item.quantity > 99) {
    item.quantity = 99;
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);

  saveCart();
  renderCart();

  showToast("Item removed from cart.");
}

function clearCart() {
  state.cart = [];
  state.coupon = null;

  saveCart();
  safeWrite(CONFIG.storage.coupon, null);

  renderCart();
}

/* =========================================================
   12. CART RENDERING
========================================================= */

function renderCart() {
  const items = getCartItems();
  const totals = getTotals();

  const count = getCartCount();

  $$(".cart-count, .cart-badge, [data-cart-count]").forEach(element => {
    element.textContent = count;
    element.hidden = count === 0;
  });

  const cartContainer = $("#cart-items");

  if (cartContainer) {
    if (!items.length) {
      cartContainer.innerHTML = `
        <div class="empty-cart">
          <div style="font-size:48px">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add something delicious to get started.</p>
          <button class="btn btn-primary" data-action="continue-shopping">
            Explore Menu
          </button>
        </div>
      `;
    } else {
      cartContainer.innerHTML = items.map(item => `
        <div class="cart-item">
          <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.name)}"
            loading="lazy"
            data-fallback="${escapeHTML(item.emoji)}"
          >

          <div>
            <h4>${escapeHTML(item.name)}</h4>
            <p>${money(item.price)}</p>

            <div class="quantity-control qty-control">
              <button
                type="button"
                data-action="decrease"
                data-id="${escapeHTML(item.id)}"
                aria-label="Decrease quantity"
              >−</button>

              <span>${item.quantity}</span>

              <button
                type="button"
                data-action="increase"
                data-id="${escapeHTML(item.id)}"
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>

          <div>
            <strong>${money(item.lineTotal)}</strong>

            <button
              type="button"
              class="cart-item-remove"
              data-action="remove"
              data-id="${escapeHTML(item.id)}"
              aria-label="Remove ${escapeHTML(item.name)}"
            >✕</button>
          </div>
        </div>
      `).join("");

      attachImageFallbacks(cartContainer);
    }
  }

  setText(["#cart-subtotal", "[data-cart-subtotal]"], money(totals.subtotal));
  setText(["#cart-discount", "[data-cart-discount]"], `− ${money(totals.discount)}`);
  setText(["#cart-delivery", "[data-cart-delivery]"], money(totals.delivery));
  setText(["#cart-tax", "[data-cart-tax]"], money(totals.demoTax));
  setText(["#cart-total", "[data-cart-total]"], money(totals.total));

  setText(["#cart-count"], String(count));

  const taxNote = $("#tax-note");

  if (taxNote) {
    taxNote.textContent =
      "Illustrative demo tax only; final tax treatment must be verified.";
  }

  const couponMessage = $("#coupon-message");

  if (couponMessage) {
    couponMessage.textContent = state.coupon
      ? `Coupon ${state.coupon.code} applied.`
      : "";

    couponMessage.className = state.coupon
      ? "coupon-message success"
      : "coupon-message";
  }
}

function setText(selectors, value) {
  selectors.forEach(selector => {
    $$(selector).forEach(element => {
      element.textContent = value;
    });
  });
}

/* =========================================================
   13. WISHLIST
========================================================= */

function toggleWishlist(id) {
  const product = findProduct(id);

  if (!product) return;

  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(item => item !== id);
    showToast("Removed from wishlist.");
  } else {
    state.wishlist.push(id);
    showToast("Added to wishlist!");
  }

  saveWishlist();

  renderProducts();
  renderWishlist();
}

function renderWishlist() {
  $$(".wishlist-count, [data-wishlist-count]").forEach(element => {
    element.textContent = state.wishlist.length;
    element.hidden = state.wishlist.length === 0;
  });

  const container = $("#wishlist-items");

  if (!container) return;

  const products = state.wishlist
    .map(findProduct)
    .filter(Boolean);

  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Your wishlist is empty</h3>
        <p>Save your favourite food here.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = products
    .map((product, index) => productCard(product, index))
    .join("");

  attachImageFallbacks(container);
}

/* =========================================================
   14. COUPON CODES
========================================================= */

/*
   Demo coupons:
   CRAVE10  = 10% off eligible subtotal of ₹299+
   WELCOME50 = ₹50 off eligible subtotal of ₹399+

   These are front-end demo codes, not secure production offers.
*/

function applyCoupon() {
  const input = $("#coupon-code");

  if (!input) {
    showToast("Coupon input not found.", "error");
    return;
  }

  const code = input.value.trim().toUpperCase();
  const subtotal = getSubtotal();

  if (!subtotal) {
    showToast("Add products before applying a coupon.", "error");
    return;
  }

  if (code === "CRAVE10" && subtotal >= 299) {
    state.coupon = { code };
  } else if (code === "WELCOME50" && subtotal >= 399) {
    state.coupon = { code };
  } else {
    showToast(
      "Invalid coupon or minimum order value not reached.",
      "error"
    );
    return;
  }

  safeWrite(CONFIG.storage.coupon, state.coupon);

  renderCart();
  showToast(`Coupon ${code} applied successfully!`);
}

/* =========================================================
   15. OPEN AND CLOSE PANELS
========================================================= */

function openPanel(selector) {
  const panel = $(selector);

  if (!panel) return;

  panel.classList.add("open");
  panel.classList.add("show");

  panel.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closePanel(selector) {
  const panel = $(selector);

  if (!panel) return;

  panel.classList.remove("open");
  panel.classList.remove("show");

  panel.setAttribute("aria-hidden", "true");

  if (!$(".cart-drawer.open, .modal.open, .modal.show")) {
    document.body.style.overflow = "";
  }
}

function openCart() {
  const drawer = $("#cart-drawer, .cart-drawer, .cart-sidebar");

  if (drawer) {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  } else {
    showToast("Cart panel not found. Check your HTML.");
  }
}

function closeCart() {
  $$("#cart-drawer, .cart-drawer, .cart-sidebar").forEach(drawer => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  });

  document.body.style.overflow = "";
}

/* =========================================================
   16. CHECKOUT
========================================================= */

function openCheckout() {
  if (!state.cart.length) {
    showToast("Your cart is empty.", "error");
    return;
  }

  closeCart();

  const modal = $("#checkout-modal");

  if (!modal) {
    showToast("Checkout form not found. Check your HTML.");
    return;
  }

  const customer = state.customer || {};

  const nameInput = $("#customer-name, [name='customerName']");
  const phoneInput = $("#customer-phone, [name='phone']");
  const emailInput = $("#customer-email, [name='email']");
  const addressInput = $("#customer-address, [name='address']");

  if (nameInput) nameInput.value = customer.name || "";
  if (phoneInput) phoneInput.value = customer.phone || "";
  if (emailInput) emailInput.value = customer.email || "";
  if (addressInput) addressInput.value = customer.address || "";

  modal.classList.add("open", "show");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  closePanel("#checkout-modal");
}

/* =========================================================
   17. CUSTOMER VALIDATION
========================================================= */

function getCustomerFromForm() {
  const name =
    $("#customer-name, [name='customerName']")?.value.trim() || "";

  const phone =
    $("#customer-phone, [name='phone']")?.value.trim() || "";

  const email =
    $("#customer-email, [name='email']")?.value.trim() || "";

  const address =
    $("#customer-address, [name='address']")?.value.trim() || "";

  const city =
    $("#customer-city, [name='city']")?.value.trim() || "";

  const pincode =
    $("#customer-pincode, [name='pincode']")?.value.trim() || "";

  if (name.length < 2) {
    showToast("Please enter your full name.", "error");
    return null;
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length !== 10) {
    showToast("Enter a valid 10-digit Indian mobile number.", "error");
    return null;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email address.", "error");
    return null;
  }

  if (address.length < 8) {
    showToast("Please enter your complete delivery address.", "error");
    return null;
  }

  if (city.length < 2) {
    showToast("Please enter your city.", "error");
    return null;
  }

  if (!/^\d{6}$/.test(pincode)) {
    showToast("Enter a valid 6-digit PIN code.", "error");
    return null;
  }

  return {
    name,
    phone,
    email,
    address,
    city,
    pincode
  };
}

/* =========================================================
   18. CREATE ORDER
========================================================= */

function placeOrder(event) {
  if (event) event.preventDefault();

  const customer = getCustomerFromForm();

  if (!customer) return;

  const items = getCartItems();

  if (!items.length) {
    showToast("Your cart is empty.", "error");
    return;
  }

  const totals = getTotals();

  const order = {
    id: makeId("CRAVE"),
    date: new Date().toISOString(),
    customer,
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    delivery: totals.delivery,
    demoTax: totals.demoTax,
    total: totals.total,
    coupon: state.coupon?.code || null,
    status: "Demo order created",
    paymentStatus: "Not paid",
    mode: "Demo only"
  };

  state.customer = customer;
  safeWrite(CONFIG.storage.customer, customer);

  state.orders.unshift(order);
  saveOrders();

  state.lastOrder = order;

  clearCart();
  closeCheckout();

  showInvoice(order);
  showToast("Demo order created successfully!");

  /*
    This is not a real order submission.
    No restaurant, delivery service, payment gateway,
    or backend server is contacted.
  */
}

/* =========================================================
   19. INVOICE GENERATION
========================================================= */

function showInvoice(order) {
  let invoice = $("#invoice-modal");

  if (!invoice) {
    invoice = document.createElement("div");
    invoice.id = "invoice-modal";
    invoice.className = "modal";

    document.body.appendChild(invoice);
  }

  const itemRows = order.items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(item.name)}</td>
      <td>${item.quantity}</td>
      <td>${money(item.price)}</td>
      <td>${money(item.lineTotal)}</td>
    </tr>
  `).join("");

  invoice.innerHTML = `
    <div class="modal-content invoice-container" id="invoice-print-area">
      <button
        class="modal-close no-print"
        type="button"
        data-action="close-invoice"
        aria-label="Close invoice"
      >✕</button>

      <div class="invoice-header">
        <div>
          <div class="invoice-brand">
            Crave<span>Cart</span>
          </div>
          <p style="color:#666;font-size:12px">
            Vegetarian Food Ordering Demo
          </p>
        </div>

        <div>
          <div class="invoice-title">ORDER BILL</div>
          <div class="invoice-meta">
            Order ID: ${escapeHTML(order.id)}<br>
            Date: ${escapeHTML(formatDate(new Date(order.date)))}<br>
            Status: Demo order
          </div>
        </div>
      </div>

      <div class="invoice-addresses">
        <div>
          <h4>Customer Details</h4>
          <p>
            <strong>${escapeHTML(order.customer.name)}</strong><br>
            ${escapeHTML(order.customer.phone)}<br>
            ${escapeHTML(order.customer.email || "Email not provided")}
          </p>
        </div>

        <div>
          <h4>Delivery Address</h4>
          <p>
            ${escapeHTML(order.customer.address)}<br>
            ${escapeHTML(order.customer.city)} -
            ${escapeHTML(order.customer.pincode)}
          </p>
        </div>
      </div>

      <div style="overflow-x:auto">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
      </div>

      <div class="invoice-totals">
        <div class="invoice-total-row">
          <span>Subtotal</span>
          <strong>${money(order.subtotal)}</strong>
        </div>

        <div class="invoice-total-row">
          <span>Discount</span>
          <strong>− ${money(order.discount)}</strong>
        </div>

        <div class="invoice-total-row">
          <span>Delivery</span>
          <strong>${money(order.delivery)}</strong>
        </div>

        <div class="invoice-total-row">
          <span>Illustrative demo tax (5%)</span>
          <strong>${money(order.demoTax)}</strong>
        </div>

        <div class="invoice-total-row grand-total">
          <span>Total</span>
          <strong>${money(order.total)}</strong>
        </div>
      </div>

      <div class="invoice-note">
        <strong>DEMO BILL — NOT A TAX INVOICE.</strong><br>
        This is a demonstration order. No payment was collected and
        no real delivery was arranged. The displayed tax is illustrative
        and is not a statement of applicable GST.
      </div>

      <div class="no-print" style="display:flex;gap:10px;margin-top:24px">
        <button class="btn btn-primary" data-action="print-invoice">
          🖨 Print / Save PDF
        </button>

        <button class="btn btn-secondary" data-action="close-invoice">
          Close
        </button>
      </div>
    </div>
  `;

  invoice.classList.add("open", "show");
  invoice.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

/* =========================================================
   20. PRINT / SAVE PDF
========================================================= */

function printInvoice() {
  const invoice = $("#invoice-print-area");

  if (!invoice) {
    showToast("No invoice available.", "error");
    return;
  }

  const popup = window.open("", "_blank", "width=900,height=750");

  if (!popup) {
    showToast("Allow pop-ups to print your invoice.", "error");
    return;
  }

  const printStyles = `
    <style>
      body {
        margin: 0;
        padding: 25px;
        background: #fff;
        color: #111;
        font-family: Arial, sans-serif;
      }

      * { box-sizing: border-box; }

      .invoice-container {
        max-width: 850px;
        margin: auto;
        padding: 25px;
        background: #fff;
        color: #111;
      }

      .invoice-header {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        padding-bottom: 20px;
        border-bottom: 2px solid #eee;
      }

      .invoice-brand {
        font-size: 27px;
        font-weight: 900;
      }

      .invoice-brand span { color: #ff6b00; }

      .invoice-title {
        font-size: 24px;
        font-weight: 900;
        text-align: right;
      }

      .invoice-meta {
        margin-top: 8px;
        color: #555;
        font-size: 12px;
        text-align: right;
      }

      .invoice-addresses {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 25px 0;
      }

      .invoice-addresses h4 {
        margin-bottom: 7px;
        font-size: 12px;
      }

      .invoice-addresses p {
        font-size: 12px;
        line-height: 1.7;
      }

      .invoice-table {
        width: 100%;
        margin: 20px 0;
        border-collapse: collapse;
        font-size: 12px;
      }

      .invoice-table th {
        padding: 12px 9px;
        background: #171717;
        color: white;
        text-align: left;
      }

      .invoice-table td {
        padding: 11px 9px;
        border-bottom: 1px solid #ddd;
      }

      .invoice-table th:last-child,
      .invoice-table td:last-child {
        text-align: right;
      }

      .invoice-totals {
        width: 320px;
        max-width: 100%;
        margin-left: auto;
      }

      .invoice-total-row {
        display: flex;
        justify-content: space-between;
        gap: 15px;
        padding: 7px 0;
        font-size: 12px;
      }

      .grand-total {
        border-top: 2px solid #ddd;
        padding-top: 12px;
        font-size: 17px;
        font-weight: 900;
      }

      .invoice-note {
        margin-top: 25px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        font-size: 11px;
        line-height: 1.7;
      }

      .no-print,
      .modal-close {
        display: none !important;
      }

      @page {
        size: A4;
        margin: 12mm;
      }

      @media print {
        body { padding: 0; }
      }
    </style>
  `;

  popup.document.open();

  popup.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>CraveCart Demo Bill</title>
        ${printStyles}
      </head>
      <body>
        ${invoice.outerHTML}
        <script>
          window.onload = function () {
            window.print();
          };
        <\/script>
      </body>
    </html>
  `);

  popup.document.close();
}

/* =========================================================
   21. CLOSE INVOICE
========================================================= */

function closeInvoice() {
  closePanel("#invoice-modal");
}

/* =========================================================
   22. GENERAL EVENT HANDLER
========================================================= */

document.addEventListener("click", event => {
  const actionButton = event.target.closest("[data-action]");

  if (actionButton) {
    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;

    switch (action) {
      case "add":
      case "add-to-cart":
        addToCart(id);
        break;

      case "wishlist":
        toggleWishlist(id);
        break;

      case "increase":
        changeQuantity(id, 1);
        break;

      case "decrease":
        changeQuantity(id, -1);
        break;

      case "remove":
        removeFromCart(id);
        break;

      case "checkout":
        openCheckout();
        break;

      case "close-cart":
        closeCart();
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

      case "apply-coupon":
        applyCoupon();
        break;

      case "continue-shopping":
        closeCart();
        $("#products")?.scrollIntoView({ behavior: "smooth" });
        break;

      case "reset-filters":
        state.search = "";
        state.activeCategory = "All";
        state.sort = "featured";

        const searchInput = $("#search-input");
        const sortSelect = $("#sort-select");

        if (searchInput) searchInput.value = "";
        if (sortSelect) sortSelect.value = "featured";

        renderCategories();
        renderProducts();
        break;
    }

    return;
  }

  const categoryButton = event.target.closest("[data-category]");

  if (categoryButton) {
    state.activeCategory = categoryButton.dataset.category;

    renderCategories();
    renderProducts();
    return;
  }

  if (event.target.matches("[data-cart-open]")) {
    openCart();
    return;
  }

  if (event.target.matches("[data-wishlist-open]")) {
    renderWishlist();
    openPanel("#wishlist-modal");
    return;
  }

  if (event.target.matches("[data-checkout-open]")) {
    openCheckout();
    return;
  }

  if (event.target.matches("[data-close-modal]")) {
    const selector = event.target.dataset.closeModal;
    closePanel(selector);
    return;
  }

  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("open", "show");
    event.target.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
});

/* =========================================================
   23. SEARCH AND SORT EVENTS
========================================================= */

const searchInput = $("#search-input");

if (searchInput) {
  searchInput.addEventListener("input", event => {
    state.search = event.target.value;
    renderProducts();
  });
}

const sortSelect = $("#sort-select");

if (sortSelect) {
  sortSelect.addEventListener("change", event => {
    state.sort = event.target.value;
    renderProducts();
  });
}

/* =========================================================
   24. CHECKOUT FORM EVENTS
========================================================= */

const checkoutForm = $("#checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", placeOrder);
}

const couponButton = $("#apply-coupon");

if (couponButton) {
  couponButton.addEventListener("click", applyCoupon);
}

const couponInput = $("#coupon-code");

if (couponInput) {
  couponInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCoupon();
    }
  });
}

/* =========================================================
   25. MOBILE NAVIGATION
========================================================= */

const mobileMenuButton = $("#mobile-menu-btn");
const mainNav = $(".main-nav");

if (mobileMenuButton && mainNav) {
  mobileMenuButton.addEventListener("click", () => {
    const opened = mainNav.classList.toggle("open");

    mobileMenuButton.setAttribute(
      "aria-expanded",
      String(opened)
    );
  });

  $$(".main-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");

      mobileMenuButton.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });
}

/* =========================================================
   26. NEWSLETTER DEMO
========================================================= */

const newsletterForm = $("#newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();

    const input = $("input[type='email']", newsletterForm);

    if (!input || !input.value.trim()) {
      showToast("Enter your email address.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      showToast("Enter a valid email address.", "error");
      return;
    }

    showToast("Thanks! Newsletter demo submitted.");

    newsletterForm.reset();
  });
}

/* =========================================================
   27. CLOSE PANELS WITH ESCAPE
========================================================= */

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeCheckout();
    closeInvoice();
    closePanel("#wishlist-modal");

    document.body.style.overflow = "";
  }
});

/* =========================================================
   28. INITIALISE APP
========================================================= */

function initCraveCart() {
  renderCategories();
  renderProducts();
  renderCart();
  renderWishlist();
  attachImageFallbacks();

  // Update footer year if present.
  const year = $("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  console.log(
    `%c${CONFIG.storeName} Premium`,
    "color:#ff6b00;font-size:20px;font-weight:bold"
  );

  console.log(
    `Loaded ${PRODUCTS.length} vegetarian food products.`
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCraveCart);
} else {
  initCraveCart();
}

/* =========================================================
   END CRAVECART APP
========================================================= */
```
