///ин логика барои рандомно вибр кардани элемент аз api мегира ва мемонашон
async function loadRandomProducts() {
    try {

        let response = await fetch('http://localhost:3000/product');
        let products = await response.json();


        if (Array.isArray(products) && products.length > 0) {

            let randomProducts = getRandomItems(products, 3);


            let mainContainer = document.querySelector('.main');
            mainContainer.innerHTML = '';


            randomProducts.forEach(product => {
                let productElement = document.createElement('article');
                productElement.classList.add('product-item');
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                `;
                mainContainer.appendChild(productElement);
            });
        } else {
            console.log('товар нест');
        }
    } catch (error) {
        console.error( error);
    }
}


function getRandomItems(arr, n) {
    let element = arr.slice();
    for (let i = element.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [element[i], element[j]] = [element[j], element[i]];
    }
    return element.slice(0, n);
}

document.querySelector('.allproducts').addEventListener('click', loadRandomProducts);
window.addEventListener('load', loadRandomProducts);

