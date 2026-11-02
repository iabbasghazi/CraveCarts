/* =========================================
   CRAVECART — APP.JS
   Premium Vegetarian Food Ordering Website
   ========================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Veg Burger",
    category: "Burgers",
    price: 129,
    oldPrice: 179,
    rating: 4.8,
    emoji: "🍔",
    description: "Crispy veg patty, fresh lettuce and signature sauce.",
    bestseller: true,
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Cheese Burst Burger",
    category: "Burgers",
    price: 169,
    oldPrice: 219,
    rating: 4.9,
    emoji: "🍔",
    description: "Loaded with molten cheese and a crispy veggie patty.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 3,
    name: "Double Patty Burger",
    category: "Burgers",
    price: 199,
    oldPrice: 249,
    rating: 4.7,
    emoji: "🍔",
    description: "Two delicious patties layered with fresh vegetables.",
    bestseller: false,
    badge: ""
  },
  {
    id: 4,
    name: "Spicy Paneer Burger",
    category: "Burgers",
    price: 179,
    oldPrice: 229,
    rating: 4.8,
    emoji: "🍔",
    description: "Spicy paneer patty with creamy mint mayonnaise.",
    bestseller: true,
    badge: "Spicy"
  },
  {
    id: 5,
    name: "Classic Margherita Pizza",
    category: "Pizza",
    price: 199,
    oldPrice: 259,
    rating: 4.7,
    emoji: "🍕",
    description: "Classic mozzarella cheese, tomato sauce and basil.",
    bestseller: true,
    badge: "Classic"
  },
  {
    id: 6,
    name: "Farmhouse Pizza",
    category: "Pizza",
    price: 299,
    oldPrice: 369,
    rating: 4.9,
    emoji: "🍕",
    description: "Loaded with capsicum, onion, tomato and mushrooms.",
    bestseller: true,
    badge: "Bestseller"
  },
  {
    id: 7,
    name: "Paneer Tikka Pizza",
    category: "Pizza",
    price: 329,
    oldPrice: 399,
    rating: 4.8,
    emoji: "🍕",
    description: "Smoky paneer tikka with spicy Indian-inspired sauce.",
    bestseller: false,
    badge: ""
  },
  {
    id: 8,
    name: "Peri Peri Pizza",
    category: "Pizza",
    price: 279,
    oldPrice: 349,
    rating: 4.6,
    emoji: "🍕",
    description: "A spicy pizza topped with peri peri seasoning.",
    bestseller: false,
    badge: "Spicy"
  },
  {
    id: 9,
    name: "Garden Fresh Sandwich",
    category: "Sandwiches",
    price: 99,
    oldPrice: 139,
    rating: 4.5,
    emoji: "🥪",
    description: "Fresh vegetables, cheese and house-made sandwich spread.",
    bestseller: false,
    badge: ""
  },
  {
    id: 10,
    name: "Grilled Cheese Sandwich",
    category: "Sandwiches",
    price: 149,
    oldPrice: 189,
    rating: 4.8,
    emoji: "🥪",
    description: "Golden grilled bread with delicious melted cheese.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 11,
    name: "Paneer Club Sandwich",
    category: "Sandwiches",
    price: 179,
    oldPrice: 219,
    rating: 4.7,
    emoji: "🥪",
    description: "A hearty triple-layer sandwich stuffed with paneer.",
    bestseller: false,
    badge: ""
  },
  {
    id: 12,
    name: "Veggie Wrap",
    category: "Wraps",
    price: 119,
    oldPrice: 159,
    rating: 4.5,
    emoji: "🌯",
    description: "Soft tortilla filled with crunchy vegetables and sauce.",
    bestseller: false,
    badge: ""
  },
  {
    id: 13,
    name: "Paneer Tikka Wrap",
    category: "Wraps",
    price: 169,
    oldPrice: 209,
    rating: 4.8,
    emoji: "🌯",
    description: "Spiced paneer tikka wrapped with fresh veggies.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 14,
    name: "Mexican Bean Wrap",
    category: "Wraps",
    price: 149,
    oldPrice: 189,
    rating: 4.6,
    emoji: "🌯",
    description: "Beans, rice, vegetables and tangy Mexican sauce.",
    bestseller: false,
    badge: ""
  },
  {
    id: 15,
    name: "Classic French Fries",
    category: "Sides",
    price: 79,
    oldPrice: 109,
    rating: 4.5,
    emoji: "🍟",
    description: "Crispy golden fries with a pinch of seasoning.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 16,
    name: "Peri Peri Fries",
    category: "Sides",
    price: 99,
    oldPrice: 129,
    rating: 4.7,
    emoji: "🍟",
    description: "Crispy fries tossed in spicy peri peri seasoning.",
    bestseller: false,
    badge: "Spicy"
  },
  {
    id: 17,
    name: "Cheese Garlic Bread",
    category: "Sides",
    price: 129,
    oldPrice: 159,
    rating: 4.8,
    emoji: "🥖",
    description: "Toasted garlic bread topped with melted cheese.",
    bestseller: true,
    badge: ""
  },
  {
    id: 18,
    name: "Veggie Nuggets",
    category: "Sides",
    price: 109,
    oldPrice: 149,
    rating: 4.4,
    emoji: "🍘",
    description: "Crispy vegetable nuggets served with dipping sauce.",
    bestseller: false,
    badge: ""
  },
  {
    id: 19,
    name: "White Sauce Pasta",
    category: "Pasta",
    price: 199,
    oldPrice: 249,
    rating: 4.8,
    emoji: "🍝",
    description: "Creamy Alfredo-style pasta with herbs and vegetables.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 20,
    name: "Red Sauce Pasta",
    category: "Pasta",
    price: 179,
    oldPrice: 229,
    rating: 4.7,
    emoji: "🍝",
    description: "Italian-inspired tomato sauce with aromatic herbs.",
    bestseller: false,
    badge: ""
  },
  {
    id: 21,
    name: "Pesto Pasta",
    category: "Pasta",
    price: 229,
    oldPrice: 279,
    rating: 4.6,
    emoji: "🍝",
    description: "Pasta tossed in fragrant basil pesto-style sauce.",
    bestseller: false,
    badge: ""
  },
  {
    id: 22,
    name: "Veg Hakka Noodles",
    category: "Chinese",
    price: 159,
    oldPrice: 199,
    rating: 4.6,
    emoji: "🍜",
    description: "Stir-fried noodles with crunchy vegetables.",
    bestseller: true,
    badge: ""
  },
  {
    id: 23,
    name: "Veg Fried Rice",
    category: "Chinese",
    price: 149,
    oldPrice: 189,
    rating: 4.5,
    emoji: "🍚",
    description: "Fluffy rice tossed with vegetables and Asian seasoning.",
    bestseller: false,
    badge: ""
  },
  {
    id: 24,
    name: "Veg Manchurian",
    category: "Chinese",
    price: 179,
    oldPrice: 219,
    rating: 4.7,
    emoji: "🥡",
    description: "Vegetable dumplings coated in tangy Manchurian sauce.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 25,
    name: "Crispy Spring Rolls",
    category: "Chinese",
    price: 129,
    oldPrice: 169,
    rating: 4.6,
    emoji: "🥢",
    description: "Crunchy rolls filled with seasoned vegetables.",
    bestseller: false,
    badge: ""
  },
  {
    id: 26,
    name: "Paneer Butter Masala",
    category: "Indian",
    price: 249,
    oldPrice: 299,
    rating: 4.9,
    emoji: "🍛",
    description: "Paneer cubes in a rich, creamy tomato gravy.",
    bestseller: true,
    badge: "Bestseller"
  },
  {
    id: 27,
    name: "Shahi Paneer",
    category: "Indian",
    price: 269,
    oldPrice: 319,
    rating: 4.8,
    emoji: "🍛",
    description: "Royal-style paneer curry with aromatic spices.",
    bestseller: false,
    badge: ""
  },
  {
    id: 28,
    name: "Dal Makhani",
    category: "Indian",
    price: 199,
    oldPrice: 249,
    rating: 4.8,
    emoji: "🥘",
    description: "Slow-cooked black lentils in a creamy gravy.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 29,
    name: "Chole Bhature",
    category: "Indian",
    price: 169,
    oldPrice: 219,
    rating: 4.7,
    emoji: "🫓",
    description: "Spicy chickpea curry with fluffy fried bread.",
    bestseller: true,
    badge: ""
  },
  {
    id: 30,
    name: "Veg Biryani",
    category: "Indian",
    price: 189,
    oldPrice: 239,
    rating: 4.7,
    emoji: "🍚",
    description: "Fragrant basmati rice cooked with vegetables and spices.",
    bestseller: true,
    badge: "Bestseller"
  },
  {
    id: 31,
    name: "Paneer Biryani",
    category: "Indian",
    price: 229,
    oldPrice: 279,
    rating: 4.8,
    emoji: "🍚",
    description: "Aromatic basmati rice layered with seasoned paneer.",
    bestseller: false,
    badge: ""
  },
  {
    id: 32,
    name: "Masala Dosa",
    category: "Indian",
    price: 119,
    oldPrice: 159,
    rating: 4.7,
    emoji: "🥞",
    description: "Crispy dosa filled with spiced potato masala.",
    bestseller: true,
    badge: ""
  },
  {
    id: 33,
    name: "Paneer Tikka",
    category: "Indian",
    price: 229,
    oldPrice: 279,
    rating: 4.8,
    emoji: "🍢",
    description: "Grilled paneer marinated with Indian spices.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 34,
    name: "Veg Momos",
    category: "Chinese",
    price: 99,
    oldPrice: 139,
    rating: 4.5,
    emoji: "🥟",
    description: "Steamed dumplings filled with seasoned vegetables.",
    bestseller: false,
    badge: ""
  },
  {
    id: 35,
    name: "Chilli Paneer",
    category: "Chinese",
    price: 219,
    oldPrice: 269,
    rating: 4.7,
    emoji: "🌶️",
    description: "Paneer tossed with peppers in a spicy Indo-Chinese sauce.",
    bestseller: true,
    badge: "Spicy"
  },
  {
    id: 36,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 99,
    oldPrice: 129,
    rating: 4.8,
    emoji: "🍫",
    description: "Rich chocolate brownie with a soft, fudgy centre.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 37,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 129,
    oldPrice: 169,
    rating: 4.9,
    emoji: "🍰",
    description: "Warm chocolate cake with a gooey chocolate centre.",
    bestseller: true,
    badge: "Bestseller"
  },
  {
    id: 38,
    name: "Vanilla Ice Cream",
    category: "Desserts",
    price: 79,
    oldPrice: 99,
    rating: 4.5,
    emoji: "🍨",
    description: "Classic creamy vanilla-flavoured frozen dessert.",
    bestseller: false,
    badge: ""
  },
  {
    id: 39,
    name: "Chocolate Milkshake",
    category: "Drinks",
    price: 129,
    oldPrice: 159,
    rating: 4.7,
    emoji: "🥤",
    description: "Creamy chocolate milkshake served chilled.",
    bestseller: true,
    badge: ""
  },
  {
    id: 40,
    name: "Fresh Lime Soda",
    category: "Drinks",
    price: 69,
    oldPrice: 89,
    rating: 4.4,
    emoji: "🍋",
    description: "Refreshing lime soda with a citrusy twist.",
    bestseller: false,
    badge: ""
  },
  {
    id: 41,
    name: "Cold Coffee",
    category: "Drinks",
    price: 119,
    oldPrice: 149,
    rating: 4.7,
    emoji: "🧋",
    description: "Chilled coffee blended with milk and ice.",
    bestseller: true,
    badge: "Popular"
  },
  {
    id: 42,
    name: "Mango Smoothie",
    category: "Drinks",
    price: 139,
    oldPrice: 169,
    rating: 4.6,
    emoji: "🥭",
    description: "Smooth mango drink made with ripe mango flavour.",
    bestseller: false,
    badge: ""
  },
  {
    id: 43,
    name: "Veggie Supreme Pizza",
    category: "Pizza",
    price: 349,
    oldPrice: 429,
    rating: 4.9,
    emoji: "🍕",
    description: "A generous mix of vegetables and extra cheese.",
    bestseller: true,
    badge: "Bestseller"
  },
  {
    id: 44,
    name: "Cheese Corn Pizza",
    category: "Pizza",
    price: 249,
    oldPrice: 299,
    rating: 4.6,
    emoji: "🍕",
    description: "Sweet corn, mozzarella and a creamy cheese base.",
    bestseller: false,
    badge: ""
  },
  {
    id: 45,
    name: "Tandoori Paneer Pizza",
    category: "Pizza",
    price: 339,
    oldPrice: 409,
    rating: 4.8,
    emoji: "🍕",
    description: "Tandoori-spiced paneer with onions and peppers.",
    bestseller: true,
    badge: "Spicy"
  },
  {
    id: 46,
    name: "Mushroom Pizza",
    category: "Pizza",
    price: 279,
    oldPrice: 339,
    rating: 4.6,
    emoji: "🍕",
    description: "Mushrooms, herbs and melted mozzarella cheese.",
    bestseller: false,
    badge: ""
  },
  {
    id: 47,
    name: "Aloo Tikki Burger",
    category: "Burgers",
    price: 99,
    oldPrice: 129,
    rating: 4.5,
    emoji: "🍔",
    description: "Indian-style potato tikki with tangy burger sauce.",
    bestseller: false,
    badge: ""
  },
  {
    id: 48,
    name: "Mushroom Burger",
    category: "Burgers",
    price: 179,
    oldPrice: 229,
    rating: 4.7,
    emoji: "🍔",
    description: "A flavourful mushroom patty with fresh toppings.",
    bestseller: false,
    badge: ""
  },
  {
    id: 49,
    name: "Paneer Kathi Roll",
    category: "Wraps",
    price: 159,
    oldPrice: 199,
    rating: 4.7,
    emoji: "🌯",
    description: "Indian flatbread rolled with spiced paneer and onions.",
    bestseller: true,
    badge: ""
  },
  {
    id: 50,
    name: "Cheese Corn Sandwich",
    category: "Sandwiches",
    price: 139,
    oldPrice: 179,
    rating: 4.6,
    emoji: "🥪",
    description: "Sweet corn and melted cheese in toasted bread.",
    bestseller: false,
    badge: ""
  }
];

/* =========================================
   APPLICATION STATE
   ========================================= */

const STORAGE_KEYS = {
  cart: "cravecart_cart",
  wishlist: "cravecart_wishlist",
  orders: "cravecart_orders",
  user: "cravecart_user"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read saved data:", key, error);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save data:", key, error);
    showToast("Browser storage unavailable.");
  }
}

let cart = readStorage(STORAGE_KEYS.cart, []);
let wishlist = readStorage(STORAGE_KEYS.wishlist, []);
let orders = readStorage(STORAGE_KEYS.orders, []);

let activeCategory = "All";
let searchQuery = "";
let sortOption = "featured";
let maxPrice = Infinity;
let minRating = 0;
let vegOnly = true;

/* =========================================
   HELPERS
   ========================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function getProduct(productId) {
  return PRODUCTS.find(product => product.id === Number(productId));
}

function getCartQuantity(productId) {
  const item = cart.find(
    entry => entry.id === Number(productId)
  );

  return item ? item.quantity : 0;
}

function getCartCount() {
  return cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);

    return total + (
      product ? product.price * item.quantity : 0
    );
  }, 0);
}

function showToast(message) {
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
  toast.classList.add("show");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* =========================================
   PRODUCT DISPLAY
   ========================================= */

function createProductCard(product) {
  const isWishlisted = wishlist.includes(product.id);
  const quantity = getCartQuantity(product.id);

  return `
    <article class="product-card" data-product-id="${product.id}">

      <div class="product-image">
        <span class="product-emoji" aria-hidden="true">
          ${product.emoji}
        </span>

        ${
          product.badge
            ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
            : ""
        }

        <button
          type="button"
          class="wishlist-btn ${isWishlisted ? "active" : ""}"
          data-action="wishlist"
          data-id="${product.id}"
          aria-label="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
          aria-pressed="${isWishlisted}"
        >
          ${isWishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div class="product-info">

        <div class="product-category">
          ${escapeHTML(product.category)}
        </div>

        <h3 class="product-name">
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-rating">
          <span aria-hidden="true">★</span>
          <span>${product.rating.toFixed(1)}</span>
        </div>

        <div class="product-footer">

          <div class="product-prices">
            <span class="product-price">
              ${formatPrice(product.price)}
            </span>

            ${
              product.oldPrice > product.price
                ? `<del class="old-price">${formatPrice(product.oldPrice)}</del>`
                : ""
            }
          </div>

          ${
            quantity > 0
              ? `
                <div class="quantity-control">
                  <button
                    type="button"
                    data-action="decrease"
                    data-id="${product.id}"
                    aria-label="Decrease ${escapeHTML(product.name)} quantity"
                  >−</button>

                  <span>${quantity}</span>

                  <button
                    type="button"
                    data-action="increase"
                    data-id="${product.id}"
                    aria-label="Increase ${escapeHTML(product.name)} quantity"
                  >+</button>
                </div>
              `
              : `
                <button
                  type="button"
                  class="add-to-cart-btn"
                  data-action="add"
                  data-id="${product.id}"
                >
                  + Add
                </button>
              `
          }

        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const containers = [
    $("#products-grid"),
    $("#product-grid"),
    $("#menu-grid"),
    $(".products-grid"),
    $(".product-grid")
  ].filter(Boolean);

  if (containers.length === 0) {
    console.warn(
      "Product grid not found. Add an element with id='products-grid'."
    );
    return;
  }

  let filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery);

    const matchesPrice = product.price <= maxPrice;
    const matchesRating = product.rating >= minRating;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesPrice &&
      matchesRating
    );
  });

  switch (sortOption) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;

    case "name":
      filteredProducts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "featured":
    default:
      filteredProducts.sort((a, b) =>
        Number(b.bestseller) - Number(a.bestseller)
      );
      break;
  }

  containers.forEach(container => {
    container.innerHTML = filteredProducts.length
      ? filteredProducts.map(createProductCard).join("")
      : `
        <div class="empty-state">
          <div class="empty-state-icon">🔎</div>
          <h3>No dishes found</h3>
          <p>Try another search or category.</p>
          <button type="button" class="btn-primary" data-action="reset-filters">
            Clear Filters
          </button>
        </div>
      `;
  });

  const countElements = [
    $("#product-count"),
    $("#results-count"),
    $(".product-count")
  ].filter(Boolean);

  countElements.forEach(element => {
    element.textContent = `${filteredProducts.length} dishes`;
  });

  updateWishlistCount();
}

/* =========================================
   CATEGORY FILTERS
   ========================================= */

function setCategory(category) {
  activeCategory = category;

  $$("[data-category]").forEach(button => {
    const selected =
      button.dataset.category.toLowerCase() === category.toLowerCase();

    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  renderProducts();
}

function renderCategories() {
  const categoryContainer =
    $("#category-list") ||
    $("#categories") ||
    $(".category-list");

  if (!categoryContainer) return;

  const categories = [
    "All",
    ...new Set(PRODUCTS.map(product => product.category))
  ];

  categoryContainer.innerHTML = categories.map(category => `
    <button
      type="button"
      class="category-btn ${category === activeCategory ? "active" : ""}"
      data-category="${escapeHTML(category)}"
      aria-pressed="${category === activeCategory}"
    >
      ${category === "All" ? "🍽️" : getCategoryEmoji(category)}
      <span>${escapeHTML(category)}</span>
    </button>
  `).join("");
}

function getCategoryEmoji(category) {
  const emojis = {
    Burgers: "🍔",
    Pizza: "🍕",
    Sandwiches: "🥪",
    Wraps: "🌯",
    Sides: "🍟",
    Pasta: "🍝",
    Chinese: "🥡",
    Indian: "🍛",
    Desserts: "🍰",
    Drinks: "🥤"
  };

  return emojis[category] || "🍽️";
}

/* =========================================
   CART MANAGEMENT
   ========================================= */

function addToCart(productId) {
  const product = getProduct(productId);

  if (!product) return;

  const existingItem = cart.find(
    item => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();
  renderProducts();

  showToast(`${product.name} added to cart!`);
}

function increaseQuantity(productId) {
  const product = getProduct(productId);

  if (!product) return;

  const item = cart.find(
    entry => entry.id === product.id
  );

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveStorage(STORAGE_KEYS.cart, cart);
  updateCartUI();
  renderProducts();
}

function decreaseQuantity(productId) {
  const item = cart.find(
    entry => entry.id === Number(productId)
  );

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(
      entry => entry.id !== Number(productId)
    );
  }

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();
  renderProducts();
}

function removeFromCart(productId) {
  cart = cart.filter(
    item => item.id !== Number(productId)
  );

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();
  renderProducts();

  showToast("Item removed from cart.");
}

function clearCart() {
  cart = [];

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();
  renderProducts();

  showToast("Cart cleared.");
}

function updateCartUI() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();

  [
    "#cart-count",
    "#cart-badge",
    ".cart-count"
  ].forEach(selector => {
    $$(selector).forEach(element => {
      element.textContent = count;
      element.classList.toggle("hidden", count === 0);
    });
  });

  [
    "#cart-subtotal",
    "#subtotal",
    ".cart-subtotal"
  ].forEach(selector => {
    $$(selector).forEach(element => {
      element.textContent = formatPrice(subtotal);
    });
  });

  const deliveryFee = subtotal === 0 || subtotal >= 499 ? 0 : 30;
  const total = subtotal + deliveryFee;

  $$("#delivery-fee, .delivery-fee").forEach(element => {
    element.textContent =
      deliveryFee === 0 && subtotal > 0
        ? "FREE"
        : formatPrice(deliveryFee);
  });

  $$("#cart-total, #total-price, .cart-total").forEach(element => {
    element.textContent = formatPrice(total);
  });

  const cartContainer =
    $("#cart-items") ||
    $("#cart-list") ||
    $(".cart-items");

  if (cartContainer) {
    renderCartItems(cartContainer);
  }

  renderProducts();
}

function renderCartItems(container) {
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some delicious vegetarian dishes!</p>
        <button
          type="button"
          class="btn-primary"
          data-action="continue-shopping"
        >
          Explore Menu
        </button>
      </div>
    `;

    return;
  }

  container.innerHTML = cart.map(item => {
    const product = getProduct(item.id);

    if (!product) return "";

    return `
      <div class="cart-item">

        <div class="cart-item-image">
          ${product.emoji}
        </div>

        <div class="cart-item-info">
          <h4>${escapeHTML(product.name)}</h4>
          <p>${formatPrice(product.price)}</p>

          <div class="quantity-control">
            <button
              type="button"
              data-action="decrease"
              data-id="${product.id}"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-action="increase"
              data-id="${product.id}"
              aria-label="Increase quantity"
            >+</button>
          </div>
        </div>

        <div class="cart-item-end">
          <strong>${formatPrice(product.price * item.quantity)}</strong>

          <button
            type="button"
            class="remove-item-btn"
            data-action="remove"
            data-id="${product.id}"
            aria-label="Remove ${escapeHTML(product.name)}"
          >
            Remove
          </button>
        </div>

      </div>
    `;
  }).join("");
}

/* =========================================
   WISHLIST
   ========================================= */

function toggleWishlist(productId) {
  const id = Number(productId);
  const product = getProduct(id);

  if (!product) return;

  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(
      itemId => itemId !== id
    );

    showToast("Removed from wishlist.");
  } else {
    wishlist.push(id);
    showToast("Added to wishlist!");
  }

  saveStorage(STORAGE_KEYS.wishlist, wishlist);

  updateWishlistCount();
  renderProducts();
}

function updateWishlistCount() {
  [
    "#wishlist-count",
    "#wishlist-badge",
    ".wishlist-count"
  ].forEach(selector => {
    $$(selector).forEach(element => {
      element.textContent = wishlist.length;
      element.classList.toggle(
        "hidden",
        wishlist.length === 0
      );
    });
  });
}

function renderWishlist() {
  const container =
    $("#wishlist-items") ||
    $("#wishlist-grid");

  if (!container) return;

  const products = wishlist
    .map(id => getProduct(id))
    .filter(Boolean);

  container.innerHTML = products.length
    ? products.map(createProductCard).join("")
    : `
      <div class="empty-state">
        <div class="empty-state-icon">♡</div>
        <h3>Your wishlist is empty</h3>
        <p>Save your favourite vegetarian dishes here.</p>
      </div>
    `;
}

/* =========================================
   SEARCH
   ========================================= */

function handleSearch(value) {
  searchQuery = value.trim().toLowerCase();
  renderProducts();
}

function setupSearch() {
  const searchInputs = [
    "#search-input",
    "#product-search",
    ".search-input"
  ];

  searchInputs.forEach(selector => {
    $$(selector).forEach(input => {
      input.addEventListener("input", event => {
        handleSearch(event.target.value);
      });

      input.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          input.value = "";
          handleSearch("");
        }
      });
    });
  });

  $$("[data-search-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const search = $("#search-input");

      if (search) {
        search.classList.toggle("visible");
        search.focus();
      }
    });
  });
}

/* =========================================
   SORTING AND FILTERS
   ========================================= */

function setupFilters() {
  const sortSelect =
    $("#sort-select") ||
    $("#sort-products");

  if (sortSelect) {
    sortSelect.addEventListener("change", event => {
      sortOption = event.target.value;
      renderProducts();
    });
  }

  const priceRange =
    $("#price-range") ||
    $("#max-price");

  if (priceRange) {
    priceRange.addEventListener("input", event => {
      const value = Number(event.target.value);

      maxPrice = value > 0 ? value : Infinity;

      const priceLabel =
        $("#price-value") ||
        $("#max-price-value");

      if (priceLabel) {
        priceLabel.textContent =
          Number.isFinite(maxPrice)
            ? formatPrice(maxPrice)
            : "Any price";
      }

      renderProducts();
    });
  }

  const ratingSelect = $("#rating-filter");

  if (ratingSelect) {
    ratingSelect.addEventListener("change", event => {
      minRating = Number(event.target.value) || 0;
      renderProducts();
    });
  }

  const resetButton = $("#reset-filters");

  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }
}

function resetFilters() {
  activeCategory = "All";
  searchQuery = "";
  sortOption = "featured";
  maxPrice = Infinity;
  minRating = 0;

  $$("#search-input, #product-search, .search-input").forEach(input => {
    input.value = "";
  });

  const sortSelect =
    $("#sort-select") ||
    $("#sort-products");

  if (sortSelect) {
    sortSelect.value = "featured";
  }

  const ratingSelect = $("#rating-filter");

  if (ratingSelect) {
    ratingSelect.value = "0";
  }

  renderCategories();
  renderProducts();

  showToast("Filters cleared.");
}

/* =========================================
   MODALS AND DRAWERS
   ========================================= */

function openElement(selector) {
  const element = $(selector);

  if (!element) return;

  element.classList.add("open");
  element.classList.add("active");
  element.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function closeElement(element) {
  if (!element) return;

  element.classList.remove("open");
  element.classList.remove("active");
  element.setAttribute("aria-hidden", "true");

  const stillOpen = $(
    ".modal.open, .drawer.open, .cart-sidebar.open, .modal.active, .drawer.active"
  );

  if (!stillOpen) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  $$(".modal, .drawer, .cart-sidebar, .cart-drawer").forEach(element => {
    closeElement(element);
  });
}

function setupModalEvents() {
  $$("[data-open]").forEach(button => {
    button.addEventListener("click", () => {
      openElement(button.dataset.open);
    });
  });

  $$("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.close;

      if (target) {
        closeElement($(target));
      } else {
        closeElement(button.closest(".modal, .drawer, .cart-sidebar"));
      }
    });
  });

  $$(".modal-backdrop, .drawer-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) {
        closeElement(backdrop);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });
}

/* =========================================
   CHECKOUT
   DEMO ONLY — NO REAL PAYMENT PROCESSING
   ========================================= */

function setupCheckout() {
  const checkoutButtons = [
    "#checkout-btn",
    "#checkout-button",
    "[data-action='checkout']"
  ];

  checkoutButtons.forEach(selector => {
    $$(selector).forEach(button => {
      button.addEventListener("click", openCheckout);
    });
  });

  const checkoutForm =
    $("#checkout-form") ||
    $("#order-form");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", submitOrder);
  }
}

function openCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  const checkoutContainer =
    $("#checkout-modal") ||
    $("#checkout-section");

  if (checkoutContainer) {
    const subtotal = getCartSubtotal();
    const deliveryFee = subtotal >= 499 ? 0 : 30;

    const amountElement =
      $("#checkout-total") ||
      $("#checkout-amount");

    if (amountElement) {
      amountElement.textContent =
        formatPrice(subtotal + deliveryFee);
    }

    openElement(
      checkoutContainer.id
        ? `#${checkoutContainer.id}`
        : "#checkout-section"
    );

    return;
  }

  showToast(
    "Add a checkout modal with id='checkout-modal' to enable demo checkout."
  );
}

function submitOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

  const customer = {
    name:
      formData.get("name") ||
      formData.get("customerName") ||
      "",
    phone:
      formData.get("phone") ||
      formData.get("mobile") ||
      "",
    address:
      formData.get("address") ||
      "",
    paymentMethod:
      formData.get("payment") ||
      "Demo payment"
  };

  const subtotal = getCartSubtotal();
  const deliveryFee = subtotal >= 499 ? 0 : 30;

  const order = {
    id: "CC" + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    customer,
    items: cart.map(item => ({
      ...item,
      name: getProduct(item.id)?.name || "Unknown item",
      price: getProduct(item.id)?.price || 0
    })),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: "Demo order",
    demo: true
  };

  orders.unshift(order);

  saveStorage(STORAGE_KEYS.orders, orders);

  cart = [];

  saveStorage(STORAGE_KEYS.cart, cart);

  updateCartUI();
  renderProducts();
  closeAllModals();

  form.reset();

  showToast(`Demo order placed! Order ID: ${order.id}`);

  const successMessage = $("#order-success");

  if (successMessage) {
    successMessage.textContent =
      `Demo order ${order.id} created successfully. No payment was processed.`;

    successMessage.classList.remove("hidden");
  }

  console.info("CraveCart demo order:", order);
}

/* =========================================
   LOGIN / SIGNUP DEMO
   ========================================= */

function setupAuth() {
  const authForm =
    $("#login-form") ||
    $("#signup-form");

  if (!authForm) return;

  authForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!authForm.checkValidity()) {
      authForm.reportValidity();
      return;
    }

    const formData = new FormData(authForm);

    const user = {
      name:
        formData.get("name") ||
        formData.get("username") ||
        "CraveCart User",
      email: formData.get("email") || "",
      demo: true
    };

    saveStorage(STORAGE_KEYS.user, user);

    updateAuthUI(user);
    closeAllModals();

    showToast("Demo sign-in successful!");
  });

  const savedUser = readStorage(STORAGE_KEYS.user, null);

  if (savedUser) {
    updateAuthUI(savedUser);
  }
}

function updateAuthUI(user) {
  const accountName =
    $("#account-name") ||
    $("#user-name");

  if (accountName) {
    accountName.textContent = user.name;
  }

  const accountButton = $("#account-btn");

  if (accountButton) {
    accountButton.textContent = user.name;
  }

  const loginButton = $("#login-btn");

  if (loginButton) {
    loginButton.classList.add("hidden");
  }

  const logoutButton = $("#logout-btn");

  if (logoutButton) {
    logoutButton.classList.remove("hidden");
  }
}

function logout() {
  try {
    localStorage.removeItem(STORAGE_KEYS.user);
  } catch (error) {
    console.warn(error);
  }

  const loginButton = $("#login-btn");
  const logoutButton = $("#logout-btn");

  if (loginButton) {
    loginButton.classList.remove("hidden");
  }

  if (logoutButton) {
    logoutButton.classList.add("hidden");
  }

  showToast("Signed out.");
}

/* =========================================
   MOBILE NAVIGATION
   ========================================= */

function setupMobileMenu() {
  const menuButton =
    $("#menu-toggle") ||
    $(".menu-toggle");

  const navigation =
    $("#main-nav") ||
    $(".main-nav") ||
    $("nav");

  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  $$("#main-nav a, .main-nav a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

/* =========================================
   NAVIGATION AND GENERAL BUTTONS
   ========================================= */

function setupGeneralActions() {
  document.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-action]");

    if (actionButton) {
      const action = actionButton.dataset.action;
      const productId = Number(actionButton.dataset.id);

      switch (action) {
        case "add":
          addToCart(productId);
          break;

        case "increase":
          increaseQuantity(productId);
          break;

        case "decrease":
          decreaseQuantity(productId);
          break;

        case "remove":
          removeFromCart(productId);
          break;

        case "wishlist":
          toggleWishlist(productId);
          break;

        case "clear-cart":
          clearCart();
          break;

        case "checkout":
          openCheckout();
          break;

        case "reset-filters":
          resetFilters();
          break;

        case "continue-shopping":
          closeAllModals();

          const menuSection =
            $("#menu") ||
            $("#products") ||
            $("#products-section");

          if (menuSection) {
            menuSection.scrollIntoView({
              behavior: "smooth"
            });
          }

          break;

        case "logout":
          logout();
          break;

        default:
          break;
      }
    }

    const categoryButton = event.target.closest("[data-category]");

    if (categoryButton) {
      setCategory(categoryButton.dataset.category);
    }

    const cartButton = event.target.closest("[data-cart-open]");

    if (cartButton) {
      openElement("#cart-modal");
      openElement("#cart-drawer");
      openElement("#cart-sidebar");
    }

    const wishlistButton = event.target.closest("[data-wishlist-open]");

    if (wishlistButton) {
      renderWishlist();
      openElement("#wishlist-modal");
    }
  });

  $$("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const target = $(button.dataset.scroll);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  $$("a[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
      const targetSelector = link.getAttribute("href");

      if (!targetSelector || targetSelector === "#") {
        event.preventDefault();
        return;
      }

      let target;

      try {
        target = $(targetSelector);
      } catch {
        target = null;
      }

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
}

/* =========================================
   NEWSLETTER DEMO
   ========================================= */

function setupNewsletter() {
  const form =
    $("#newsletter-form") ||
    $(".newsletter-form");

  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const input = form.querySelector(
      'input[type="email"]'
    );

    if (!input || !input.checkValidity()) {
      input?.reportValidity();
      return;
    }

    showToast("Thanks for subscribing to CraveCart!");

    form.reset();
  });
}

/* =========================================
   FOOTER YEAR
   ========================================= */

function setFooterYear() {
  const yearElement =
    $("#current-year") ||
    $("#footer-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  $$("[data-current-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });
}

/* =========================================
   INITIALIZE WEBSITE
   ========================================= */

function initCraveCart() {
  renderCategories();
  renderProducts();

  updateCartUI();
  updateWishlistCount();

  setupSearch();
  setupFilters();
  setupModalEvents();
  setupCheckout();
  setupAuth();
  setupMobileMenu();
  setupGeneralActions();
  setupNewsletter();

  setFooterYear();

  console.log("🍔 CraveCart is ready!");
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initCraveCart
  );
} else {
  initCraveCart();
}
