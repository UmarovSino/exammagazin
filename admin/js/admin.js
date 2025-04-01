import { getProducts, addProduct, editProduct, deleteProduct } from './API.js';

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        productForm: document.getElementById("product-form"),
        productTable: document.getElementById("product-table").querySelector("tbody"),
        nameInput: document.getElementById("name"),
        priceInput: document.getElementById("price"),
        imageInput: document.getElementById("image"),
        brandInput: document.getElementById("brand")
    };

    let editingProductId = null;

  
    const loadProducts = async () => {
        try {
            const products = await getProducts();
            renderProducts(products);
        } catch (error) {
            console.error("Ошибка загрузки продуктов:", error);
        }
    };

    const renderProducts = products => {
        elements.productTable.innerHTML = products.map(product => `
            <tr data-id="${product.id}">
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.brand}</td>
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;"></td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            </tr>
        `).join('');

        initActionHandlers();
    };

   
    const initActionHandlers = () => {
        elements.productTable.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEdit);
        });

        elements.productTable.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
    };

    const handleEdit = async (event) => {
        const row = event.target.closest("tr");
        const productId = row.dataset.id;

        const products = await getProducts();
        const product = products.find(p => p.id === productId);

        if (product) {
            elements.nameInput.value = product.name;
            elements.priceInput.value = product.price;
            elements.imageInput.value = product.image;
            elements.brandInput.value = product.brand;
            editingProductId = productId;
        }
    };

    const handleDelete = async (event) => {
        const row = event.target.closest("tr");
        const productId = row.dataset.id;

        try {
            await deleteProduct(productId);
            loadProducts();
        } catch (error) {
            console.error("Ошибка при удалении продукта:", error);
        }
    };

   
    elements.productForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const productData = {
            name: elements.nameInput.value,
            price: parseFloat(elements.priceInput.value),
            image: elements.imageInput.value,
            brand: elements.brandInput.value
        };

        try {
            if (editingProductId) {
                await editProduct(editingProductId, productData);
            } else {
                await addProduct(productData);
            }
            editingProductId = null;
            elements.productForm.reset();
            loadProducts();
        } catch (error) {
            console.error( error);
        }
    });

   
    loadProducts();
});
