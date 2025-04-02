
document.getElementById('error-message').style.display = 'none';

// Обновите обработку ошибок
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.body.prepend(errorDiv);
}
document.addEventListener("DOMContentLoaded", async () => {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Элементы страницы
    const elements = {
        image: document.getElementById('detail-image'),
        title: document.getElementById('detail-title'),
        price: document.getElementById('detail-price'),
        color: document.getElementById('detail-color'),
        storage: document.getElementById('detail-storage'),
        processor: document.getElementById('detail-processor'),
        battery: document.getElementById('detail-battery'),
        addToCartBtn: document.getElementById('add-to-cart-detail'),
        cartCounter: document.querySelector('.cart-counter')
    };

    // Загрузка данных товара
    const loadProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (!response.ok) throw new Error('Товар не найден');
            
            const product = await response.json();
            
            // Заполняем данные
            elements.image.src = product.image;
            elements.title.textContent = product.name;
            elements.price.textContent = `$${product.price.toFixed(2)}`;
            elements.color.textContent = `Цвет: ${product.color}`;
            elements.storage.textContent = `Память: ${product.storage}GB`;
            elements.processor.textContent = `Процессор: ${product.processor}`;
            elements.battery.textContent = `Аккумулятор: ${product.battery}mAh`;

            // Обновляем счетчик корзины
            updateCartCounter();

        } catch (error) {
            console.error('Ошибка:', error);
            document.body.innerHTML = `<h1 style="text-align:center;padding:2rem">${error.message}</h1>`;
        }
    };

    // Добавление в корзину
    elements.addToCartBtn.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: elements.title.textContent,
                price: parseFloat(elements.price.textContent.replace('$', '')),
                image: elements.image.src,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        showAddedToCartAlert();
    });

    // Вспомогательные функции
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCounter.textContent = total;
    }

    function showAddedToCartAlert() {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
        `;
        alert.textContent = 'Товар добавлен в корзину!';
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 2000);
    }

    // Инициализация
    if (productId) {
        loadProductDetails();
    } else {
        document.body.innerHTML = '<h1 style="text-align:center;padding:2rem">Товар не найден</h1>';
    }
});