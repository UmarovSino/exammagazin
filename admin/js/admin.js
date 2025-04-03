import { getProducts, addProduct, editProduct, deleteProduct } from './API.js';

document.addEventListener("DOMContentLoaded", () => {
    let elements = {
        productForm: document.getElementById("product-form"),
        productTable: document.getElementById("product-table").querySelector("tbody"),
        nameInput: document.getElementById("name"),
        priceInput: document.getElementById("price"),
        imageInput: document.getElementById("image"),
        brandInput: document.getElementById("brand"),
        acumulyatorInput: document.getElementById("acumulyator"), 
        storageInput: document.getElementById("storage"),
        processorInput: document.getElementById("processor"),
        colorInput: document.getElementById("color")
    };

    let editingProductId = null; 

    const loadProducts = async () => {
        try {
            const products = await getProducts();
            renderProducts(products);
        } catch (error) {
            console.error("Ошибка загрузки:", error);
            alert('Error loading products!');
        }
    };

    const renderProducts = products => {
        elements.productTable.innerHTML = products.map(product => `
            <tr data-id="${product.id}">
                <td>${product.name}</td>
                <td>$${Number(product.price).toFixed(2)}</td>
                <td>${product.brand}</td>
                <td><img src="${product.image}" style="width:50px;height:50px;"></td>
                <td>${product.color}</td>
                <td>${product.storage}</td>
                <td>${product.processor}</td>
                <td>${product.acumulyator}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            </tr>
        `).join('');

        initActionHandlers();
    };

    const initActionHandlers = () => {
        elements.productTable.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", handleEdit);
        });
        
        elements.productTable.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", handleDelete);
        });
    };

    const handleEdit = async (event) => {
        const row = event.target.closest("tr");
        const productId = row.dataset.id;
        
        try {
            const products = await getProducts();
            const product = products.find(p => String(p.id) === productId); 
            
            if (!product) {
                alert('Product not found!');
                return;
            }
            
         
            elements.nameInput.value = product.name;
            elements.priceInput.value = product.price;
            elements.imageInput.value = product.image;
            elements.brandInput.value = product.brand;
            elements.colorInput.value = product.color;
            elements.acumulyatorInput.value = product.acumulyator;
            elements.storageInput.value = product.storage;
            elements.processorInput.value = product.processor;
            
            editingProductId = productId; 
        } catch (error) {
            console.error("Edit error:", error);
        }
    };

    const handleDelete = async (event) => {
        const row = event.target.closest("tr");
        const productId = row.dataset.id;
        
        if (!confirm('Delete this product?')) return;
        
        try {
            await deleteProduct(productId);
            await loadProducts();
        } catch (error) {
            console.error("Delete error:", error);
            alert('Delete failed!');
        }
    };

    elements.productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const productData = {
            name: elements.nameInput.value,
            price: Number(elements.priceInput.value),
            image: elements.imageInput.value,
            brand: elements.brandInput.value,
            acumulyator: elements.acumulyatorInput.value, 
            storage: elements.storageInput.value,
            processor: elements.processorInput.value,
            color: elements.colorInput.value
        };
        
        try {
            if (editingProductId) {
                await editProduct(editingProductId, productData);
            } else {
                await addProduct(productData);
            }
            
            editingProductId = null;
            elements.productForm.reset();
            await loadProducts();
        } catch (error) {
            console.error("Submit error:", error);
            alert('Operation failed!');
        }
    });

    loadProducts();
});