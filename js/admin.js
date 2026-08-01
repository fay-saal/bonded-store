const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000" : "https://bonded-bazar-api.onrender.com";

/* ============================================================
   BONDED ADMIN DASHBOARD LOGIC
   ============================================================ */

let adminProducts = [];
let adminOrders = [];
let chartInstance = null;

function getToken() {
  return localStorage.getItem('bonded_admin_token');
}

async function authFetch(url, options = {}) {
  const token = getToken();
  if (!options.headers) options.headers = {};
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, options);
  if (res.status === 401 || res.status === 403) {
    // Token expired or invalid
    document.getElementById('admin-app').style.display = 'none';
    document.getElementById('login-gate').style.display = 'flex';
    localStorage.removeItem('bonded_admin_token');
    throw new Error('Unauthorized');
  }
  return res;
}

// ── Auth Gate ─────────────────────────────────────────────────
document.getElementById('btn-login').addEventListener('click', async () => {
  const pwd = document.getElementById('admin-password').value;
  try {
    const res = await fetch('${API_BASE_URL}/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd })
    });
    
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('bonded_admin_token', data.token);
      document.getElementById('login-gate').style.display = 'none';
      document.getElementById('admin-app').style.display = 'flex';
      initAdmin();
    } else {
      document.getElementById('login-error').style.display = 'block';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('login-error').style.display = 'block';
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('login-gate').style.display = 'flex';
  document.getElementById('admin-password').value = '';
  document.getElementById('login-error').style.display = 'none';
  localStorage.removeItem('bonded_admin_token');
});

// Auto-login if token exists
if (getToken()) {
  document.getElementById('login-gate').style.display = 'none';
  document.getElementById('admin-app').style.display = 'flex';
  initAdmin();
}

// ── Initialization ────────────────────────────────────────────
async function initAdmin() {
  // Load data
  try {
    const pRes = await fetch('${API_BASE_URL}/api/products');
    adminProducts = await pRes.json();
    
    const oRes = await authFetch('${API_BASE_URL}/api/admin/orders');
    adminOrders = await oRes.json();
    
    const sRes = await authFetch('${API_BASE_URL}/api/admin/stats');
    const statsData = await sRes.json();
    
    // Wire up tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-view').forEach(v => v.style.display = 'none');
        
        // Find the actual button if a child was clicked (like the badge span)
        const btn = e.target.closest('.admin-tab');
        btn.classList.add('active');
        const targetId = btn.dataset.target;
        document.getElementById(targetId).style.display = 'block';

        if (targetId === 'view-messages') {
          startAdminChatPolling();
        } else {
          stopAdminChatPolling();
        }
      });
    });

    // Calculate & Render
    renderDashboardStats(statsData);
    renderChart(statsData.revenueHistory);
    renderRecentOrders();
    renderLowStockAlerts(statsData.lowStockProducts);
    
    renderOrdersTable();
    renderProductsTable();

    // Init badge polling globally    
    startGlobalBadgePolling();

    // Add Product listeners
    document.getElementById('btn-add-product').addEventListener('click', () => {
      document.getElementById('edit-product-form').style.display = 'none';
      document.getElementById('add-product-form').style.display = 'block';
    });
    document.getElementById('btn-cancel-product').addEventListener('click', () => {
      document.getElementById('add-product-form').style.display = 'none';
    });
    document.getElementById('btn-save-product').addEventListener('click', saveNewProduct);

    document.getElementById('btn-cancel-edit-product').addEventListener('click', () => {
      document.getElementById('edit-product-form').style.display = 'none';
    });
    document.getElementById('btn-update-product').addEventListener('click', updateProduct);
  } catch (err) {
    console.error("Failed to load admin data", err);
  }
}


// ── Dashboard Overview ────────────────────────────────────────
function renderDashboardStats(statsData) {
  if (!statsData) return;
  document.getElementById('stat-rev-today').textContent = `৳${statsData.revenueToday.toLocaleString()}`;
  document.getElementById('stat-orders-today').textContent = statsData.ordersToday;
  document.getElementById('stat-pending').textContent = statsData.pendingOrders;
  document.getElementById('stat-rev-month').textContent = `৳${statsData.revenueMonth.toLocaleString()}`;
  document.getElementById('stat-total-products').textContent = statsData.totalProducts;
  document.getElementById('stat-out-of-stock').textContent = `${statsData.outOfStockCount} out of stock`;
  document.getElementById('stat-aov').textContent = `৳${statsData.aov.toLocaleString()}`;
}

function renderChart(revenueHistory) {
  if (!revenueHistory) return;
  
  const ctx = document.getElementById('ordersChart').getContext('2d');
  
  const labels = revenueHistory.map(h => h.date);
  const data = revenueHistory.map(h => h.revenue);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue (৳)',
        data: data,
        backgroundColor: 'rgba(45, 79, 255, 0.5)',
        borderColor: 'rgba(45, 79, 255, 1)',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderRecentOrders() {
  const tbody = document.getElementById('recent-orders-tbody');
  const recent = adminOrders.slice(0, 5); // Assuming already sorted descending

  tbody.innerHTML = recent.length ? recent.map(o => `
    <tr>
      <td>${o.id}</td>
      <td><span class="badge badge-sm ${o.status === 'Delivered' ? 'badge-delivered' : 'badge-pending'}">${o.status}</span></td>
      <td>৳${o.total.toLocaleString()}</td>
    </tr>
  `).join('') : `<tr><td colspan="3" class="text-secondary text-center">No recent orders</td></tr>`;
}

async function updateStock(productId, newStock) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ stock: newStock, available: newStock > 0 })
    });
    
    if (res.ok) {
      alert('Stock updated successfully!');
      location.reload(); // Reload to refresh all stats and lists
    } else {
      alert('Failed to update stock');
    }
  } catch (e) {
    alert('Error updating stock');
  }
}

function renderLowStockAlerts(lowStockProducts) {
  const list = document.getElementById('stock-alert-list');
  if (!lowStockProducts || !lowStockProducts.length) {
    list.innerHTML = `<li class="text-secondary">All products have sufficient stock!</li>`;
    return;
  }

  list.innerHTML = lowStockProducts.slice(0, 10).map(p => `
    <li>
      <span>${p.name}</span>
      <div class="stock-input-wrapper">
        <input type="number" id="quick-stock-${p.id}" class="stock-input" value="${p.stock || 0}" min="0">
        <button class="stock-save-btn" onclick="updateStock('${p.id}', document.getElementById('quick-stock-${p.id}').value)">Save</button>
      </div>
    </li>
  `).join('');
}


// ── Orders Tab ────────────────────────────────────────────────
function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  
  tbody.innerHTML = adminOrders.length ? adminOrders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.date}</td>
      <td>
        <div>${o.payment ? o.payment.sender || '' : 'N/A'}</div>
      </td>
      <td>
        <div>${o.payment && o.payment.method ? o.payment.method.toUpperCase() : 'N/A'}</div>
        <div class="text-secondary" style="font-size:0.8rem">${o.payment ? o.payment.trx || '' : ''}</div>
      </td>
      <td>৳${o.total.toLocaleString()}</td>
      <td>
        <span class="badge badge-sm ${o.status === 'Delivered' ? 'badge-delivered' : o.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}">${o.status}</span>
      </td>
      <td style="display: flex; gap: 8px; align-items: center;">
        <select class="form-input" style="padding: 4px; font-size: 0.8rem; flex: 1;" onchange="updateOrderStatus('${o.id}', this.value)">
          <option value="" disabled selected>Change Status</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onclick="deleteOrder('${o.id}')" title="Delete Order" style="background: rgba(255,71,87,0.15); border: 1px solid rgba(255,71,87,0.4); color: #ff4757; border-radius: 6px; padding: 4px 8px; cursor: pointer; font-size: 0.85rem; flex-shrink: 0; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,71,87,0.35)'" onmouseout="this.style.background='rgba(255,71,87,0.15)'">
          🗑
        </button>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="7" class="text-center text-secondary">No orders found.</td></tr>`;
}

window.updateOrderStatus = async function(orderId, newStatus) {
  if (!newStatus) return;
  try {
    const res = await authFetch(`${API_BASE_URL}/api/admin/orders/${orderId}/verify`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      // Refresh admin data
      initAdmin();
    } else {
      alert("Failed to verify order on backend.");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to verify order on backend.");
  }
};

window.deleteOrder = async function(orderId) {
  if (!confirm(`Are you sure you want to permanently delete order ${orderId}?\nThis cannot be undone.`)) return;
  try {
    const res = await authFetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      // Animate row out
      const rows = document.querySelectorAll('#orders-tbody tr');
      rows.forEach(row => {
        if (row.textContent.includes(orderId)) {
          row.style.transition = 'opacity 0.3s, transform 0.3s';
          row.style.opacity = '0';
          row.style.transform = 'translateX(20px)';
          setTimeout(() => initAdmin(), 350);
        }
      });
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Failed to delete order.');
    }
  } catch (err) {
    console.error(err);
    alert('Failed to delete order.');
  }
};


// ── Products Tab ──────────────────────────────────────────────
function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  
  tbody.innerHTML = adminProducts.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td style="text-transform: capitalize;">${p.category}</td>
      <td>৳${p.price.amount.toLocaleString()}</td>
      <td>
        <span class="badge ${p.available ? 'badge-delivered' : 'badge-pending'}">${p.available ? 'In Stock' : 'Out of Stock'}</span>
      </td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn--secondary btn--small" onclick="toggleProductStock('${p.id}')">Toggle Stock</button>
          <button class="btn--primary btn--small" onclick="editProduct('${p.id}')">Edit</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleProductStock = async function(productId) {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/products/${productId}/toggle`, { method: 'PUT' });
    if (res.ok) {
      initAdmin(); // reload everything
    }
  } catch (err) {
    console.error(err);
    alert("Failed to toggle stock on backend.");
  }
};

async function saveNewProduct() {
  const name = document.getElementById('add-p-name').value.trim();
  const cat = document.getElementById('add-p-cat').value;
  const price = parseInt(document.getElementById('add-p-price').value) || 0;
  const desc = document.getElementById('add-p-desc').value.trim();

  if (!name || price <= 0) {
    alert("Please enter a valid name and price.");
    return;
  }

  const payload = {
    name: name,
    category: cat,
    description: desc || 'Premium digital code.',
    price: { amount: price, currency: 'BDT', display: `৳${price.toLocaleString()}` },
    icon: cat === 'streaming' ? 'netflix' : (cat === 'gaming' ? 'steam' : 'chatgpt'), // Fallback icons
  };

  try {
    const res = await authFetch('${API_BASE_URL}/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      document.getElementById('add-product-form').style.display = 'none';
      document.getElementById('add-p-name').value = '';
      document.getElementById('add-p-price').value = '';
      document.getElementById('add-p-desc').value = '';
      initAdmin();
    }
  } catch (err) {
    console.error(err);
    alert("Failed to add product to backend.");
  }
}

window.editProduct = function(productId) {
  const p = adminProducts.find(x => x.id === productId);
  if (!p) return;

  document.getElementById('add-product-form').style.display = 'none';
  document.getElementById('edit-product-form').style.display = 'block';

  document.getElementById('edit-p-id').value = p.id;
  document.getElementById('edit-p-name').value = p.name;
  document.getElementById('edit-p-cat').value = p.category;
  document.getElementById('edit-p-price').value = p.price.amount;
  document.getElementById('edit-p-desc').value = p.description;
  document.getElementById('edit-p-image').value = ''; // Reset file input
};

async function updateProduct() {
  const id = document.getElementById('edit-p-id').value;
  const name = document.getElementById('edit-p-name').value.trim();
  const cat = document.getElementById('edit-p-cat').value;
  const price = parseInt(document.getElementById('edit-p-price').value) || 0;
  const desc = document.getElementById('edit-p-desc').value.trim();
  const fileInput = document.getElementById('edit-p-image');

  if (!name || price <= 0) {
    alert("Please enter a valid name and price.");
    return;
  }

  const pIndex = adminProducts.findIndex(x => x.id === id);
  if (pIndex === -1) return;

  const product = adminProducts[pIndex];
  product.name = name;
  product.category = cat;
  product.price = { amount: price, currency: 'BDT', display: `৳${price.toLocaleString()}` };
  product.description = desc;

  // Handle Cloudinary Upload
  if (fileInput.files && fileInput.files[0]) {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
      const upRes = await authFetch('${API_BASE_URL}/api/admin/upload', {
        method: 'POST',
        // FormData doesn't need Content-Type header manually set, browser does it
        body: formData
      });
      if (upRes.ok) {
        const upData = await upRes.json();
        product.base64Image = upData.imageUrl; 
        await finishUpdateProduct(product);
      } else {
        const errData = await upRes.json().catch(() => ({}));
        alert(`Image upload failed: ${errData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert(`Error uploading image: ${e.message}`);
    }
  } else {
    await finishUpdateProduct(product);
  }
}

async function finishUpdateProduct(product) {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    
    if (res.ok) {
      document.getElementById('edit-product-form').style.display = 'none';
      initAdmin();
    }
  } catch(err) {
    console.error(err);
    alert("Failed to update product on backend.");
  }
}

// ── ADMIN CHAT LOGIC ──────────────────────────────────────────
let adminChatPollInterval = null;
let globalBadgeInterval = null;
let currentChatOrderId = null;

function stopAdminChatPolling() {
  if (adminChatPollInterval) {
    clearInterval(adminChatPollInterval);
    adminChatPollInterval = null;
  }
}

function startAdminChatPolling() {
  stopAdminChatPolling();
  fetchConversations();
  if (currentChatOrderId) {
    fetchAdminThread(currentChatOrderId);
  }
  adminChatPollInterval = setInterval(() => {
    fetchConversations();
    if (currentChatOrderId) {
      fetchAdminThread(currentChatOrderId);
    }
  }, 5000);
}

function startGlobalBadgePolling() {
  if (globalBadgeInterval) clearInterval(globalBadgeInterval);
  updateGlobalBadge();
  globalBadgeInterval = setInterval(updateGlobalBadge, 15000); // Check every 15s for badge
}

async function updateGlobalBadge() {
  try {
    const res = await authFetch('${API_BASE_URL}/api/admin/messages');
    if (res.ok) {
      const convs = await res.json();
      const totalUnread = convs.reduce((sum, c) => sum + c.unreadCount, 0);
      const badge = document.getElementById('admin-msg-badge');
      if (totalUnread > 0) {
        badge.textContent = totalUnread;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (e) {
    // silently fail polling
  }
}

async function fetchConversations() {
  try {
    const res = await authFetch('${API_BASE_URL}/api/admin/messages');
    if (!res.ok) return;
    const convs = await res.json();
    renderConversations(convs);
    
    // Update badge here too since we just fetched
    const totalUnread = convs.reduce((sum, c) => sum + c.unreadCount, 0);
    const badge = document.getElementById('admin-msg-badge');
    if (totalUnread > 0) {
      badge.textContent = totalUnread;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  } catch (err) {
    console.error("Failed to fetch conversations", err);
  }
}

function renderConversations(convs) {
  const listEl = document.getElementById('admin-conv-list');
  if (!listEl) return;
  
  if (convs.length === 0) {
    listEl.innerHTML = '<p style="padding:16px; color:var(--text-muted);">No messages yet.</p>';
    return;
  }
  
  listEl.innerHTML = convs.map(c => {
    const time = new Date(c.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let preview = c.lastMessage.text || (c.lastMessage.imageUrl ? '[Image]' : '');
    const isUnread = c.unreadCount > 0;
    
    return `
      <div class="conv-item ${c.orderId === currentChatOrderId ? 'active' : ''} ${isUnread ? 'unread' : ''}" onclick="openAdminThread('${c.orderId}', '${c.customerName || 'Customer'}', ${c.resolved})">
        <div class="conv-id">
          <span>${c.orderId}</span>
          ${isUnread ? '<span class="unread-dot"></span>' : ''}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="conv-preview">${c.lastMessage.sender === 'admin' ? 'You: ' : ''}${preview}</span>
          <span class="conv-time">${time}</span>
        </div>
      </div>
    `;
  }).join('');
}

async function openAdminThread(orderId, customerName, resolved) {
  currentChatOrderId = orderId;
  
  // Setup header
  document.getElementById('admin-chat-title').textContent = orderId;
  document.getElementById('admin-chat-subtitle').textContent = customerName;
  
  const actionsDiv = document.getElementById('admin-chat-actions');
  actionsDiv.style.display = 'block';
  
  const resolveToggle = document.getElementById('admin-resolve-toggle');
  resolveToggle.checked = resolved;
  
  // Clean old listener by cloning
  const newToggle = resolveToggle.cloneNode(true);
  resolveToggle.replaceWith(newToggle);
  
  newToggle.addEventListener('change', async (e) => {
    try {
      await authFetch(`${API_BASE_URL}/api/admin/orders/${orderId}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: e.target.checked })
      });
      fetchConversations();
    } catch (err) {
      console.error(err);
      e.target.checked = !e.target.checked;
    }
  });

  // Mark as read immediately
  await markThreadRead(orderId);
  
  // Load messages
  await fetchAdminThread(orderId);
  
  // Show input area and wire it up
  document.getElementById('admin-chat-input-area').style.display = 'flex';
  setupAdminChatInput(orderId);
  
  // Refresh list to remove unread dot
  fetchConversations();
}

async function markThreadRead(orderId) {
  try {
    await authFetch(`${API_BASE_URL}/api/admin/messages/${orderId}/read`, { method: 'PATCH' });
  } catch (e) {}
}

async function fetchAdminThread(orderId) {
  try {
    const res = await authFetch(`${API_BASE_URL}/api/orders/${orderId}/messages`);
    if (!res.ok) return;
    const messages = await res.json();
    renderAdminThread(messages);
  } catch (err) {
    console.error(err);
  }
}

function renderAdminThread(messages) {
  const container = document.getElementById('admin-chat-messages');
  if (!container) return;
  
  const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;

  container.innerHTML = messages.map(m => {
    const time = new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    let imgHtml = '';
    if (m.imageUrl) {
      imgHtml = `<a href="${m.imageUrl}" target="_blank"><img src="${m.imageUrl}" class="chat-img-attachment" alt="attachment" style="max-width:250px;"></a>`;
    }
    // Admin view: admin is right (blue), customer is left (gray)
    const isCustomer = m.sender === 'customer';
    return `
      <div class="chat-message ${isCustomer ? 'admin' : 'customer'}" style="max-width:80%; ${isCustomer ? 'align-self:flex-start;' : 'align-self:flex-end;'}">
        <div class="chat-bubble" style="${isCustomer ? 'background:var(--bg-card); border:1px solid var(--border); border-bottom-left-radius:2px;' : 'background:var(--accent); color:#fff; border-bottom-right-radius:2px;'}">
          ${m.text ? `<div>${m.text}</div>` : ''}
          ${imgHtml}
        </div>
        <div class="chat-time" style="${isCustomer ? 'text-align:left;' : 'text-align:right;'}">${time}</div>
      </div>
    `;
  }).join('');

  if (isScrolledToBottom) {
    container.scrollTop = container.scrollHeight;
  }
}

function setupAdminChatInput(orderId) {
  const txtInput = document.getElementById('admin-chat-text');
  const fileInput = document.getElementById('admin-chat-image');
  const btnAttach = document.getElementById('btn-admin-chat-attach');
  const btnSend = document.getElementById('btn-admin-chat-send');
  const previewDiv = document.getElementById('admin-chat-preview');
  const previewImg = document.getElementById('admin-preview-img');
  const btnRemovePreview = document.getElementById('btn-admin-preview-remove');
  
  // Clone to avoid multiple listeners
  const newBtnSend = btnSend.cloneNode(true); btnSend.replaceWith(newBtnSend);
  const newBtnAttach = btnAttach.cloneNode(true); btnAttach.replaceWith(newBtnAttach);
  const newFileInput = fileInput.cloneNode(true); fileInput.replaceWith(newFileInput);
  const newRemovePreview = btnRemovePreview.cloneNode(true); btnRemovePreview.replaceWith(newRemovePreview);
  const newTxtInput = txtInput.cloneNode(true); txtInput.replaceWith(newTxtInput);

  newBtnAttach.addEventListener('click', () => newFileInput.click());
  
  newFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      previewImg.src = URL.createObjectURL(file);
      previewDiv.style.display = 'flex';
    }
  });

  newRemovePreview.addEventListener('click', () => {
    newFileInput.value = '';
    previewDiv.style.display = 'none';
    previewImg.src = '';
  });

  const send = async () => {
    const text = newTxtInput.value.trim();
    const file = newFileInput.files[0];
    if (!text && !file) return;

    newBtnSend.textContent = '...';
    newBtnSend.disabled = true;

    const formData = new FormData();
    formData.append('sender', 'admin');
    if (text) formData.append('text', text);
    if (file) formData.append('image', file);

    try {
      const res = await authFetch(`${API_BASE_URL}/api/orders/${orderId}/messages`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        newTxtInput.value = '';
        newFileInput.value = '';
        previewDiv.style.display = 'none';
        await fetchAdminThread(orderId);
        const container = document.getElementById('admin-chat-messages');
        container.scrollTop = container.scrollHeight;
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to send reply');
    } finally {
      newBtnSend.textContent = 'Send';
      newBtnSend.disabled = false;
    }
  };

  newBtnSend.addEventListener('click', send);
  newTxtInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') send();
  });
}

// ── Calculator ────────────────────────────────────────────────
function initCalculator() {
  const toggleBtn = document.getElementById('calc-toggle-btn');
  const closeBtn = document.getElementById('calc-close-btn');
  const widget = document.getElementById('calc-widget');
  const display = document.getElementById('calc-display');
  const keys = document.querySelector('.calc-keys');

  if (!toggleBtn || !widget) return;

  toggleBtn.addEventListener('click', () => {
    widget.style.display = widget.style.display === 'none' ? 'flex' : 'none';
  });
  closeBtn.addEventListener('click', () => {
    widget.style.display = 'none';
  });

  let firstValue = '';
  let operator = '';
  let waitingForSecondValue = false;
  let displayValue = '0';

  const updateDisplay = () => { display.textContent = displayValue; };

  const calculate = (first, second, op) => {
    const n1 = parseFloat(first);
    const n2 = parseFloat(second);
    if (op === 'add') return (n1 + n2).toString();
    if (op === 'subtract') return (n1 - n2).toString();
    if (op === 'multiply') return (n1 * n2).toString();
    if (op === 'divide') return (n2 !== 0 ? (n1 / n2).toString() : 'Error');
    return second;
  };

  keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return;
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.dataset.number;

    if (!action) {
      if (displayValue === '0' || waitingForSecondValue) {
        displayValue = keyContent;
        waitingForSecondValue = false;
      } else {
        displayValue += keyContent;
      }
      updateDisplay();
    }

    if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
      if (firstValue && operator && !waitingForSecondValue) {
        const result = calculate(firstValue, displayValue, operator);
        displayValue = result;
        updateDisplay();
        firstValue = result;
      } else {
        firstValue = displayValue;
      }
      operator = action;
      waitingForSecondValue = true;
    }

    if (action === 'calculate') {
      if (firstValue && operator) {
        displayValue = calculate(firstValue, displayValue, operator);
        firstValue = '';
        operator = '';
        waitingForSecondValue = false;
        updateDisplay();
      }
    }

    if (action === 'clear') {
      firstValue = '';
      operator = '';
      waitingForSecondValue = false;
      displayValue = '0';
      updateDisplay();
    }
    
    if (action === 'delete') {
      displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
      updateDisplay();
    }
  });
}
document.addEventListener('DOMContentLoaded', initCalculator);
