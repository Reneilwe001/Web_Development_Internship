let cart = [];

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];
    });
}

let orders = JSON.parse(localStorage.getItem("areniaOrders")) || [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    displayCart();
}

const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {
    const button = card.querySelector("button");

    button.addEventListener("click", () => {
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: Number(card.dataset.price),
            image: card.querySelector("img")?.src || ""
        };

        addToCart(product);
    });
});

function displayCart() {
    const cartItems = document.querySelector(".cart-items");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is Waiting</h3>
                <p>Explore our collection and find something you'll love.</p>
            </div>
        `;

        updateCartSummary();
        return;
    }

    cart.forEach(product => {
        const item = document.createElement("div");

        item.classList.add("cart-item");

        
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-product-image">

            <div class="cart-product-details">
                <h3>${product.name}</h3>
                <p>R${product.price.toFixed(2)}</p>

                <div class="quantity-controls">
                    <button onclick="changeQuantity('${product.id}', -1)">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="changeQuantity('${product.id}', 1)">+</button>
                </div>

                <button class="remove-button" onclick="removeFromCart('${product.id}')">
                    Remove
                </button>
            </div>
        `;

        cartItems.appendChild(item);
    });

    updateCartSummary();
}

function changeQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    displayCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);

    displayCart();
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

    document.getElementById("subtotal").textContent =
        `R${subtotal.toFixed(2)}`;

    document.getElementById("shipping").textContent =
        `R${shipping.toFixed(2)}`;

    document.getElementById("total").textContent =
        `R${total.toFixed(2)}`;
}

displayCart();

const checkoutButton = document.querySelector(".checkout-button");

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add products before checkout.");
        return;
    }

    document.getElementById("checkout").scrollIntoView({
        behavior: "smooth"
    });
});

const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty. Please add products before placing an order.");
        return;
    }

    const customerName = document.getElementById("full-name").value;
    const customerEmail = document.getElementById("email").value;
    const customerPhone = document.getElementById("phone").value;
    const deliveryAddress = document.getElementById("address").value;

    const orderTotal = cart.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

    const order = {
        id: Date.now(),
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: deliveryAddress
        },
        products: [...cart],
        total: orderTotal,
        status: "Processing",
        date: new Date().toLocaleString()
    };

    orders.push(order);
    localStorage.setItem("areniaOrders", JSON.stringify(orders));

    alert(
        `Thank you, ${customerName}!\n\n` +
        `Your order has been placed successfully.\n\n` +
        `Email: ${customerEmail}\n` +
        `Phone: ${customerPhone}\n` +
        `Delivery Address: ${deliveryAddress}\n` +
        `Order Total: R${orderTotal.toFixed(2)}`
    );

    cart = [];

    displayCart();

    checkoutForm.reset();
    displayOrders();
});

function displayOrders() {
    const orderList = document.querySelector(".order-list");

    orderList.innerHTML = "";

    if (orders.length === 0) {
        orderList.innerHTML = `
            <div class="empty-orders">
                <h3>No orders yet</h3>
                <p>Customer orders will appear here.</p>
            </div>
        `;
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement("div");

        orderCard.classList.add("order-card");

        const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

        const orderStatus = validStatuses.includes(order.status)
            ? order.status
            : "Processing";

        const purchasedProducts = order.products.map(product => {
            return `${escapeHTML(product.name)} (x${product.quantity})`;
        }).join(", ");

        orderCard.innerHTML = `
            <h3>Order #${order.id}</h3>

            <p><strong>Customer:</strong> ${escapeHTML(order.customer.name)}</p>
            <p><strong>Email:</strong> ${escapeHTML(order.customer.email)}</p>
            <p><strong>Phone:</strong> ${escapeHTML(order.customer.phone)}</p>
            <p><strong>Delivery Address:</strong> ${escapeHTML(order.customer.address)}</p>
            <p><strong>Products:</strong> ${purchasedProducts}</p>
            <p><strong>Order Total:</strong> R${order.total.toFixed(2)}</p>
            <p><strong>Date:</strong> ${order.date}</p>

            <label for="status-${order.id}">Order Status:</label>

            <select id="status-${order.id}" onchange="updateOrderStatus(${order.id}, this.value)">
                <option value="Processing" ${orderStatus === "Processing" ? "selected" : ""}>Processing</option>
                <option value="Shipped" ${orderStatus === "Shipped" ? "selected" : ""}>Shipped</option>
                <option value="Delivered" ${orderStatus === "Delivered" ? "selected" : ""}>Delivered</option>
                <option value="Cancelled" ${orderStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>

            <button class="delete-order-button" onclick="deleteOrder(${order.id})">
                Delete Order
            </button>
        `;

        orderList.appendChild(orderCard);
    });
}

function updateOrderStatus(orderId, newStatus) {
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

    if (!validStatuses.includes(newStatus)) {
        return;
    }

    const order = orders.find(item => item.id === orderId);

    if (order) {
        order.status = newStatus;
        localStorage.setItem("areniaOrders", JSON.stringify(orders));

        displayOrders();

        alert(`Order #${orderId} status updated to ${newStatus}.`);
    }
}

function deleteOrder(orderId) {
    const confirmDelete = confirm("Are you sure you want to delete this order?");

    if (confirmDelete) {
        orders = orders.filter(order => order.id !== orderId);

        localStorage.setItem("areniaOrders", JSON.stringify(orders));

        displayOrders();
    }
}

displayOrders();
