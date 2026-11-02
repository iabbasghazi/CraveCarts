/* ============================================================
   CRAVECART ADMIN STUDIO — ADMIN.JS
   Product Management | Orders | Dashboard | CSV Export
   Storage keys compatible with the CraveCart storefront:
   cravecart_products
   cravecart_orders
============================================================ */

"use strict";

/* ============================================================
   1. CONFIGURATION
============================================================ */

const ADMIN_CONFIG = {
  productsKey: "cravecart_products",
  ordersKey: "cravecart_orders",
  currency: "INR",
  currencySymbol: "₹"
};

const ADMIN_STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled"
];

const ADMIN_SECTION_INFO = {
  overview: {
    title: "Good to see you, Admin.",
    subtitle: "Here's what's happening with your CraveCart store.",
    label: "Overview"
  },

  products: {
    title: "Product Management",
    subtitle: "Manage your menu, pricing, product images, and availability.",
    label: "Products"
  },

  orders: {
    title: "Order Management",
    subtitle: "Review customer orders and update order statuses.",
    label: "Orders"
  },

  "add-product": {
    title: "Create Something Delicious.",
    subtitle: "Add a new vegetarian product to your CraveCart menu.",
    label: "Add Product"
  }
};

let adminProducts = [];
let adminOrders = [];
let adminEditingProductId = null;
let adminActiveSection = "overview";

/* ============================================================
   2. DOM HELPERS
============================================================ */

function adminGet(id) {
  return document.getElementById(id);
}

function adminQuery(selector, parent = document) {
  return parent.querySelector(selector);
}

function adminQueryAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function adminSetText(id, value) {
  const element = adminGet(id);

  if (element) {
    element.textContent = value == null ? "" : String(value);
  }
}

function adminShow(element) {
  if (element) {
    element.classList.remove("hidden");
  }
}

function adminHide(element) {
  if (element) {
    element.classList.add("hidden");
  }
}

function adminEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
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

function adminSafeImageURL(value) {
  const input = String(value ?? "").trim();

  if (!input) {
    return "";
  }

  try {
    const parsed = new URL(input, window.location.href);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "";
    }

    return parsed.href;
  } catch {
    return "";
  }
}

function adminFormatMoney(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: ADMIN_CONFIG.currency,
    maximumFractionDigits: 2
  }).format(number);
}

function adminFormatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function adminMakeId(prefix = "CC") {
  return (
    prefix +
    "-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase()
  );
}

/* ============================================================
   3. LOCAL STORAGE
============================================================ */

function adminReadStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error("CraveCart storage read error:", key, error);
    return fallback;
  }
}

function adminWriteStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("CraveCart storage write error:", key, error);

    adminToast(
      "Data save nahi ho paya. Browser storage full ya unavailable ho sakta hai.",
      "error"
    );

    return false;
  }
}

function adminLoadData() {
  adminProducts = adminReadStorage(
    ADMIN_CONFIG.productsKey,
    []
  );

  adminOrders = adminReadStorage(
    ADMIN_CONFIG.ordersKey,
    []
  );

  /*
   * Product records ko normalize karte hain.
   * Existing storefront product IDs ko preserve karte hain.
   */

  adminProducts = adminProducts
    .filter(product => product && typeof product === "object")
    .map((product, index) => {
      const price = Number(product.price) || 0;

      return {
        ...product,
        id: product.id ?? adminMakeId("PROD"),
        name: String(product.name ?? product.title ?? "Untitled Product"),
        price,
        category: String(product.category ?? "Other"),
        image: String(product.image ?? product.img ?? ""),
        description: String(product.description ?? ""),
        originalPrice: Number(product.originalPrice ?? product.oldPrice ?? price),
        stock: product.stock == null ? 50 : Number(product.stock),
        vegetarian: product.vegetarian !== false,
        available: product.available !== false
      };
    });

  adminOrders = adminOrders
    .filter(order => order && typeof order === "object");

  /*
   * Important:
   * Agar storefront abhi products localStorage mein save nahi karta,
   * to admin page existing hard-coded HTML products ko automatically
   * import nahi kar sakta. Us case mein product records add karne honge.
   */
}

/* ============================================================
   4. TOAST NOTIFICATIONS
============================================================ */

function adminToast(message, type = "success") {
  const container = adminGet("admin-toast-container");

  if (!container) {
    alert(message);
    return;
  }

  const toast = document.createElement("div");

  toast.className = "toast " + (
    type === "error" ? "error" :
    type === "success" ? "success" : ""
  );

  toast.textContent = message;

  container.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(12px)";

    window.setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/* ============================================================
   5. SECTION NAVIGATION
============================================================ */

function adminGoToSection(sectionName) {
  const target = ADMIN_SECTION_INFO[sectionName];

  if (!target) {
    return;
  }

  adminActiveSection = sectionName;

  adminQueryAll(".section-view").forEach(section => {
    section.classList.toggle(
      "active",
      section.id === "section-" + sectionName
    );
  });

  adminQueryAll(".nav-item[data-section]").forEach(button => {
    const isActive = button.dataset.section === sectionName;

    button.classList.toggle("active", isActive);

    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  adminSetText("page-title", target.title);
  adminSetText("page-subtitle", target.subtitle);
  adminSetText("current-section-label", target.label);

  if (sectionName === "overview") {
    adminRenderDashboard();
  }

  if (sectionName === "products") {
    adminRenderProducts();
  }

  if (sectionName === "orders") {
    adminRenderOrders();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ============================================================
   6. DASHBOARD STATISTICS
============================================================ */

function adminGetOrderTotal(order) {
  const possibleTotals = [
    order.total,
    order.grandTotal,
    order.amount,
    order.totalAmount,
    order.finalTotal
  ];

  for (const value of possibleTotals) {
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
}

function adminGetOrderItems(order) {
  if (Array.isArray(order.items)) {
    return order.items;
  }

  if (Array.isArray(order.cart)) {
    return order.cart;
  }

  if (Array.isArray(order.products)) {
    return order.products;
  }

  return [];
}

function adminGetCustomerName(order) {
  return (
    order.customerName ||
    order.name ||
    order.customer?.name ||
    order.shippingAddress?.name ||
    "Guest Customer"
  );
}

function adminGetOrderId(order, index = 0) {
  return String(
    order.id ??
    order.orderId ??
    order.invoiceNumber ??
    "CC-" + String(index + 1).padStart(4, "0")
  );
}

function adminGetOrderDate(order) {
  return (
    order.createdAt ||
    order.date ||
    order.orderDate ||
    order.timestamp ||
    ""
  );
}

function adminGetOrderStatus(order) {
  const status = String(
    order.status ||
    order.orderStatus ||
    "pending"
  ).toLowerCase();

  if (ADMIN_STATUS_OPTIONS.includes(status)) {
    return status;
  }

  if (status === "complete" || status === "completed") {
    return "delivered";
  }

  if (status === "processing") {
    return "preparing";
  }

  return "pending";
}

function adminStatusLabel(status) {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };

  return labels[status] || "Pending";
}

function adminStatusBadge(status) {
  let className = "badge";

  if (status === "delivered" || status === "confirmed") {
    className += " badge-success";
  } else if (status === "cancelled") {
    className += " badge-danger";
  } else {
    className += " badge-warning";
  }

  return (
    '<span class="' + className + '">' +
    adminEscape(adminStatusLabel(status)) +
    "</span>"
  );
}

function adminRenderDashboard() {
  adminSetText("stat-products", adminProducts.length);
  adminSetText("stat-orders", adminOrders.length);

  const totalSales = adminOrders.reduce((sum, order) => {
    const status = adminGetOrderStatus(order);

    if (status === "cancelled") {
      return sum;
    }

    return sum + adminGetOrderTotal(order);
  }, 0);

  adminSetText("stat-sales", adminFormatMoney(totalSales));

  const pendingOrders = adminOrders.filter(order => {
    const status = adminGetOrderStatus(order);

    return status === "pending" || status === "confirmed";
  }).length;

  adminSetText("stat-pending", pendingOrders);

  adminRenderRecentOrders();
  adminRenderActivity();
}

/* ============================================================
   7. RECENT ORDERS
============================================================ */

function adminRenderRecentOrders() {
  const tbody = adminGet("recent-orders-body");
  const empty = adminGet("recent-orders-empty");

  if (!tbody) {
    return;
  }

  const recent = [...adminOrders]
    .sort((a, b) => {
      const dateA = new Date(adminGetOrderDate(a)).getTime() || 0;
      const dateB = new Date(adminGetOrderDate(b)).getTime() || 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  if (!recent.length) {
    tbody.innerHTML = "";

    if (empty) {
      adminShow(empty);
    }

    return;
  }

  if (empty) {
    adminHide(empty);
  }

  tbody.innerHTML = recent.map(order => {
    const originalIndex = adminOrders.indexOf(order);
    const id = adminGetOrderId(order, originalIndex);
    const customer = adminGetCustomerName(order);
    const total = adminGetOrderTotal(order);
    const status = adminGetOrderStatus(order);

    return `
      <tr>
        <td><strong>${adminEscape(id)}</strong></td>
        <td>${adminEscape(customer)}</td>
        <td>${adminEscape(adminFormatMoney(total))}</td>
        <td>${adminStatusBadge(status)}</td>
      </tr>
    `;
  }).join("");
}

/* ============================================================
   8. ACTIVITY FEED
============================================================ */

function adminRenderActivity() {
  const list = adminGet("activity-list");

  if (!list) {
    return;
  }

  const activities = [];

  activities.push({
    title: "Dashboard refreshed",
    description:
      adminProducts.length + " products · " +
      adminOrders.length + " saved orders"
  });

  const recentOrder = [...adminOrders].sort((a, b) => {
    const dateA = new Date(adminGetOrderDate(a)).getTime() || 0;
    const dateB = new Date(adminGetOrderDate(b)).getTime() || 0;

    return dateB - dateA;
  })[0];

  if (recentOrder) {
    activities.push({
      title: "Latest order received",
      description:
        adminGetOrderId(
          recentOrder,
          adminOrders.indexOf(recentOrder)
        ) +
        " · " +
        adminFormatMoney(adminGetOrderTotal(recentOrder))
    });
  }

  if (adminProducts.length) {
    activities.push({
      title: "Menu is ready",
      description: adminProducts.length + " products available in local storage."
    });
  } else {
    activities.push({
      title: "Your menu needs products",
      description: "Add a product to begin building your menu."
    });
  }

  list.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <span class="activity-dot"></span>
      <div>
        <strong>${adminEscape(activity.title)}</strong>
        <p>${adminEscape(activity.description)}</p>
      </div>
    </div>
  `).join("");
}

/* ============================================================
   9. PRODUCT CATEGORY FILTER
============================================================ */

function adminRenderCategoryFilter() {
  const filter = adminGet("product-category-filter");
  const formSelect = adminGet("admin-product-category");

  const currentFilter = filter ? filter.value : "";

  const categories = [...new Set(
    adminProducts
      .map(product => String(product.category || "Other").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  if (filter) {
    filter.innerHTML =
      '<option value="">All categories</option>' +
      categories.map(category => `
        <option value="${adminEscape(category)}">
          ${adminEscape(category)}
        </option>
      `).join("");

    if (categories.includes(currentFilter)) {
      filter.value = currentFilter;
    }
  }

  /*
   * Existing categories ko form select mein add karte hain,
   * lekin current selected category ko unnecessarily reset nahi karte.
   */

  if (formSelect) {
    const existingValues = new Set(
      Array.from(formSelect.options).map(option => option.value)
    );

    categories.forEach(category => {
      if (!existingValues.has(category)) {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        formSelect.appendChild(option);
      }
    });
  }
}

/* ============================================================
   10. PRODUCT TABLE
============================================================ */

function adminRenderProducts() {
  const tbody = adminGet("admin-products-body");
  const empty = adminGet("products-empty");

  if (!tbody) {
    return;
  }

  adminRenderCategoryFilter();

  const searchInput = adminGet("product-search-admin");
  const categoryFilter = adminGet("product-category-filter");

  const search = String(searchInput?.value || "")
    .trim()
    .toLowerCase();

  const category = String(categoryFilter?.value || "");

  const filtered = adminProducts.filter(product => {
    const matchesSearch = [
      product.name,
      product.category,
      product.description,
      product.id
    ].some(value => String(value || "").toLowerCase().includes(search));

    const matchesCategory =
      !category || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (!filtered.length) {
    tbody.innerHTML = "";

    if (empty) {
      adminShow(empty);
    }

    return;
  }

  if (empty) {
    adminHide(empty);
  }

  tbody.innerHTML = filtered.map(product => {
    const id = String(product.id);
    const image = adminSafeImageURL(product.image);
    const price = adminFormatMoney(product.price);

    const stock = Number(product.stock ?? 50);
    const available = product.available !== false && stock > 0;

    const availabilityBadge = available
      ? '<span class="badge badge-success">Available</span>'
      : '<span class="badge badge-danger">Unavailable</span>';

    const safeId = adminEscape(id);

    return `
      <tr>
        <td>
          <div class="product-cell">
            <img
              class="product-thumb"
              src="${adminEscape(image || "https://placehold.co/100x100/202024/ff6b00?text=Food")}"
              alt="${adminEscape(product.name)}"
              loading="lazy"
              onerror="this.onerror=null;this.src='https://placehold.co/100x100/202024/ff6b00?text=Food';"
            >
            <div>
              <div class="product-name">${adminEscape(product.name)}</div>
              <div class="product-category">ID: ${safeId}</div>
            </div>
          </div>
        </td>

        <td><strong>${adminEscape(price)}</strong></td>

        <td>${adminEscape(product.category)}</td>

        <td>${availabilityBadge}</td>

        <td>
          <div class="table-actions">
            <button
              class="icon-button"
              type="button"
              data-edit-product="${safeId}"
              title="Edit product"
              aria-label="Edit ${adminEscape(product.name)}"
            >✎</button>

            <button
              class="icon-button"
              type="button"
              data-toggle-product="${safeId}"
              title="Toggle availability"
              aria-label="Toggle availability for ${adminEscape(product.name)}"
            >${available ? "◉" : "○"}</button>

            <button
              class="icon-button"
              type="button"
              data-delete-product="${safeId}"
              title="Delete product"
              aria-label="Delete ${adminEscape(product.name)}"
            >✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/* ============================================================
   11. PRODUCT FORM PREVIEW
============================================================ */

function adminUpdateProductPreview() {
  const name = adminGet("admin-product-name")?.value.trim();
  const price = adminGet("admin-product-price")?.value;
  const image = adminGet("admin-product-image")?.value.trim();
  const description = adminGet("admin-product-description")?.value.trim();

  adminSetText(
    "admin-preview-name",
    name || "Your product name"
  );

  adminSetText(
    "admin-preview-description",
    description || "Your product description will appear here."
  );

  const numericPrice = Number(price) || 0;

  adminSetText(
    "admin-preview-price",
    adminFormatMoney(numericPrice)
  );

  const preview = adminGet("admin-image-preview");

  if (preview && image) {
    const safeImage = adminSafeImageURL(image);

    if (safeImage) {
      preview.src = safeImage;
    }
  } else if (preview && !image) {
    preview.src =
      "https://placehold.co/600x400/202024/ff6b00?text=Food+Preview";
  }
}

/* ============================================================
   12. RESET PRODUCT FORM
============================================================ */

function adminResetProductForm() {
  const form = adminGet("admin-product-form");

  if (form) {
    form.reset();
  }

  adminEditingProductId = null;

  if (adminGet("admin-product-id")) {
    adminGet("admin-product-id").value = "";
  }

  if (adminGet("admin-product-stock")) {
    adminGet("admin-product-stock").value = "50";
  }

  adminSetText("product-form-title", "Add New Product");
  adminSetText("save-product-button", "＋ Save Product");

  adminHide(adminGet("cancel-edit-product"));

  adminUpdateProductPreview();
}

/* ============================================================
   13. SAVE PRODUCT
============================================================ */

function adminSaveProduct(event) {
  event.preventDefault();

  const name = adminGet("admin-product-name")?.value.trim();
  const price = Number(adminGet("admin-product-price")?.value);
  const originalPriceInput = adminGet("admin-product-original-price")?.value;
  const category = adminGet("admin-product-category")?.value.trim();
  const imageInput = adminGet("admin-product-image")?.value.trim();
  const description = adminGet("admin-product-description")?.value.trim();
  const badge = adminGet("admin-product-badge")?.value || "";
  const stockInput = adminGet("admin-product-stock")?.value;

  const stock = stockInput === "" ? 0 : Number(stockInput);
  const image = adminSafeImageURL(imageInput);

  if (!name) {
    adminToast("Product ka naam enter karo.", "error");
    adminGet("admin-product-name")?.focus();
    return;
  }

  if (!Number.isFinite(price) || price <= 0 || price > 100000) {
    adminToast("Valid product price enter karo.", "error");
    adminGet("admin-product-price")?.focus();
    return;
  }

  if (!category) {
    adminToast("Product category select karo.", "error");
    adminGet("admin-product-category")?.focus();
    return;
  }

  if (!image) {
    adminToast("Valid HTTP ya HTTPS image URL enter karo.", "error");
    adminGet("admin-product-image")?.focus();
    return;
  }

  if (!Number.isFinite(stock) || stock < 0 || stock > 100000) {
    adminToast("Valid stock quantity enter karo.", "error");
    adminGet("admin-product-stock")?.focus();
    return;
  }

  const originalPrice = originalPriceInput === ""
    ? price
    : Number(originalPriceInput);

  if (
    !Number.isFinite(originalPrice) ||
    originalPrice < 0 ||
    originalPrice > 100000
  ) {
    adminToast("Original price valid enter karo.", "error");
    return;
  }

  const existingProduct = adminEditingProductId
    ? adminProducts.find(product =>
        String(product.id) === String(adminEditingProductId)
      )
    : null;

  const product = {
    ...(existingProduct || {}),

    id: existingProduct
      ? existingProduct.id
      : adminMakeId("PROD"),

    name,
    title: name,

    price,
    originalPrice,

    category,
    image,

    description,
    badge,

    stock,

    available: stock > 0,

    vegetarian: true,

    updatedAt: new Date().toISOString()
  };

  let nextProducts;

  if (existingProduct) {
    nextProducts = adminProducts.map(item =>
      String(item.id) === String(existingProduct.id)
        ? product
        : item
    );
  } else {
    product.createdAt = new Date().toISOString();

    nextProducts = [...adminProducts, product];
  }

  if (!adminWriteStorage(ADMIN_CONFIG.productsKey, nextProducts)) {
    return;
  }

  adminProducts = nextProducts;

  adminRenderProducts();
  adminRenderDashboard();
  adminResetProductForm();

  adminToast(
    existingProduct
      ? "Product successfully update ho gaya!"
      : "Naya product successfully add ho gaya!",
    "success"
  );

  adminGoToSection("products");
}

/* ============================================================
   14. EDIT PRODUCT
============================================================ */

function adminEditProduct(productId) {
  const product = adminProducts.find(item =>
    String(item.id) === String(productId)
  );

  if (!product) {
    adminToast("Product nahi mila.", "error");
    return;
  }

  adminEditingProductId = product.id;

  adminGet("admin-product-id").value = String(product.id);
  adminGet("admin-product-name").value = product.name || "";
  adminGet("admin-product-price").value = product.price ?? "";
  adminGet("admin-product-original-price").value =
    product.originalPrice ?? product.price ?? "";

  adminGet("admin-product-category").value =
    product.category || "";

  /*
   * Agar purane product ki category form dropdown mein nahi hai,
   * to temporary option add kar dete hain.
   */

  const categorySelect = adminGet("admin-product-category");

  if (
    categorySelect &&
    !Array.from(categorySelect.options).some(
      option => option.value === product.category
    )
  ) {
    const option = document.createElement("option");

    option.value = product.category;
    option.textContent = product.category;

    categorySelect.appendChild(option);
    categorySelect.value = product.category;
  }

  adminGet("admin-product-stock").value =
    product.stock ?? 50;

  adminGet("admin-product-image").value =
    product.image || "";

  adminGet("admin-product-description").value =
    product.description || "";

  adminGet("admin-product-badge").value =
    product.badge || "";

  adminSetText("product-form-title", "Edit Product");
  adminSetText("save-product-button", "✓ Update Product");

  adminShow(adminGet("cancel-edit-product"));

  adminUpdateProductPreview();

  adminGoToSection("add-product");

  adminGet("admin-product-name")?.focus();
}

/* ============================================================
   15. DELETE PRODUCT
============================================================ */

function adminDeleteProduct(productId) {
  const product = adminProducts.find(item =>
    String(item.id) === String(productId)
  );

  if (!product) {
    adminToast("Product nahi mila.", "error");
    return;
  }

  const confirmed = window.confirm(
    'Kya tum "' + product.name + '" ko menu se delete karna chahte ho?'
  );

  if (!confirmed) {
    return;
  }

  const nextProducts = adminProducts.filter(item =>
    String(item.id) !== String(productId)
  );

  if (!adminWriteStorage(ADMIN_CONFIG.productsKey, nextProducts)) {
    return;
  }

  adminProducts = nextProducts;

  adminRenderProducts();
  adminRenderDashboard();

  adminToast("Product delete ho gaya.", "success");
}

/* ============================================================
   16. TOGGLE PRODUCT AVAILABILITY
============================================================ */

function adminToggleProduct(productId) {
  const index = adminProducts.findIndex(item =>
    String(item.id) === String(productId)
  );

  if (index === -1) {
    adminToast("Product nahi mila.", "error");
    return;
  }

  const product = {
    ...adminProducts[index]
  };

  if (product.stock <= 0 && product.available === false) {
    product.stock = 1;
  }

  product.available = product.available === false;

  const nextProducts = [...adminProducts];

  nextProducts[index] = product;

  if (!adminWriteStorage(ADMIN_CONFIG.productsKey, nextProducts)) {
    return;
  }

  adminProducts = nextProducts;

  adminRenderProducts();
  adminRenderDashboard();

  adminToast(
    product.available
      ? "Product available kar diya gaya."
      : "Product unavailable kar diya gaya.",
    "success"
  );
}

/* ============================================================
   17. ORDER TABLE
============================================================ */

function adminRenderOrders() {
  const tbody = adminGet("admin-orders-body");
  const empty = adminGet("orders-empty");

  if (!tbody) {
    return;
  }

  const search = String(
    adminGet("order-search")?.value || ""
  ).trim().toLowerCase();

  const statusFilter = String(
    adminGet("order-status-filter")?.value || ""
  ).toLowerCase();

  const filtered = adminOrders
    .map((order, index) => ({
      order,
      index
    }))
    .filter(({ order, index }) => {
      const id = adminGetOrderId(order, index);
      const customer = adminGetCustomerName(order);
      const phone = String(
        order.customerPhone ||
        order.phone ||
        order.customer?.phone ||
        ""
      );

      const matchesSearch = [
        id,
        customer,
        phone
      ].some(value =>
        String(value).toLowerCase().includes(search)
      );

      const matchesStatus =
        !statusFilter ||
        adminGetOrderStatus(order) === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(adminGetOrderDate(a.order)).getTime() || 0;
      const dateB = new Date(adminGetOrderDate(b.order)).getTime() || 0;

      return dateB - dateA;
    });

  if (!filtered.length) {
    tbody.innerHTML = "";

    if (empty) {
      adminShow(empty);
    }

    return;
  }

  if (empty) {
    adminHide(empty);
  }

  tbody.innerHTML = filtered.map(({ order, index }) => {
    const id = adminGetOrderId(order, index);
    const customer = adminGetCustomerName(order);
    const date = adminFormatDate(adminGetOrderDate(order));
    const total = adminGetOrderTotal(order);
    const status = adminGetOrderStatus(order);
    const items = adminGetOrderItems(order);

    const itemCount = items.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 1);
    }, 0);

    const statusOptions = ADMIN_STATUS_OPTIONS.map(option => `
      <option
        value="${option}"
        ${option === status ? "selected" : ""}
      >${adminEscape(adminStatusLabel(option))}</option>
    `).join("");

    return `
      <tr>
        <td><strong>${adminEscape(id)}</strong></td>

        <td>${adminEscape(customer)}</td>

        <td>${adminEscape(date)}</td>

        <td>${itemCount}</td>

        <td><strong>${adminEscape(adminFormatMoney(total))}</strong></td>

        <td>
          <select
            class="order-status-select"
            data-order-status="${index}"
            aria-label="Change status for ${adminEscape(id)}"
          >
            ${statusOptions}
          </select>
        </td>

        <td>
          <div class="table-actions">
            <button
              class="icon-button"
              type="button"
              data-view-order="${index}"
              title="View order"
              aria-label="View order ${adminEscape(id)}"
            >⌕</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/* ============================================================
   18. UPDATE ORDER STATUS
============================================================ */

function adminUpdateOrderStatus(orderIndex, newStatus) {
  const index = Number(orderIndex);

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= adminOrders.length
  ) {
    adminToast("Order nahi mila.", "error");
    return;
  }

  if (!ADMIN_STATUS_OPTIONS.includes(newStatus)) {
    adminToast("Invalid order status.", "error");
    return;
  }

  const nextOrders = [...adminOrders];

  nextOrders[index] = {
    ...nextOrders[index],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  if (!adminWriteStorage(ADMIN_CONFIG.ordersKey, nextOrders)) {
    return;
  }

  adminOrders = nextOrders;

  adminRenderOrders();
  adminRenderDashboard();

  adminToast(
    "Order status: " + adminStatusLabel(newStatus),
    "success"
  );
}

/* ============================================================
   19. ORDER DETAILS MODAL
============================================================ */

function adminOpenOrderModal(orderIndex) {
  const index = Number(orderIndex);
  const order = adminOrders[index];

  if (!order) {
    adminToast("Order details nahi mile.", "error");
    return;
  }

  const backdrop = adminGet("order-modal-backdrop");
  const content = adminGet("order-modal-content");

  if (!backdrop || !content) {
    adminToast("Order details panel unavailable hai.", "error");
    return;
  }

  const items = adminGetOrderItems(order);

  const itemMarkup = items.length
    ? items.map(item => {
        const name = item.name || item.title || "Product";
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;

        return `
          <div style="display:flex;justify-content:space-between;gap:15px;padding:9px 0;border-bottom:1px solid #2b2b31">
            <div>
              <strong>${adminEscape(name)}</strong>
              <div style="color:#92929d;font-size:11px">Qty: ${quantity}</div>
            </div>
            <strong>${adminEscape(adminFormatMoney(price * quantity))}</strong>
          </div>
        `;
      }).join("")
    : '<p style="color:#92929d">Item details available nahi hain.</p>';

  const address =
    order.address ||
    order.customerAddress ||
    order.customer?.address ||
    order.shippingAddress?.address ||
    "";

  const city =
    order.city ||
    order.customer?.city ||
    order.shippingAddress?.city ||
    "";

  const phone =
    order.phone ||
    order.customerPhone ||
    order.customer?.phone ||
    "";

  const email =
    order.email ||
    order.customerEmail ||
    order.customer?.email ||
    "";

  const status = adminGetOrderStatus(order);

  content.innerHTML = `
    <div style="display:grid;gap:12px">
      <div>
        <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Order ID</div>
        <strong>${adminEscape(adminGetOrderId(order, index))}</strong>
      </div>

      <div>
        <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Customer</div>
        <strong>${adminEscape(adminGetCustomerName(order))}</strong>
      </div>

      ${phone ? `
        <div>
          <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Phone</div>
          <strong>${adminEscape(phone)}</strong>
        </div>
      ` : ""}

      ${email ? `
        <div>
          <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Email</div>
          <strong>${adminEscape(email)}</strong>
        </div>
      ` : ""}

      ${address || city ? `
        <div>
          <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Delivery Address</div>
          <strong>${adminEscape([address, city].filter(Boolean).join(", "))}</strong>
        </div>
      ` : ""}

      <div>
        <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Order Date</div>
        <strong>${adminEscape(adminFormatDate(adminGetOrderDate(order)))}</strong>
      </div>

      <div>
        <div style="color:#92929d;font-size:10px;text-transform:uppercase;letter-spacing:1px">Status</div>
        ${adminStatusBadge(status)}
      </div>

      <hr>

      <div>
        <h3 style="margin:0 0 8px;font-size:14px">Order Items</h3>
        ${itemMarkup}
      </div>

      <div style="display:flex;justify-content:space-between;gap:15px;padding-top:10px">
        <strong>Order Total</strong>
        <strong style="color:#ff8a36;font-size:18px">${adminEscape(adminFormatMoney(adminGetOrderTotal(order)))}</strong>
      </div>
    </div>
  `;

  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function adminCloseOrderModal() {
  adminGet("order-modal-backdrop")?.classList.remove("open");

  document.body.style.overflow = "";
}

/* ============================================================
   20. EXPORT ORDERS TO CSV
============================================================ */

function adminDownloadCSV(filename, rows) {
  if (!rows.length) {
    adminToast("Export karne ke liye data nahi hai.", "error");
    return;
  }

  const escapeCSV = value => {
    let text = String(value ?? "");

    /*
     * Spreadsheet formula injection se bachne ke liye
     * dangerous leading characters ko neutralize karte hain.
     */

    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) {
      text = "'" + text;
    }

    return '"' + text.replace(/"/g, '""') + '"';
  };

  const csv = "\uFEFF" + rows
    .map(row => row.map(escapeCSV).join(","))
    .join("\r\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  adminToast("CSV file export ho gayi.", "success");
}

function adminExportOrders() {
  const rows = [
    [
      "Order ID",
      "Customer",
      "Phone",
      "Email",
      "Date",
      "Status",
      "Items",
      "Total INR"
    ]
  ];

  adminOrders.forEach((order, index) => {
    const items = adminGetOrderItems(order);

    const itemDescription = items.map(item => {
      const name = item.name || item.title || "Product";
      const quantity = Number(item.quantity) || 1;

      return name + " x " + quantity;
    }).join("; ");

    rows.push([
      adminGetOrderId(order, index),
      adminGetCustomerName(order),
      order.phone || order.customerPhone || order.customer?.phone || "",
      order.email || order.customerEmail || order.customer?.email || "",
      adminFormatDate(adminGetOrderDate(order)),
      adminStatusLabel(adminGetOrderStatus(order)),
      itemDescription,
      adminGetOrderTotal(order)
    ]);
  });

  adminDownloadCSV(
    "cravecart-orders-" + new Date().toISOString().slice(0, 10) + ".csv",
    rows
  );
}

/* ============================================================
   21. EXPORT PRODUCTS TO CSV
============================================================ */

function adminExportProducts() {
  const rows = [
    [
      "Product ID",
      "Name",
      "Category",
      "Price INR",
      "Original Price INR",
      "Stock",
      "Available",
      "Image URL",
      "Description"
    ]
  ];

  adminProducts.forEach(product => {
    rows.push([
      product.id,
      product.name,
      product.category,
      product.price,
      product.originalPrice,
      product.stock,
      product.available !== false ? "Yes" : "No",
      product.image,
      product.description
    ]);
  });

  adminDownloadCSV(
    "cravecart-products-" + new Date().toISOString().slice(0, 10) + ".csv",
    rows
  );
}

/* ============================================================
   22. STORE EVENTS
============================================================ */

function adminSetupNavigation() {
  adminQueryAll(".nav-item[data-section]").forEach(button => {
    button.addEventListener("click", () => {
      adminGoToSection(button.dataset.section);
    });
  });

  adminQueryAll("[data-go-section]").forEach(button => {
    button.addEventListener("click", () => {
      adminGoToSection(button.dataset.goSection);
    });
  });

  adminGet("top-add-product")?.addEventListener("click", () => {
    adminResetProductForm();
    adminGoToSection("add-product");
  });
}

function adminSetupProductForm() {
  const form = adminGet("admin-product-form");

  form?.addEventListener("submit", adminSaveProduct);

  [
    "admin-product-name",
    "admin-product-price",
    "admin-product-image",
    "admin-product-description"
  ].forEach(id => {
    adminGet(id)?.addEventListener("input", adminUpdateProductPreview);
  });

  adminGet("reset-product-form")?.addEventListener("click", () => {
    adminResetProductForm();
    adminToast("Form clear kar diya gaya.", "success");
  });

  adminGet("cancel-edit-product")?.addEventListener("click", () => {
    adminResetProductForm();
    adminGoToSection("products");
  });

  adminGet("admin-product-image")?.addEventListener("change", () => {
    adminUpdateProductPreview();
  });
}

function adminSetupProductTable() {
  adminGet("product-search-admin")?.addEventListener("input", () => {
    adminRenderProducts();
  });

  adminGet("product-category-filter")?.addEventListener("change", () => {
    adminRenderProducts();
  });

  adminGet("refresh-products")?.addEventListener("click", () => {
    adminLoadData();
    adminRenderProducts();
    adminRenderDashboard();

    adminToast("Product list refresh ho gayi.", "success");
  });

  adminGet("admin-products-body")?.addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit-product]");
    const deleteButton = event.target.closest("[data-delete-product]");
    const toggleButton = event.target.closest("[data-toggle-product]");

    if (editButton) {
      adminEditProduct(editButton.dataset.editProduct);
      return;
    }

    if (deleteButton) {
      adminDeleteProduct(deleteButton.dataset.deleteProduct);
      return;
    }

    if (toggleButton) {
      adminToggleProduct(toggleButton.dataset.toggleProduct);
    }
  });
}

function adminSetupOrders() {
  adminGet("order-search")?.addEventListener("input", () => {
    adminRenderOrders();
  });

  adminGet("order-status-filter")?.addEventListener("change", () => {
    adminRenderOrders();
  });

  adminGet("admin-orders-body")?.addEventListener("change", event => {
    const select = event.target.closest("[data-order-status]");

    if (select) {
      adminUpdateOrderStatus(
        select.dataset.orderStatus,
        select.value
      );
    }
  });

  adminGet("admin-orders-body")?.addEventListener("click", event => {
    const button = event.target.closest("[data-view-order]");

    if (button) {
      adminOpenOrderModal(button.dataset.viewOrder);
    }
  });

  adminGet("export-orders")?.addEventListener("click", adminExportOrders);

  adminGet("export-orders-page")?.addEventListener("click", adminExportOrders);

  adminGet("order-modal-backdrop")?.addEventListener("click", event => {
    if (event.target.id === "order-modal-backdrop") {
      adminCloseOrderModal();
    }
  });

  adminQueryAll("[data-close-order-modal]").forEach(button => {
    button.addEventListener("click", adminCloseOrderModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      adminCloseOrderModal();
    }
  });
}

/* ============================================================
   23. BROWSER STORAGE SYNC
============================================================ */

function adminSetupStorageSync() {
  /*
   * Storage events doosre tabs/windows ke changes detect karte hain.
   * Same tab mein storefront ke changes storage event fire nahi karte.
   */

  window.addEventListener("storage", event => {
    if (
      event.key === ADMIN_CONFIG.productsKey ||
      event.key === ADMIN_CONFIG.ordersKey ||
      event.key === null
    ) {
      adminLoadData();
      adminRenderDashboard();
      adminRenderProducts();
      adminRenderOrders();
    }
  });

  /*
   * Page par wapas aane par data reload.
   */

  window.addEventListener("focus", () => {
    adminLoadData();
    adminRenderDashboard();
    adminRenderProducts();
    adminRenderOrders();
  });
}

/* ============================================================
   24. INITIALIZATION
============================================================ */

function adminInitialize() {
  adminSetText("admin-year", new Date().getFullYear());

  adminLoadData();

  adminSetupNavigation();
  adminSetupProductForm();
  adminSetupProductTable();
  adminSetupOrders();
  adminSetupStorageSync();

  adminRenderDashboard();
  adminRenderProducts();
  adminRenderOrders();
  adminUpdateProductPreview();

  adminGet("export-orders")?.setAttribute(
    "title",
    "Download saved orders as CSV"
  );

  /*
   * Product export shortcut: double-click the Products heading
   * is intentionally not used; export stays available through
   * the explicit button created below.
   */

  const productsPanelHeader = adminQuery(
    "#section-products .panel-header"
  );

  if (
    productsPanelHeader &&
    !adminGet("export-products-button")
  ) {
    const button = document.createElement("button");

    button.type = "button";
    button.id = "export-products-button";
    button.className = "button";
    button.textContent = "⬇ Export Products";

    button.addEventListener("click", adminExportProducts);

    productsPanelHeader.appendChild(button);
  }

  adminToast("CraveCart Admin Studio ready hai.", "success");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", adminInitialize);
} else {
  adminInitialize();
}

/* ============================================================
   25. PUBLIC API
============================================================ */

window.CraveCartAdmin = {
  refresh() {
    adminLoadData();
    adminRenderDashboard();
    adminRenderProducts();
    adminRenderOrders();
  },

  goToSection: adminGoToSection,

  addProduct(product) {
    if (!product || typeof product !== "object") {
      return false;
    }

    const name = String(product.name || "").trim();
    const price = Number(product.price);
    const image = adminSafeImageURL(product.image);

    if (!name || !Number.isFinite(price) || price <= 0 || !image) {
      return false;
    }

    const newProduct = {
      id: product.id ?? adminMakeId("PROD"),
      name,
      title: name,
      price,
      originalPrice: Number(product.originalPrice ?? price),
      category: String(product.category || "Other"),
      image,
      description: String(product.description || ""),
      badge: String(product.badge || ""),
      stock: Number(product.stock ?? 50),
      available: product.available !== false,
      vegetarian: true,
      createdAt: new Date().toISOString()
    };

    const nextProducts = [...adminProducts, newProduct];

    if (!adminWriteStorage(ADMIN_CONFIG.productsKey, nextProducts)) {
      return false;
    }

    adminProducts = nextProducts;

    adminRenderDashboard();
    adminRenderProducts();

    return true;
  }
};
