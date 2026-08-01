const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow base64 images

// Serve static files from the current directory
app.use(express.static(__dirname));

// ── CLOUDINARY CONFIG ──────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bonded_bazar',
    allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp']
  }
});
const upload = multer({ storage: storage });

// ── DISCORD WEBHOOK HELPER ──────────────────────────────
async function sendDiscordNotification(message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return; // Skip if no webhook configured

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    console.error('Discord Webhook Error:', err);
  }
}

// ── EMAIL HELPER (via Resend) ─────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

// NOTE: Resend free plan (without verified domain) can only send to the account owner's email.
// We send order alerts to the admin (faysaalofficial@gmail.com) with all customer info.
// Once you verify a domain at resend.com/domains, update RESEND_FROM_EMAIL and remove the TO override.
const ADMIN_EMAIL = process.env.RESEND_TO_EMAIL || 'faysaalofficial@gmail.com';

async function sendOrderConfirmationEmail({ customerEmail, customerName, orderId, orderDate, items, total, paymentMethod }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key') {
    console.log('📧 Email skipped — RESEND_API_KEY not configured in .env');
    return;
  }

  const itemsRows = items.map(item => `
    <tr>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1e2a3a; color: #cdd6f4;">${item.name}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1e2a3a; color: #cdd6f4; text-align: center;">${item.qty}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1e2a3a; color: #cdd6f4; text-align: right;">৳${(item.price.amount * item.qty).toLocaleString()}</td>
    </tr>
  `).join('');

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#0d1117; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117; padding: 40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background: linear-gradient(135deg, #0d1117, #161b22); border: 1px solid #1e2a3a; border-radius: 16px 16px 0 0; padding: 36px 40px; text-align: center;">
            <h1 style="margin:0; font-size:26px; font-weight:800; color:#fff;">🛒 BONDED</h1>
            <p style="margin:4px 0 0; color:#636e7b; font-size:12px; letter-spacing:2px; text-transform:uppercase;">New Order Received</p>
          </td>
        </tr>

        <!-- ORDER ID HERO -->
        <tr>
          <td style="background: linear-gradient(135deg, rgba(0,200,255,0.08), rgba(0,102,255,0.08)); border-left:1px solid #1e2a3a; border-right:1px solid #1e2a3a; padding:32px 40px; text-align:center;">
            <p style="margin:0 0 8px; color:#636e7b; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Order ID</p>
            <p style="margin:0; color:#00c8ff; font-size:32px; font-weight:800; letter-spacing:3px; font-family:'Courier New',monospace;">${orderId}</p>
            <p style="margin:8px 0 0; color:#636e7b; font-size:12px;">${orderDate}</p>
          </td>
        </tr>

        <!-- CUSTOMER INFO -->
        <tr>
          <td style="background:#161b22; border-left:1px solid #1e2a3a; border-right:1px solid #1e2a3a; padding:24px 40px;">
            <p style="margin:0 0 14px; color:#636e7b; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Customer Info</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0; color:#8892a4; font-size:13px; width:30%;">Name</td>
                <td style="padding:8px 0; color:#cdd6f4; font-size:13px; font-weight:600;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#8892a4; font-size:13px;">Email</td>
                <td style="padding:8px 0; color:#00c8ff; font-size:13px; font-weight:600;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#8892a4; font-size:13px;">Payment</td>
                <td style="padding:8px 0; color:#cdd6f4; font-size:13px; font-weight:600;">${paymentMethod.toUpperCase()}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ITEMS TABLE -->
        <tr>
          <td style="background:#161b22; border-left:1px solid #1e2a3a; border-right:1px solid #1e2a3a; padding:0 40px 24px;">
            <p style="margin:0 0 12px; color:#636e7b; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Items Ordered</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e2a3a; border-radius:10px; border-collapse:separate; border-spacing:0; overflow:hidden;">
              <thead>
                <tr style="background:#0d1117;">
                  <th style="padding:10px 16px; color:#636e7b; font-size:11px; text-transform:uppercase; text-align:left; font-weight:600;">Product</th>
                  <th style="padding:10px 16px; color:#636e7b; font-size:11px; text-transform:uppercase; text-align:center; font-weight:600;">Qty</th>
                  <th style="padding:10px 16px; color:#636e7b; font-size:11px; text-transform:uppercase; text-align:right; font-weight:600;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsRows}</tbody>
              <tfoot>
                <tr style="background:#0d1117;">
                  <td colspan="2" style="padding:12px 16px; color:#8892a4; font-weight:600;">Total</td>
                  <td style="padding:12px 16px; color:#00c8ff; font-weight:800; font-size:16px; text-align:right;">৳${total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>

        <!-- ACTION NOTE -->
        <tr>
          <td style="background:#161b22; border-left:1px solid #1e2a3a; border-right:1px solid #1e2a3a; padding:0 40px 32px; text-align:center;">
            <p style="margin:0; color:#8892a4; font-size:13px; line-height:1.7;">
              ⚡ Go to your <strong style="color:#cdd6f4;">Admin Panel</strong> to verify this order and deliver codes.<br>
              Reply to the customer at: <a href="mailto:${customerEmail}" style="color:#00c8ff;">${customerEmail}</a>
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0d1117; border:1px solid #1e2a3a; border-radius:0 0 16px 16px; padding:20px 40px; text-align:center;">
            <p style="margin:0; color:#2d3340; font-size:11px;">© 2026 Bonded Digital Store — Admin Notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: 'Bonded Store <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `🛒 New Order ${orderId} — ৳${total.toLocaleString()} from ${customerName}`,
      html: htmlBody
    });
    if (error) {
      console.error('[Resend Error]:', JSON.stringify(error));
    } else {
      console.log(`📧 Order alert sent to admin (${ADMIN_EMAIL}) for order ${orderId}`);
    }
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}


// ── JWT AUTH MIDDLEWARE ─────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided!' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
}

// ── MONGODB INIT ────────────────────────────────────────
const defaultData = {
  products: [
    {
      id: 'netflix-premium', name: 'Netflix Premium', category: 'streaming',
      description: 'Full HD & Ultra HD streaming. Four screens simultaneously.',
      price: { amount: 350, currency: 'BDT', display: '৳350' },
      icon: 'netflix', badge: 'Popular', available: true, rating: 4.8,
      reviews: []
    },
    {
      id: 'spotify-premium', name: 'Spotify Premium', category: 'streaming',
      description: 'Ad-free music streaming. Offline downloads.',
      price: { amount: 250, currency: 'BDT', display: '৳250' },
      icon: 'spotify', badge: null, available: true, rating: 4.7,
      reviews: []
    }
  ]
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bonded_bazar')
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Seeding default products...');
      await Product.insertMany(defaultData.products);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));


// ── API ENDPOINTS ───────────────────────────────────────

// 0. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || 'B@ndedF@ysa!')) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid Password' });
  }
});

// 1. Get all products (Public)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1a. Update Product (Protected)
app.put('/api/products/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1b. Create Product (Protected)
app.post('/api/products', authMiddleware, async (req, res) => {
  try {
    const newProduct = new Product({
      id: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      ...req.body
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1c. Toggle Product Stock (Protected)
app.put('/api/products/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    product.available = !product.available;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Post a review (Public)
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    const review = {
      id: Date.now().toString(),
      ...req.body,
    };
    product.reviews.push(review);
    await product.save();
    
    // Notify Discord
    sendDiscordNotification(`⭐ **New ${review.rating}-Star Review on ${product.name}!**\n*"${review.comment}"* - ${review.author}`);
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create an order (Checkout) (Public)
app.post('/api/orders', async (req, res) => {
  try {
    const { cart, paymentMethod, paymentSender, paymentTrx, customerName, customerEmail } = req.body;
    if (!cart || !paymentMethod) return res.status(400).json({ error: 'Invalid order' });

    let total = 0;
    cart.forEach(item => { total += (item.price.amount * item.qty); });

    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const orderDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const newOrder = new Order({
      id: orderId,
      date: orderDate,
      status: 'Pending',
      customerName: customerName || '',
      customerEmail: customerEmail || '',
      total,
      items: cart,
      payment: { method: paymentMethod, sender: paymentSender, trx: paymentTrx },
      deliveredCodes: []
    });

    await newOrder.save();

    // Notify Discord
    sendDiscordNotification(`🛒 **New Order Placed!**\n**ID:** ${orderId}\n**Customer:** ${customerName || 'N/A'} (${customerEmail || 'no email'})\n**Total:** ৳${total}\n**Payment:** ${paymentMethod} (${paymentTrx})`);

    // Send confirmation email (non-blocking)
    if (customerEmail) {
      sendOrderConfirmationEmail({
        to: customerEmail,
        customerName: customerName || 'Customer',
        orderId,
        orderDate,
        items: cart,
        total,
        paymentMethod
      });
    }

    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Admin Get Orders (Protected)
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin Verify/Fulfill/Reject Order (Protected)
app.post('/api/admin/orders/:id/verify', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    
    if (status === 'Delivered' && (!order.deliveredCodes || order.deliveredCodes.length === 0)) {
      order.deliveredCodes = order.items.map(item => ({
        productName: item.name,
        qty: item.qty,
        code: Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
      }));
      sendDiscordNotification(`✅ **Order Fulfilled!**\n**ID:** ${order.id} has been processed and codes delivered.`);
    } else if (status === 'Rejected') {
      sendDiscordNotification(`❌ **Order Rejected!**\n**ID:** ${order.id} has been rejected.`);
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Admin Delete Order (Protected)
app.delete('/api/admin/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    sendDiscordNotification(`🗑️ **Order Deleted**\n**ID:** ${req.params.id} was permanently deleted by admin.`);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Admin Get Stats (Protected)
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    
    // Find out of stock or low stock (<= 5)
    const lowStockProducts = await Product.find({ $or: [{ available: false }, { stock: { $lte: 5 } }] }, 'id name stock available');
    const outOfStockCount = lowStockProducts.filter(p => !p.available || p.stock <= 0).length;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const todayOrders = await Order.find({ date: today, status: { $ne: 'Rejected' } });
    const ordersToday = todayOrders.length;
    const revenueToday = todayOrders.reduce((acc, order) => acc + order.total, 0);

    // Calculate Month Revenue & AOV
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthOrders = await Order.find({ createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Rejected' } });
    const revenueMonth = monthOrders.reduce((acc, order) => acc + order.total, 0);
    const aov = monthOrders.length > 0 ? (revenueMonth / monthOrders.length) : 0;

    // Calculate 7-day history for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days including today
    sevenDaysAgo.setHours(0,0,0,0);
    
    const weekOrders = await Order.find({ createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Rejected' } });
    
    const revenueHistory = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayStart = new Date(d); dayStart.setHours(0,0,0,0);
      const dayEnd = new Date(d); dayEnd.setHours(23,59,59,999);
      
      const dailyOrders = weekOrders.filter(o => o.createdAt >= dayStart && o.createdAt <= dayEnd);
      const dailyRev = dailyOrders.reduce((acc, order) => acc + order.total, 0);
      
      revenueHistory.push({ date: dayName, revenue: dailyRev });
    }

    res.json({ 
      totalProducts, 
      pendingOrders, 
      ordersToday, 
      revenueToday, 
      revenueHistory, 
      revenueMonth, 
      aov: Math.round(aov),
      outOfStockCount,
      lowStockProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Cloudinary Upload (Protected)
app.post('/api/admin/upload', authMiddleware, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    res.json({ imageUrl: req.file.path });
  });
});

// 8. Order Tracking (Public)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CHAT SYSTEM ENDPOINTS ───────────────────────────────

// Get messages for an order (Customer & Admin)
app.get('/api/orders/:id/messages', async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a message (Customer & Admin)
app.post('/api/orders/:id/messages', upload.single('image'), async (req, res) => {
  try {
    const { sender, text } = req.body;
    if (!sender) return res.status(400).json({ error: 'Sender is required' });
    if (!text && !req.file) return res.status(400).json({ error: 'Text or image is required' });

    const orderId = req.params.id;
    
    // Check if order exists
    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path;
    }

    const newMessage = new Message({
      orderId,
      sender,
      text: text || '',
      imageUrl,
      read: sender === 'admin' ? true : false // If admin sends, it's read by admin. If customer sends, it's unread.
    });

    await newMessage.save();

    // If customer sends message, set order to unresolved
    if (sender === 'customer') {
      order.resolved = false;
      await order.save();
      // Optional: Notify Discord for customer chat message
      if (process.env.DISCORD_WEBHOOK_URL) {
         sendDiscordNotification(`💬 **New Message on ${orderId}**\n**From:** Customer\n**Text:** ${text || '[Image Attachment]'}\n<http://localhost:8080/admin>`);
      }
    }

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all conversations for Admin
app.get('/api/admin/messages', authMiddleware, async (req, res) => {
  try {
    // We want to fetch all orders, and for each order, fetch the latest message and count unread messages.
    // To make it simple, we can fetch all orders, then fetch messages for them. Or aggregate.
    
    // Simplest approach: fetch all orders, then aggregate messages in JS or do a simple DB aggregation.
    // Let's do a basic loop since data size is small for now.
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    const result = [];
    
    for (const order of orders) {
      const messages = await Message.find({ orderId: order.id }).sort({ createdAt: -1 });
      if (messages.length > 0) {
        const unreadCount = messages.filter(m => m.sender === 'customer' && !m.read).length;
        result.push({
          orderId: order.id,
          customerName: order.customerName,
          status: order.status,
          resolved: order.resolved,
          lastMessage: messages[0],
          unreadCount
        });
      }
    }
    
    // Sort by last message time
    result.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark messages in an order as read by Admin
app.patch('/api/admin/messages/:id/read', authMiddleware, async (req, res) => {
  try {
    await Message.updateMany(
      { orderId: req.params.id, sender: 'customer', read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle resolved status of an order
app.patch('/api/admin/orders/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const { resolved } = req.body;
    const order = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: { resolved } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, resolved: order.resolved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bonded Bazar Backend running on http://localhost:${PORT}`);
});
