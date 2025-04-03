document.addEventListener("DOMContentLoaded", () => {
    let elements = {
        cartCounter: document.querySelector(".cart-counter"),
        cartItemsContainer: document.querySelector(".cart-items"),
        orderSummary: document.querySelector(".order-summary span"),
        modalBackdrop: document.querySelector(".modal-backdrop"),
        closeModal: document.querySelector(".close-modal"),
        cartBtn: document.querySelector(".cart-btn"),
        productsContainer: document.querySelector(".page-asaide"),
        priceRange: document.getElementById("priceRange"),
        priceDisplay: document.getElementById("priceDisplay"),
        searchInput: document.querySelector(".search"),
        selectProduct: document.querySelector(".selectproduct"),
        checkoutbtn: document.querySelector(".checkout-btn")
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartManager = {
        addItem: product => {
            const existingItem = cart.find(item => item.id === String(product.id));
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1, id: String(product.id) });
            }
            cartManager.updateCart();
        },
        updateQuantity: (id, change) => {
            const item = cart.find(item => item.id === String(id));
            if (!item) return;
            item.quantity += change;
            if (item.quantity < 1) {
                cartManager.removeItem(id);
            } else {
                cartManager.updateCart();
            }
        },
        removeItem: id => {
            cart = cart.filter(item => item.id !== String(id));
            cartManager.updateCart();
        },
        updateCart: () => {
            localStorage.setItem("cart", JSON.stringify(cart));
            cartManager.updateCartUI();
        },
        updateCartUI: () => {
            elements.cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            renderCartItems();
            updateOrderSummary();
        }
    };

    let renderCartItems = () => {
        elements.cartItemsContainer.innerHTML = cart.map(item => `
            <li class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrement" data-action="decrement">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increment" data-action="increment">+</button>
                    </div>
                    <p class="item-total">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-action="remove">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `).join('');
    };

    elements.cartItemsContainer.addEventListener("click", e => {
        const target = e.target.closest("[data-action]");
        if (!target) return;
        const action = target.dataset.action;
        const itemId = target.closest(".cart-item")?.dataset.id;
        if (!itemId) return;
        switch (action) {
            case 'increment':
                cartManager.updateQuantity(String(itemId), 1);
                break;
            case 'decrement':
                cartManager.updateQuantity(String(itemId), -1);
                break;
            case 'remove':
                cartManager.removeItem(String(itemId));
                break;
        }
    });

    let updateOrderSummary = () => {
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity, 10) || 0;
            return sum + (price * quantity);
        }, 0);

        elements.orderSummary.textContent = `$${total.toFixed(2)}`;
    };

    elements.cartBtn.addEventListener("click", () => elements.modalBackdrop.style.display = "flex");
    elements.closeModal.addEventListener("click", () => elements.modalBackdrop.style.display = "none");
    elements.modalBackdrop.addEventListener("click", e => e.target === elements.modalBackdrop && (elements.modalBackdrop.style.display = "none"));

    elements.checkoutbtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("корзинаи шумо холи аст!");
            return;
        }
        
        if (confirm("Фармоиши худро тасдиқ кунед?")) {
            cart = [];
            cartManager.updateCart();
            elements.modalBackdrop.style.display = "none";
            alert("харид бомуваффакият гзашт! Раҳмат барои харид!");
        }
    });

    cartManager.updateCartUI();

    let loadProducts = async () => {
        try {
            let response = await fetch('http://localhost:3000/product');
            let products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Ошибка загрузки продуктов:", error);
        }
    };

    let renderProducts = (products) => {
        elements.productsContainer.innerHTML = products.map(product => `
            <article class="product-card" data-id="${product.id}" data-price="${parseFloat(product.price) || 0}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                    <div class="add-to-cart-container">
                        <button class="add-to-cart"><i class="fa-solid fa-basket-shopping"></i></button>
                        <a href="http://127.0.0.1:5500/infopage/html.html?id=${product.id}" class="view-details"><i class="fa-solid fa-circle-info"></i></a>
                    </div>
                </div>
            </article>
        `).join('');
        initProductHandlers();
    };

    let initProductHandlers = () => {
        elements.productsContainer.addEventListener("click", (e) => {
            const addButton = e.target.closest(".add-to-cart");
            if (!addButton) return;
            const productCard = addButton.closest(".product-card");
            const productData = {
                id: productCard.dataset.id,
                name: productCard.querySelector(".product-title").textContent,
                price: parseFloat(productCard.dataset.price),
                image: productCard.querySelector(".product-image").src
            };
            cartManager.addItem(productData);
        });
    };

    if (elements.priceRange) {
        elements.priceRange.addEventListener("input", () => {
            const maxPrice = parseFloat(elements.priceRange.value);
            elements.priceDisplay.textContent = `€${maxPrice}`;
            document.querySelectorAll(".product-card").forEach(card => {
                const productPrice = parseFloat(card.dataset.price) || 0;
                card.style.display = productPrice <= maxPrice ? "block" : "none";
            });
        });
    }

    if (elements.searchInput) {
        elements.searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll(".product-card").forEach(product => {
                const productName = product.querySelector(".product-title").textContent.toLowerCase();
                product.style.display = productName.includes(query) ? "block" : "none";
            });
        });
    }

    if (elements.selectProduct) {
        elements.selectProduct.addEventListener("change", (e) => {
            const category = e.target.value.toLowerCase();
            document.querySelectorAll(".product-card").forEach(product => {
                const productCategory = product.dataset.category || "";
                product.style.display = category == "all" || productCategory === category ? "block" : "none";
            });
        });
    }

    loadProducts();
});
