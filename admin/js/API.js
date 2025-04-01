const API_URL = 'http://localhost:3000/product';

export const getProducts = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Ошибка получения данных");
    return await response.json();
};

export const addProduct = async (product) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("Ошибка добавления продукта");
};

export const editProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("Ошибка редактирования продукта");
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error("Ошибка удаления продукта");
};
