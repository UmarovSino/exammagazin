document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        document.querySelector("#product-info").innerHTML = "<p>Товар не найден.</p>";
        return;
    }

  
    fetch(`http://localhost:3000/product/${productId}`)
        .then(response => response.json())
        .then(product => {
          
            document.querySelector("#product-info").innerHTML = `
             <img src="${product.image}" alt="${product.title}">
        <div class="info-productpage">
             <h1>${product.name}</h1>
                <h2>price: $${product.price}</h2>
                <p>color: ${product.color}</p>
                <p>storage:${product.storage}</p>
                 <p>accumulyator:${product.acumulyator}</p>
                  <p>brand:${product.brand}</p>
                   <p>processor:${product.processor}</p>
                    <div class="add-to-cart-container">
                        <button class="add-to-cart"><i class="fa-solid fa-basket-shopping"></i></button>
                    </div>
            </div>
            `;
           
           
        })
        .catch(error => {
            console.error("Ошибка загрузки товара:", error);
            document.querySelector("#product-info").innerHTML = "<p>Ошибка загрузки данных о товаре.</p>";
        });


});



