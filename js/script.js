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
        
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);

        // Login Submit
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
                    localStorage.setItem('currentProfilePic', result.profile_pic); // Sticky photo fix
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

        // Signup Submit
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
        
        // --- PROFILE UI UPDATE ---
        const storedFullName = localStorage.getItem('currentFullName');
        const storedUsername = localStorage.getItem('currentUser');
        const storedPic = localStorage.getItem('currentProfilePic');
        
        // Update Name and User Handle
        if (document.getElementById('userFullName')) {
            document.getElementById('userFullName').textContent = 
                (storedFullName && storedFullName !== "null") ? storedFullName : "New User";
        }
        if (document.getElementById('userRole')) {
            document.getElementById('userRole').textContent = "@" + (storedUsername || "user");
        }

        // Update Profile Picture with Default Fallback
        const profileImgElement = document.getElementById('headerProfilePic');
        if (profileImgElement) {
            if (storedPic && storedPic !== "null" && storedPic !== "undefined") {
                profileImgElement.src = 'img/' + storedPic;
            } else {
                profileImgElement.src = 'img/profile_C.jpg';
            }
        }

        await this.fetchRealData(); 
    }

    async fetchRealData() {
        try {
            const currentUser = localStorage.getItem('currentUser');
            const response = await fetch(`php/get_products.php?user=${currentUser}`);
            this.products = await response.json();
            this.renderAll();
        } catch (error) { 
            this.showToast("Data fetch error", "error"); 
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
                description: document.getElementById('description') ? document.getElementById('description').value : '',
                owner: localStorage.getItem('currentUser') 
            };

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
                } else {
                    this.showToast(result.message, 'error');
                }
            } catch(err) { this.showToast("Save failed", "error"); }
        };

        // Handle Profile Picture Upload
        const profileInput = document.getElementById('profileUpload');
        if (profileInput) {
            profileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append('profile_image', file);
                formData.append('username', localStorage.getItem('currentUser'));

                try {
                    const response = await fetch('php/upload_profile.php', {
                        method: 'POST',
                        body: formData 
                    });
                    
                    const result = await response.json();
                    if (result.status === 'success') {
                        this.showToast("Profile updated!", "success");
                        document.getElementById('headerProfilePic').src = 'img/' + result.filename;
                        localStorage.setItem('currentProfilePic', result.filename); 
                    } else {
                        this.showToast(result.message, "error");
                    }
                } catch (error) {
                    this.showToast("Upload failed", "error");
                }
            });
        }

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
        if(document.getElementById('description') && p.description) {
            document.getElementById('description').value = p.description;
        }
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