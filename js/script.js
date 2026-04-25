class InventorySystem {
    constructor() {
        this.products = [];
        this.purchaseOrders = [];
        this.lowStockThreshold = 10;
        
        // State management
        this.editingId = null;
        this.sellingId = null;
        this.deletingId = null;
        this.receivingPoId = null;

        this.checkAuth();
    }

    checkAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            this.showApp();
        } else {
            this.showLogin();
        }
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('loginUsername').value.trim();
            const pass = document.getElementById('loginPassword').value;
            
            try {
                const response = await fetch('php/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    localStorage.setItem('currentUser', result.username);
                    localStorage.setItem('currentFullName', result.fullname);
                    localStorage.setItem('currentProfilePic', result.profile_pic); 
                    localStorage.setItem('isLoggedIn', 'true');
                    this.showApp();
                    this.showToast(result.message, 'success');
                } else {
                    this.showToast(result.message, 'error');
                }
            } catch (error) {
                this.showToast("Connection Error", "error");
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                fullname: document.getElementById('regFullName').value,
                username: document.getElementById('regUsername').value,
                password: document.getElementById('regPassword').value
            };

            try {
                const response = await fetch('php/signup.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.status === 'success') {
                    this.showToast("Account created! Please login.", "success");
                    this.toggleAuth(false);
                } else {
                    this.showToast(result.message, "error");
                }
            } catch (error) {
                this.showToast("Registration failed.", "error");
            }
        });

        this.toggleAuth = (showSignup) => {
            document.getElementById('loginForm').style.display = showSignup ? 'none' : 'block';
            document.getElementById('signupForm').style.display = showSignup ? 'block' : 'none';
            document.getElementById('authTitle').textContent = showSignup ? '✨ Join Group 8' : '📦 Cabuyao Tech';
        };

        document.getElementById('logoutBtn').onclick = () => {
            localStorage.clear(); 
            this.showLogin();
        };
    }

    async showApp() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        this.updateProfileUI();
        this.initApp();
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    updateProfileUI() {
        const name = localStorage.getItem('currentFullName');
        const user = localStorage.getItem('currentUser');
        if (document.getElementById('userFullName')) document.getElementById('userFullName').textContent = name || "User";
        if (document.getElementById('userRole')) document.getElementById('userRole').textContent = "@" + (user || "admin");
    }

    async initApp() {
        this.setupAppEventListeners();
        await this.fetchRealData();
    }

    async fetchRealData() {
        const user = localStorage.getItem('currentUser');
        try {
            const [prodsRes, posRes] = await Promise.all([
                fetch(`php/get_products.php?user=${user}`),
                fetch(`php/get_pos.php?user=${user}`)
            ]);
            this.products = await prodsRes.json();
            this.purchaseOrders = await posRes.json();
            this.renderAll();
        } catch (e) { this.showToast("Data fetch error", "error"); }
    }

    renderAll() {
        this.renderDashboard();
        this.renderInventoryTable();
        this.renderPurchaseOrdersTable();
    }

    renderDashboard() {
        document.getElementById('totalProducts').textContent = this.products.length;
        document.getElementById('lowStockCount').textContent = this.products.filter(p => p.quantity < this.lowStockThreshold).length;
        const totalVal = this.products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        document.getElementById('totalValue').textContent = `₱ ${totalVal.toFixed(2)}`;
        
        document.getElementById('recentActivityTable').innerHTML = this.products.slice(0, 5).map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.supplier}</td>
                <td>${p.updated_at || 'Recently'}</td>
                <td><span class="${p.quantity < this.lowStockThreshold ? 'low-stock' : 'good-stock'}">${p.quantity}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="4">No data.</td></tr>';
    }

    renderInventoryTable() {
        const term = document.getElementById('searchInput').value.toLowerCase();
        const cat = document.getElementById('categoryFilter').value;
        const filtered = this.products.filter(p => (p.name.toLowerCase().includes(term) || p.supplier.toLowerCase().includes(term)) && (!cat || p.category === cat));

        document.getElementById('tableBody').innerHTML = filtered.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.supplier}</td>
                <td>${p.quantity}</td>
                <td>₱ ${parseFloat(p.price).toFixed(2)}</td>
                <td><span class="${p.quantity < this.lowStockThreshold ? 'low-stock' : 'good-stock'}">${p.quantity < this.lowStockThreshold ? 'Low' : 'Good'}</span></td>
                <td>
                    <button class="btn" style="background-color: var(--success);" onclick="sys.sellProduct(${p.id})">Sell</button>
                    <button class="btn btn-edit" onclick="sys.editProduct(${p.id})">Edit</button>
                    <button class="btn btn-delete" onclick="sys.deleteProduct(${p.id})">Del</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7">No products.</td></tr>';
    }

    renderPurchaseOrdersTable() {
        document.getElementById('poTableBody').innerHTML = this.purchaseOrders.map(po => `
            <tr>
                <td>PO-${po.po_id}</td>
                <td>${po.date_created.split(' ')[0]}</td>
                <td><strong>${po.product_name}</strong></td>
                <td>${po.supplier}</td>
                <td>${po.order_qty}</td>
                <td><span style="color: ${po.status === 'Pending' ? 'var(--warning)' : 'var(--success)'}">${po.status}</span></td>
                <td>
                    ${po.status === 'Pending' ? `<button class="btn" style="background-color: var(--info);" onclick="sys.receivePO(${po.po_id})">📥 Receive</button>` : '✔️'}
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7">No orders.</td></tr>';
    }

    // --- INVENTORY ACTIONS ---
    sellProduct(id) {
        const p = this.products.find(x => x.id == id);
        this.sellingId = id;
        document.getElementById('sellModalTitle').textContent = `Sell: ${p.name}`;
        document.getElementById('currentStockDisplay').textContent = p.quantity;
        document.getElementById('sellQuantity').max = p.quantity;
        document.getElementById('sellModal').classList.add('show');
    }

    editProduct(id) {
        const p = this.products.find(x => x.id == id);
        this.editingId = id;
        document.getElementById('productName').value = p.name;
        document.getElementById('supplier').value = p.supplier;
        document.getElementById('category').value = p.cat_id;
        document.getElementById('quantity').value = p.quantity;
        document.getElementById('price').value = p.price;
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

    setupAppEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.onclick = (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
                document.getElementById(page + 'Page').style.display = 'block';
            };
        });

        document.getElementById('searchInput').oninput = () => this.renderInventoryTable();
        document.getElementById('categoryFilter').onchange = () => this.renderInventoryTable();

        // Modal Form Handlers
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

            const url = this.editingId ? 'php/update_product.php' : 'php/add_product.php';
            const body = this.editingId ? {...data, id: this.editingId} : data;

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });
                if((await res.json()).status === 'success') {
                    document.getElementById('productModal').classList.remove('show');
                    await this.fetchRealData();
                }
            } catch (err) { this.showToast("Save failed", "error"); }
        };

        // Confirmation Actions
        document.getElementById('confirmSellBtn').onclick = async () => {
            const qty = parseInt(document.getElementById('sellQuantity').value);
            try {
                const res = await fetch('php/record_sale.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        product_id: this.sellingId,
                        quantity: qty,
                        username: localStorage.getItem('currentUser')
                    })
                });
                if((await res.json()).status === 'success') {
                    document.getElementById('sellModal').classList.remove('show');
                    await this.fetchRealData();
                }
            } catch (err) { this.showToast("Sale failed", "error"); }
        };

        document.getElementById('confirmDeleteBtn').onclick = async () => {
            try {
                const res = await fetch('php/delete_product.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: this.deletingId })
                });
                if((await res.json()).status === 'success') {
                    document.getElementById('deleteModal').classList.remove('show');
                    await this.fetchRealData();
                }
            } catch (err) { this.showToast("Delete failed", "error"); }
        };

        document.getElementById('confirmReceivePoBtn').onclick = async () => {
            try {
                const res = await fetch('php/receive_po.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        po_id: this.receivingPoId,
                        username: localStorage.getItem('currentUser')
                    })
                });
                if((await res.json()).status === 'success') {
                    document.getElementById('receivePoModal').classList.remove('show');
                    await this.fetchRealData();
                }
            } catch (err) { this.showToast("Receive failed", "error"); }
        };

        // Closer Buttons
        document.getElementById('openModalBtn').onclick = () => {
            this.editingId = null;
            document.getElementById('productForm').reset();
            document.getElementById('productModal').classList.add('show');
        };
        document.getElementById('closeModalBtn').onclick = () => document.getElementById('productModal').classList.remove('show');
        document.getElementById('closeSellModalBtn').onclick = () => document.getElementById('sellModal').classList.remove('show');
        document.getElementById('closeDeleteModalBtn').onclick = () => document.getElementById('deleteModal').classList.remove('show');
        document.getElementById('closePoModalBtn').onclick = () => document.getElementById('poModal').classList.remove('show');
        document.getElementById('closeReceivePoModalBtn').onclick = () => document.getElementById('receivePoModal').classList.remove('show');

        // PO Form
        document.getElementById('openPoModalBtn').onclick = () => {
            document.getElementById('poProductSelect').innerHTML = '<option value="" disabled selected>Select Product...</option>' + 
                this.products.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
            document.getElementById('poModal').classList.add('show');
        };
        document.getElementById('poForm').onsubmit = async (e) => {
            e.preventDefault();
            const data = {
                product_id: document.getElementById('poProductSelect').value,
                quantity: document.getElementById('poQuantity').value
            };
            try {
                const res = await fetch('php/create_po.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if((await res.json()).status === 'success') {
                    document.getElementById('poModal').classList.remove('show');
                    await this.fetchRealData();
                }
            } catch (err) { this.showToast("Order failed", "error"); }
        };
    }

    showToast(msg, type) {
        const t = document.createElement('div');
        t.className = `toast ${type}`; t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 300); }, 3000);
    }
}

const sys = new InventorySystem();