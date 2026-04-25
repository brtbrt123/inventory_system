import { API } from './API.js';
import { UI } from './UI.js';
import { Auth } from './Auth.js';

class InventorySystem {
    constructor() {
        this.api = new API();
        this.ui = new UI();
        this.auth = new Auth(this.api, this.ui);
        
        this.products = [];
        this.purchaseOrders = [];
        this.lowStockThreshold = 10;
        
        this.editingId = null;
        this.sellingId = null;
        this.deletingId = null;
        this.receivingPoId = null;

        this.init();
    }

    async init() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            await this.showApp();
        } else {
            this.showLogin();
        }
        this.setupEventListeners();
    }

    async showApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        
        const name = localStorage.getItem('currentFullName');
        const user = localStorage.getItem('currentUser');
        const pic = localStorage.getItem('currentProfilePic'); 
        
        // FIX FOR "NULL" TEXT BUG
        if (document.getElementById('userFullName')) {
            document.getElementById('userFullName').textContent = (name && name !== 'null') ? name : "Admin User";
        }
        if (document.getElementById('userRole')) {
            document.getElementById('userRole').textContent = "@" + (user || "admin");
        }
        
        // FIX FOR DEFAULT .WEBP IMAGE
        if (document.getElementById('headerProfilePic')) {
            if (pic && pic !== 'null' && pic !== 'undefined' && pic !== '') {
                document.getElementById('headerProfilePic').src = pic;
            } else {
                document.getElementById('headerProfilePic').src = 'img/profile_C.webp';
            }
        }
        
        await this.fetchData();
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    async fetchData() {
        const user = localStorage.getItem('currentUser');
        try {
            const [prods, pos] = await Promise.all([
                this.api.getProducts(user),
                this.api.getPOs(user)
            ]);
            this.products = prods;
            this.purchaseOrders = pos;
            this.renderAll();
        } catch (e) { this.ui.showToast("Data sync failed", "error"); }
    }

    renderAll() {
        this.ui.renderInventoryTable(this.products, this.lowStockThreshold);
        this.ui.renderPOTable(this.purchaseOrders);
        
        if(document.getElementById('totalProducts')) {
            document.getElementById('totalProducts').textContent = this.products.length;
        }
        if(document.getElementById('lowStockCount')) {
            document.getElementById('lowStockCount').textContent = this.products.filter(p => p.quantity < this.lowStockThreshold).length;
        }
        if(document.getElementById('pendingPOCount')) {
            document.getElementById('pendingPOCount').textContent = this.purchaseOrders.filter(po => po.status === 'Pending').length;
        }
        if(document.getElementById('totalValue')) {
            const totalVal = this.products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
            document.getElementById('totalValue').textContent = `₱ ${totalVal.toFixed(2)}`;
        }

        this.ui.renderDashboardExtras(this.products, this.lowStockThreshold);
        this.ui.renderReports(this.products, this.lowStockThreshold);
    }

    sellProduct(id) {
        const p = this.products.find(x => x.id == id);
        this.sellingId = id;
        document.getElementById('sellModalTitle').innerHTML = `<i class="fa-solid fa-tag"></i> Sell: ${p.name}`;
        document.getElementById('currentStockDisplay').textContent = p.quantity;
        document.getElementById('sellQuantity').max = p.quantity;
        document.getElementById('sellModal').classList.add('show');
    }

    editProduct(id) {
        const form = document.getElementById('productForm');
        form.reset(); 
        
        if (id) {
            const p = this.products.find(x => x.id == id);
            this.editingId = id;
            document.getElementById('productName').value = p.name;
            document.getElementById('supplier').value = p.supplier;
            document.getElementById('category').value = p.cat_id;
            document.getElementById('quantity').value = p.quantity;
            document.getElementById('price').value = p.price;
            document.getElementById('modalTitle').textContent = "Edit Product";
        } else {
            this.editingId = null;
            document.getElementById('modalTitle').textContent = "Add New Product";
        }
        document.getElementById('productModal').classList.add('show');
    }

    deleteProduct(id) {
        const p = this.products.find(x => x.id == id);
        this.deletingId = id;
        document.getElementById('deleteProductName').textContent = p.name;
        document.getElementById('deleteModal').classList.add('show');
    }

    receivePO(po_id) {
        const po = this.purchaseOrders.find(x => x.po_id == po_id);
        this.receivingPoId = po_id;
        document.getElementById('receivePoName').textContent = po.product_name;
        document.getElementById('receivePoModal').classList.add('show');
    }

    async executeSale() {
        const qty = parseInt(document.getElementById('sellQuantity').value);
        const result = await this.api.sellProduct({ product_id: this.sellingId, quantity: qty, username: localStorage.getItem('currentUser') });
        if (result.status === 'success') {
            this.ui.showToast(result.message, 'success');
            document.getElementById('sellModal').classList.remove('show');
            await this.fetchData();
        }
    }

    async executeDelete() {
        const result = await this.api.deleteProduct(this.deletingId);
        if (result.status === 'success') {
            this.ui.showToast(result.message, 'success');
            document.getElementById('deleteModal').classList.remove('show');
            await this.fetchData();
        }
    }

    async executeReceivePo() {
        const result = await this.api.receivePO({ po_id: this.receivingPoId, username: localStorage.getItem('currentUser') });
        if (result.status === 'success') {
            this.ui.showToast(result.message, 'success');
            document.getElementById('receivePoModal').classList.remove('show');
            await this.fetchData();
        }
    }

    // Export to CSV Function
    exportToCSV() {
        if (this.products.length === 0) {
            this.ui.showToast("No products to export.", "error");
            return;
        }
        
        const headers = ["Product ID", "Product Name", "Supplier", "Current Stock", "Unit Price"];
        
        const rows = this.products.map(p => [
            p.id, 
            `"${p.name}"`, 
            `"${p.supplier}"`, 
            p.quantity, 
            p.price
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Inventory_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        
        link.click();
        document.body.removeChild(link);
        
        this.ui.showToast("Inventory exported successfully!", "success");
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
                document.getElementById(page + 'Page').style.display = 'block';
            };
        });

        document.getElementById('showSignupBtn').onclick = (e) => { e.preventDefault(); this.auth.toggleAuth(true); };
        document.getElementById('showLoginBtn').onclick = (e) => { e.preventDefault(); this.auth.toggleAuth(false); };
        document.getElementById('logoutBtn').onclick = () => this.auth.logout();

        const printBtn = document.getElementById('printReportBtn');
        if (printBtn) printBtn.onclick = () => window.print();

        const exportBtn = document.getElementById('exportCsvBtn');
        if (exportBtn) exportBtn.onclick = () => this.exportToCSV();

        document.getElementById('loginForm').onsubmit = async (e) => {
            e.preventDefault();
            const u = document.getElementById('loginUsername').value;
            const p = document.getElementById('loginPassword').value;
            if (await this.auth.handleLogin(u, p)) await this.showApp();
        };

        document.getElementById('signupForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                fullname: document.getElementById('regFullName').value,
                username: document.getElementById('regUsername').value,
                password: document.getElementById('regPassword').value
            };
            const result = await this.api.signup(data);
            if (result.status === 'success') {
                this.ui.showToast("Account created!", "success");
                this.auth.toggleAuth(false);
            } else this.ui.showToast(result.message, "error");
        };

        const profileUploadInput = document.getElementById('profileUpload');
        if (profileUploadInput) {
            profileUploadInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('profile_pic', file);
                formData.append('username', localStorage.getItem('currentUser'));

                try {
                    const result = await this.api.uploadProfile(formData);
                    if (result.status === 'success') {
                        document.getElementById('headerProfilePic').src = result.filepath;
                        localStorage.setItem('currentProfilePic', result.filepath);
                        this.ui.showToast("Profile photo updated!", "success");
                    } else {
                        this.ui.showToast(result.message || "Upload failed", "error");
                    }
                } catch (err) {
                    this.ui.showToast("Server error during upload", "error");
                }
            };
        }

        document.getElementById('openModalBtn').onclick = () => this.editProduct(null);
        document.getElementById('openPoModalBtn').onclick = () => {
            document.getElementById('poProductSelect').innerHTML = '<option value="" disabled selected>Select Product...</option>' + 
                this.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            document.getElementById('poModal').classList.add('show');
        };

        document.getElementById('closeModalBtn').onclick = () => document.getElementById('productModal').classList.remove('show');
        document.getElementById('closeSellModalBtn').onclick = () => document.getElementById('sellModal').classList.remove('show');
        document.getElementById('closeDeleteModalBtn').onclick = () => document.getElementById('deleteModal').classList.remove('show');
        document.getElementById('closePoModalBtn').onclick = () => document.getElementById('poModal').classList.remove('show');
        document.getElementById('closeReceivePoModalBtn').onclick = () => document.getElementById('receivePoModal').classList.remove('show');

        document.getElementById('confirmSellBtn').onclick = () => this.executeSale();
        document.getElementById('confirmDeleteBtn').onclick = () => this.executeDelete();
        document.getElementById('confirmReceivePoBtn').onclick = () => this.executeReceivePo();

        document.getElementById('productForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('productName').value,
                supplier: document.getElementById('supplier').value,
                cat_id: parseInt(document.getElementById('category').value),
                quantity: parseInt(document.getElementById('quantity').value),
                price: parseFloat(document.getElementById('price').value),
                owner: localStorage.getItem('currentUser')
            };
            const result = this.editingId ? await this.api.updateProduct({ ...data, id: this.editingId }) : await this.api.addProduct(data);
            if (result.status === 'success') {
                this.ui.showToast(result.message, 'success');
                document.getElementById('productModal').classList.remove('show');
                await this.fetchData();
            }
        };

        document.getElementById('poForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = { product_id: document.getElementById('poProductSelect').value, quantity: document.getElementById('poQuantity').value };
            const result = await this.api.createPO(data);
            if (result.status === 'success') {
                this.ui.showToast(result.message, 'success');
                document.getElementById('poModal').classList.remove('show');
                await this.fetchData();
            }
        };

        document.getElementById('searchInput').oninput = () => this.renderAll();
        document.getElementById('categoryFilter').onchange = () => this.renderAll();
    }
}

window.sys = new InventorySystem();