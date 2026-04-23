class InventorySystem {
        constructor() {
            this.products = [];
            this.purchaseOrders = [];
            this.editingId = null;
            this.currentPage = 1;
            this.itemsPerPage = 8;
            this.lowStockThreshold = parseInt(localStorage.getItem('lowStockThreshold') || '10');
            
            this.checkAuth();
        }

        // --- AUTHENTICATION ---
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
            
            // Fix for potential "dead button" by cloning node [cite: 139, 140]
            const newForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newForm, loginForm);

            // UPDATED: Points to php/login.php
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
                        localStorage.setItem('isLoggedIn', 'true');
                        this.showApp();
                        this.showToast(result.message, 'success');
                    } else {
                        this.showToast(result.message, 'error');
                    }
                } catch (error) {
                    this.showToast("Connection Error: Check php/login.php", "error");
                }
            });

            // UPDATED: Signup Listener points to php/signup.php
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
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                this.showLogin();
            };
        }

        showLogin() {
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('appContainer').style.display = 'none';
        }

        showApp() {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'flex';
            this.initApp(); 
        }

        async initApp() {
            this.setupAppEventListeners();
            await this.fetchRealData(); 
        }

        // --- DATABASE SYNC ---
        async fetchRealData() {
            try {
                // UPDATED: Path to php folder
                const response = await fetch('php/get_products.php');
                const data = await response.json();
                this.products = data;
                this.renderAll();
            } catch (error) {
                this.showToast("Could not load database items.", "error");
            }
        }

        setupAppEventListeners() {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.onclick = (e) => {
                    const page = e.currentTarget.getAttribute('data-page');
                    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
                    document.getElementById(page + 'Page').style.display = 'block';
                    this.renderAll();
                };
            });

            document.getElementById('searchInput').addEventListener('input', () => this.renderInventoryTable());
            document.getElementById('categoryFilter').addEventListener('change', () => this.renderInventoryTable());

            const pForm = document.getElementById('productForm');
            pForm.onsubmit = async (e) => {
                e.preventDefault();
                const product = {
                    name: document.getElementById('productName').value,
                    supplier: document.getElementById('supplier').value,
                    category: document.getElementById('category').value,
                    quantity: parseInt(document.getElementById('quantity').value),
                    price: parseFloat(document.getElementById('price').value),
                    description: document.getElementById('description').value
                };

                // UPDATED: Paths to php folder
                const url = this.editingId ? 'php/update_product.php' : 'php/add_product.php';
                
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.editingId ? {...product, id: this.editingId} : product)
                    });
                    const result = await response.json();
                    if(result.status === 'success') {
                        this.showToast(result.message, 'success');
                        document.getElementById('productModal').classList.remove('show');
                        await this.fetchRealData();
                    }
                } catch(err) { this.showToast("Save failed", "error"); }
            };

            document.getElementById('openModalBtn').onclick = () => {
                this.editingId = null;
                pForm.reset();
                document.getElementById('productModal').classList.add('show');
            };
            document.getElementById('closeModalBtn').onclick = () => {
                document.getElementById('productModal').classList.remove('show');
            };
        }

        renderAll() {
            this.renderDashboard();
            this.renderInventoryTable();
            this.renderReportsPage();
        }

        renderDashboard() {
            const lowStockItems = this.products.filter(p => p.quantity < this.lowStockThreshold);
            document.getElementById('totalProducts').textContent = this.products.length;
            document.getElementById('lowStockCount').textContent = lowStockItems.length;
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
                    <td><span class="${p.quantity < this.lowStockThreshold ? 'low-stock' : 'good-stock'}">${p.quantity < this.lowStockThreshold ? 'Low Stock' : 'Good'}</span></td>
                    <td>
                        <button class="btn btn-edit" onclick="sys.editProduct(${p.id})">Edit</button>
                        <button class="btn btn-delete" onclick="sys.deleteProduct(${p.id})">Del</button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="7">No products.</td></tr>';
        }

        renderReportsPage() {
            const cats = [...new Set(this.products.map(p => p.category))];
            document.getElementById('reportTable').innerHTML = cats.map(c => {
                const group = this.products.filter(p => p.category === c);
                const val = group.reduce((s, p) => s + (p.quantity * p.price), 0);
                return `<tr><td><strong>${c}</strong></td><td>${group.length} items</td><td>₱ ${val.toFixed(2)}</td></tr>`;
            }).join('');
        }

        async deleteProduct(id) {
            if(!confirm('Delete item?')) return;
            try {
                // UPDATED: Path to php folder
                const res = await fetch('php/delete_product.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id })
                });
                if((await res.json()).status === 'success') await this.fetchRealData();
            } catch (err) { this.showToast("Error deleting.", "error"); }
        }

        editProduct(id) {
            const p = this.products.find(x => x.id == id);
            this.editingId = id;
            document.getElementById('productName').value = p.name;
            document.getElementById('supplier').value = p.supplier;
            document.getElementById('category').value = p.category;
            document.getElementById('quantity').value = p.quantity;
            document.getElementById('price').value = p.price;
            document.getElementById('productModal').classList.add('show');
        }

        showToast(msg, type) {
            const t = document.createElement('div');
            t.className = `toast ${type}`; t.textContent = msg;
            document.body.appendChild(t);
            setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 300); }, 3000);
        }
    }
    const sys = new InventorySystem();