const API_URL = 'http://localhost:3000/product';

export const getProducts = async () => {
    let response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ошибка ");
    return await response.json();
};

export const addProduct = async (product) => {
    let response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("товар добавит нашид");
};

export const editProduct = async (id, product) => {
    let response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("редактировать нашид");
};

export const deleteProduct = async (id) => {
    let response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error("продукта удалить намеша");
};
