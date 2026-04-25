export class API {
    constructor() {
        this.baseUrl = 'php/';
    }

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

    // --- NEW: Special method for handling Image Uploads ---
    async uploadProfile(formData) {
        try {
            const response = await fetch(`${this.baseUrl}user_profile_upload.php`, {
                method: 'POST',
                // Notice we do NOT set 'Content-Type' here. 
                // The browser sets it automatically to 'multipart/form-data' for files.
                body: formData 
            });
            return await response.json();
        } catch (error) {
            console.error("Upload Error:", error);
            throw error;
        }
    }

    // Add this right underneath your uploadProfile method
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
    // -----------------------------------------------------

    login(data) { return this.request('user_login.php', data); }
    signup(data) { return this.request('user_signup.php', data); }

    getProducts(user) { return this.request(`product_get.php?user=${user}`); }
    addProduct(data) { return this.request('product_add.php', data); }
    updateProduct(data) { return this.request('product_update.php', data); }
    deleteProduct(id) { return this.request('product_delete.php', { id }); }
    sellProduct(data) { return this.request('sale_record.php', data); }

    getPOs(user) { return this.request(`po_get.php?user=${user}`); }
    createPO(data) { return this.request('po_create.php', data); }
    receivePO(data) { return this.request('po_receive.php', data); }
}