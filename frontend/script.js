const API = "";
const CANONICAL_SIZES = ["small", "medium", "large"];
const SIZE_SHORT_LABEL = {
    small: "S",
    medium: "M",
    large: "L",
};

const pendingOrders = [];
const awaitingConfirmationOrders = [];
let latestSummary = null;
let previousOrders = [];
const confirmedOrderIds = new Set();

function getSizeFullLabel(size) {
    return size[0].toUpperCase() + size.slice(1);
}

function toggleMainViews(showSummary) {
    const menuSection = document.getElementById("menu-section");
    const ordersSection = document.getElementById("orders-section");
    const summarySection = document.getElementById("summary-section");

    menuSection.classList.toggle("hidden", showSummary);
    ordersSection.classList.toggle("hidden", showSummary);
    summarySection.classList.toggle("hidden", !showSummary);
}

function addPendingOrder(entry) {
    pendingOrders.push(entry);
    renderOrdersList();
}

function removePendingOrder(index) {
    pendingOrders.splice(index, 1);
    renderOrdersList();
}

function clearPendingOrders() {
    pendingOrders.length = 0;
    renderOrdersList();
}

function renderOrdersList(errorMessage = "") {
    const list = document.getElementById("orders-list");
    const placeButton = document.getElementById("place-order-btn");
    placeButton.classList.remove("hidden");

    list.innerHTML = "";

    if (errorMessage) {
        list.innerHTML = `<p class="empty-state">${errorMessage}</p>`;
        placeButton.disabled = pendingOrders.length === 0 && awaitingConfirmationOrders.length === 0;
        placeButton.textContent = pendingOrders.length > 0
            ? `Place Your Order (${pendingOrders.length})`
            : awaitingConfirmationOrders.length > 0
                ? `Review Pending (${awaitingConfirmationOrders.length})`
                : "Place Your Order";
        return;
    }

    if (pendingOrders.length === 0 && awaitingConfirmationOrders.length === 0) {
        list.innerHTML = `<p class="empty-state">No items added yet. Pick a drink from the menu.</p>`;
    }

    pendingOrders.forEach((entry, index) => {
        const row = document.createElement("div");
        row.className = "pending-item";
        row.innerHTML = `
            <span>${entry.label}</span>
            <span>$${entry.price.toFixed(2)}</span>
        `;

        const removeButton = document.createElement("button");
        removeButton.className = "pending-remove-btn";
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", () => removePendingOrder(index));

        row.appendChild(removeButton);
        list.appendChild(row);
    });

    awaitingConfirmationOrders.forEach((entry) => {
        const row = document.createElement("div");
        row.className = "pending-item awaiting-item";
        row.innerHTML = `
            <span>${entry.label}</span>
            <span>$${entry.price.toFixed(2)}</span>
        `;

        const status = document.createElement("span");
        status.className = "awaiting-status";
        status.textContent = "Pending";
        row.appendChild(status);
        list.appendChild(row);
    });

    placeButton.disabled = pendingOrders.length === 0 && awaitingConfirmationOrders.length === 0;
    placeButton.textContent = pendingOrders.length > 0
        ? `Place Your Order (${pendingOrders.length})`
        : awaitingConfirmationOrders.length > 0
            ? `Review Pending (${awaitingConfirmationOrders.length})`
            : "Place Your Order";
}

function renderSummary(summary) {
    const itemsContainer = document.getElementById("summary-items");
    const totalContainer = document.getElementById("summary-total");
    const confirmButton = document.getElementById("confirm-summary-btn");

    if (!summary || summary.items.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-state">No items in this summary.</p>';
        totalContainer.textContent = "";
        confirmButton.disabled = true;
        return;
    }

    const list = document.createElement("ul");
    list.className = "summary-list";
    summary.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    itemsContainer.innerHTML = "";
    itemsContainer.appendChild(list);
    totalContainer.textContent = `Total: $${summary.total.toFixed(2)}`;
    confirmButton.disabled = false;
}

function renderPreviousOrders(errorMessage = "") {
    const section = document.getElementById("previous-orders-section");
    const list = document.getElementById("previous-orders-list");

    list.innerHTML = "";

    if (errorMessage) {
        section.classList.remove("hidden");
        list.innerHTML = `<p class="empty-state">${errorMessage}</p>`;
        return;
    }

    if (previousOrders.length === 0) {
        section.classList.add("hidden");
        return;
    }

    section.classList.remove("hidden");
    previousOrders.forEach((order) => {
        const row = document.createElement("div");
        row.className = "previous-order-item";
        row.innerHTML = `
            <span class="previous-order-label">#${order.order_id} ${order.items.join(", ")}</span>
            <span class="previous-order-price">$${order.total_price.toFixed(2)}</span>
        `;
        list.appendChild(row);
    });
}

async function refreshPreviousOrders() {
    try {
        const res = await fetch(`${API}/api/orders`);
        if (!res.ok) throw new Error("Failed to load order history");
        const data = await res.json();
        previousOrders = data.orders.filter((order) => confirmedOrderIds.has(order.order_id));
        renderPreviousOrders();
    } catch (err) {
        renderPreviousOrders("Failed to load previous orders.");
    }
}

function getPreferredSize(item) {
    if (item.sizes.medium) return "medium";
    if (item.sizes.small) return "small";
    if (item.sizes.large) return "large";
    return "medium";
}

function updateCardPrice(item, size, buttonElement) {
    const selectedSize = item.sizes[size] ? size : getPreferredSize(item);
    const selected = item.sizes[selectedSize];

    if (!selected) {
        buttonElement.disabled = true;
        buttonElement.textContent = "Unavailable";
        return;
    }

    buttonElement.disabled = false;
    const sizeLabel = getSizeFullLabel(selectedSize);
    buttonElement.textContent = `Add ${sizeLabel} - $${selected.price.toFixed(2)}`;
}

async function loadMenu() {
    const container = document.getElementById("menu-list");
    try {
        const res = await fetch(`${API}/api/menu`);
        const data = await res.json();
        container.innerHTML = "";

        data.items.forEach((item) => {
            const card = document.createElement("div");
            card.className = "menu-card";

            const title = document.createElement("h3");
            title.textContent = item.name;

            const description = document.createElement("p");
            description.className = "description";
            description.textContent = item.description;

            const label = document.createElement("label");
            label.className = "size-label";
            label.textContent = "Size";

            const sizeOptions = document.createElement("div");
            sizeOptions.className = "size-options";

            let selectedSize = getPreferredSize(item);

            CANONICAL_SIZES.forEach((size) => {
                const sizeInfo = item.sizes[size];
                const sizeButton = document.createElement("button");
                sizeButton.type = "button";
                sizeButton.className = "size-option-btn";
                sizeButton.dataset.size = size;
                const shortLabel = SIZE_SHORT_LABEL[size] || size[0].toUpperCase();
                const priceText = sizeInfo ? `$${sizeInfo.price.toFixed(2)}` : "N/A";
                sizeButton.textContent = `${shortLabel} - ${priceText}`;
                sizeButton.disabled = !sizeInfo;

                if (size === selectedSize) {
                    sizeButton.classList.add("active");
                }

                sizeButton.addEventListener("click", () => {
                    if (sizeButton.disabled) return;
                    selectedSize = size;
                    sizeOptions.querySelectorAll(".size-option-btn").forEach((btn) => {
                        btn.classList.toggle("active", btn.dataset.size === selectedSize);
                    });
                    updateCardPrice(item, selectedSize, button);
                });

                sizeOptions.appendChild(sizeButton);
            });

            const button = document.createElement("button");
            button.className = "order-btn";
            button.textContent = "Order";

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(label);
            card.appendChild(sizeOptions);
            card.appendChild(button);
            container.appendChild(card);

            updateCardPrice(item, selectedSize, button);

            button.addEventListener("click", () => {
                const selected = item.sizes[selectedSize];
                if (!selected) return;
                addPendingOrder({
                    itemId: item.id,
                    size: selectedSize,
                    label: `${getSizeFullLabel(selectedSize)} ${item.name}`,
                    price: selected.price,
                });
            });
        });
    } catch (err) {
        container.innerHTML = `<p class="empty-state">Failed to load menu.</p>`;
    }
}

async function submitOrder(itemId, size) {
    const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, size }),
    });
    if (!res.ok) {
        throw new Error("Order failed");
    }
    const data = await res.json();
    return data.order;
}

async function placePendingOrders() {
    if (pendingOrders.length === 0) {
        if (awaitingConfirmationOrders.length > 0) {
            if (!latestSummary) {
                latestSummary = {
                    items: awaitingConfirmationOrders.map((entry) => entry.label),
                    total: awaitingConfirmationOrders.reduce((sum, entry) => sum + entry.price, 0),
                };
            }
            renderSummary(latestSummary);
            toggleMainViews(true);
        }
        return;
    }

    const placeButton = document.getElementById("place-order-btn");
    placeButton.disabled = true;

    const entriesToPlace = [...pendingOrders];
    const failedEntries = [];
    const successfulOrders = [];

    for (const entry of entriesToPlace) {
        try {
            const order = await submitOrder(entry.itemId, entry.size);
            successfulOrders.push(order);
        } catch (err) {
            failedEntries.push(entry);
        }
    }

    pendingOrders.length = 0;
    pendingOrders.push(...failedEntries);
    renderOrdersList();

    if (successfulOrders.length > 0) {
        const allItems = successfulOrders.flatMap((order) => order.items);
        const total = successfulOrders.reduce((sum, order) => sum + order.total_price, 0);
        successfulOrders.forEach((order) => {
            awaitingConfirmationOrders.push({
                orderId: order.order_id,
                label: order.items.join(", "),
                price: order.total_price,
            });
        });
        latestSummary = { items: allItems, total };
        renderSummary(latestSummary);
        await refreshPreviousOrders();
        toggleMainViews(true);
    }

    if (failedEntries.length > 0) {
        alert(`${failedEntries.length} order(s) failed and are still pending.`);
    }

    placeButton.disabled = false;
}

function returnToMenu() {
    toggleMainViews(false);
    renderOrdersList();
}

async function confirmSummaryOrders() {
    if (awaitingConfirmationOrders.length === 0) {
        returnToMenu();
        return;
    }

    awaitingConfirmationOrders.forEach((entry) => {
        if (entry.orderId !== undefined && entry.orderId !== null) {
            confirmedOrderIds.add(entry.orderId);
        }
    });

    awaitingConfirmationOrders.length = 0;
    latestSummary = null;
    renderSummary(latestSummary);
    toggleMainViews(false);
    renderOrdersList();
    await refreshPreviousOrders();
}

async function placeOrder(itemId, size) {
    try {
        await submitOrder(itemId, size);
        await loadOrders();
    } catch (err) {
        alert("Failed to place order: " + err.message);
    }
}

async function cancelOrder(orderId) {
    try {
        const res = await fetch(`${API}/api/orders/${orderId}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Cancel failed");
        await refreshPreviousOrders();
    } catch (err) {
        alert("Failed to cancel order: " + err.message);
    }
}

async function loadOrders() {
    renderOrdersList();
    await refreshPreviousOrders();
}

// Load on page ready
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("place-order-btn").addEventListener("click", placePendingOrders);
    document.getElementById("confirm-summary-btn").addEventListener("click", confirmSummaryOrders);
    document.getElementById("back-to-menu-btn").addEventListener("click", returnToMenu);
    loadMenu();
    loadOrders();
    clearPendingOrders();
    renderSummary(latestSummary);
    toggleMainViews(false);
});
