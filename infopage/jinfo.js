document.addEventListener("DOMContentLoaded", () => {
    // Извлекаем параметр ID из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.querySelector("#product-info").innerHTML = "<p>Товар не найден.</p>";
        return;
    }

    // Загружаем данные товара с сервера
    fetch(`http://localhost:3000/product/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Отображаем данные о товаре
            document.querySelector("#product-info").innerHTML = `
                <h1>${product.title}</h1>
                <img src="${product.image}" alt="${product.title}">
                <p>Цена: $${product.price}</p>
                <p>Описание: ${product.description}</p>
            `;
        })
        .catch(error => {
            console.error("Ошибка загрузки товара:", error);
            document.querySelector("#product-info").innerHTML = "<p>Ошибка загрузки данных о товаре.</p>";
        });
});
