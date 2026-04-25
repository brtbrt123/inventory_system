export class API {
    constructor() {
        this.baseUrl = 'php/';
    }

    /**
     * Standard helper for JSON-based requests (Login, Signup, CRUD)
     */
    async request(endpoint, data = null) {
        const options = {
            method: data ? 'POST' : 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    /**
     * Handles User Profile Photo uploads
     */
    async uploadProfile(formData) {
        try {
            const response = await fetch(`${this.baseUrl}user_profile_upload.php`, {
                method: 'POST',
                // Browser sets 'multipart/form-data' automatically for FormData
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error("Upload Error:", error);
            throw error;
        }
    }

    /**
     * Handles adding NEW products with an image
     */
    async addProductWithImage(formData) {
        try {
            const response = await fetch(`${this.baseUrl}product_add.php`, {
                method: 'POST',
                body: formData 
            });
            return await response.json();
        } catch (error) {
            console.error("Add Product Error:", error);
            throw error;
        }
    }

    /**
     * Handles updating EXISTING products with a new image
     */
    async updateProductWithImage(formData) {
        try {
            const response = await fetch(`${this.baseUrl}product_update.php`, {
                method: 'POST',
                body: formData 
            });
            return await response.json();
        } catch (error) {
            console.error("Update Product Error:", error);
            throw error;
        }
    }

    // --- Authentication ---
    login(data) { return this.request('user_login.php', data); }
    signup(data) { return this.request('user_signup.php', data); }

    // --- Product Management ---
    getProducts(user) { return this.request(`product_get.php?user=${user}`); }
    updateProduct(data) { return this.request('product_update.php', data); }
    deleteProduct(id) { return this.request('product_delete.php', { id }); }
    sellProduct(data) { return this.request('sale_record.php', data); }

    // --- Purchase Order Management ---
    getPOs(user) { return this.request(`po_get.php?user=${user}`); }
    createPO(data) { return this.request('po_create.php', data); }
    receivePO(data) { return this.request('po_receive.php', data); }
}