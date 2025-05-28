const sampleProducts = [
    { id: 1, name: "Bluetooth Headphones", price: 79.99, category: "electronics", description: "Wireless headphones", icon: "headphones" },
    { id: 2, name: "Noise-Cancelling Earbuds", price: 129.99, category: "electronics", description: "Crystal-clear audio with ANC", icon: "volume-up" },
    { id: 3, name: "Recycled Canvas Tote Bag", price: 19.99, category: "clothing", description: "Reusable and eco-friendly", icon: "shopping-bag" },
    { id: 4, name: "Creative Writing Workbook", price: 29.99, category: "books", description: "Improve your storytelling skills", icon: "pen-nib" }
];

let allProducts = [];
let currentCategory = 'all';
let simulateErrorMode = false;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterProducts();
        });
    });

    document.getElementById('searchInput').addEventListener('input', debounce(filterProducts, 300));

    loadProducts();
});

async function loadProducts() {
    showLoadingState();
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (simulateErrorMode) throw new Error("Simulated error");
        allProducts = [...sampleProducts];
        filterProducts();
    } catch (err) {
        showErrorState(err.message);
    } finally {
        simulateErrorMode = false;
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allProducts.filter(p => 
        (currentCategory === 'all' || p.category === currentCategory) &&
        (p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm))
    );
    if (filtered.length === 0) {
        showEmptyState();
    } else {
        displayProducts(filtered);
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    hideAllStates();
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <i class="fas fa-${product.icon}"></i>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h5>${product.name}</h5>
                    <p>${product.description}</p>
                    <strong>$${product.price}</strong>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showLoadingState() {
    hideAllStates();
    document.getElementById('loadingState').style.display = 'block';
}

function showErrorState(message) {
    hideAllStates();
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorState').style.display = 'block';
}

function showEmptyState() {
    hideAllStates();
    document.getElementById('emptyState').style.display = 'block';
}

function hideAllStates() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('productsContainer').innerHTML = '';
}

function simulateError() {
    simulateErrorMode = true;
    loadProducts();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}