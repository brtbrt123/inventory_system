export class UI {
    showToast(msg, type) {
        const t = document.createElement('div');
        t.className = `toast ${type}`; t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.remove(), 300); }, 3000);
    }

    renderInventoryTable(products, threshold) {
        const term = document.getElementById('searchInput').value.toLowerCase();
        const cat = document.getElementById('categoryFilter').value;
        const filtered = products.filter(p => (p.name.toLowerCase().includes(term) || p.supplier.toLowerCase().includes(term)) && (!cat || p.cat_id == cat));

        document.getElementById('tableBody').innerHTML = filtered.map(p => {
            // NEW: Use a generic box icon if the user didn't upload a product image
            const defaultImage = 'https://cdn-icons-png.flaticon.com/512/679/679821.png';
            const imgSrc = p.image_path && p.image_path !== 'null' ? p.image_path : defaultImage; 
            
            return `
            <tr>
                <td>${p.id}</td>
                <td><img src="${imgSrc}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.supplier}</td>
                <td>${p.quantity}</td>
                <td>₱ ${parseFloat(p.price).toFixed(2)}</td>
                <td><span class="${p.quantity < threshold ? 'low-stock' : 'good-stock'}">${p.quantity < threshold ? 'Low' : 'Good'}</span></td>
                <td>
                    <button class="btn" style="background-color: var(--success);" onclick="window.sys.sellProduct(${p.id})"><i class="fa-solid fa-tag"></i> Sell</button>
                    <button class="btn btn-edit" onclick="window.sys.editProduct(${p.id})"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="btn btn-delete" onclick="window.sys.deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i> Del</button>
                </td>
            </tr>
        `}).join('') || '<tr><td colspan="8">No products found.</td></tr>';
    }

    renderPOTable(pos) {
        document.getElementById('poTableBody').innerHTML = pos.map(po => `
            <tr>
                <td>PO-${po.po_id}</td>
                <td>${po.date_created.split(' ')[0]}</td>
                <td><strong>${po.product_name}</strong></td>
                <td>${po.supplier}</td>
                <td>${po.order_qty}</td>
                <td><span style="color: ${po.status === 'Pending' ? 'var(--warning)' : 'var(--success)'}">${po.status}</span></td>
                <td>
                    ${po.status === 'Pending' ? `<button class="btn" style="background-color: var(--info);" onclick="window.sys.receivePO(${po.po_id})"><i class="fa-solid fa-download"></i> Receive</button>` : '<i class="fa-solid fa-check" style="color: var(--success);"></i> Received'}
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7">No orders found.</td></tr>';
    }

    renderDashboardExtras(products, threshold) {
        const recentTable = document.getElementById('recentActivityTable');
        if (recentTable) {
            recentTable.innerHTML = products.slice(0, 5).map(p => `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.supplier}</td>
                    <td>${p.updated_at || 'Recently'}</td>
                    <td><span class="${p.quantity < threshold ? 'low-stock' : 'good-stock'}">${p.quantity}</span></td>
                </tr>
            `).join('') || '<tr><td colspan="4">No recent activity.</td></tr>';
        }
    }

    renderReports(products, threshold) {
        const restockTable = document.getElementById('restockTableBody');
        const lowStockItems = products.filter(p => p.quantity < threshold);
        
        if (document.getElementById('restockCount')) {
            document.getElementById('restockCount').textContent = lowStockItems.length;
        }

        if (restockTable) {
            restockTable.innerHTML = lowStockItems.map(p => `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td style="color: var(--danger); font-weight: bold;">${p.quantity}</td>
                    <td>${threshold}</td>
                    <td>${p.supplier}</td>
                </tr>
            `).join('') || '<tr><td colspan="4">No items need restocking currently.</td></tr>';
        }

        const catTable = document.getElementById('categoryReportTable');
        if (catTable) {
            const catStats = {};
            products.forEach(p => {
                const cid = p.cat_id || 'Uncategorized';
                if (!catStats[cid]) catStats[cid] = { count: 0, value: 0 };
                catStats[cid].count += 1;
                catStats[cid].value += (p.quantity * parseFloat(p.price));
            });

            let catNameMap = { "1": "Electronics", "2": "Office Supplies", "3": "Accessories", "4": "Furniture" };

            const catHtml = Object.keys(catStats).map(cid => `
                <tr>
                    <td><strong>${catNameMap[cid] || 'Category ' + cid}</strong></td>
                    <td>${catStats[cid].count} unique items</td>
                    <td>₱ ${catStats[cid].value.toFixed(2)}</td>
                </tr>
            `).join('');

            catTable.innerHTML = catHtml || '<tr><td colspan="3">No category data available.</td></tr>';
        }
    }
}