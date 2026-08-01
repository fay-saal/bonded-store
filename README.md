# Bonded Bazar

![Bonded Bazar Banner](./assets/logo.svg)

> **Bonded Bazar** is a premium digital storefront built for speed, aesthetics, and a flawless user experience. Designed specifically for digital product distribution (streaming, gaming, social, and utility subscriptions), it offers a seamless integration between a beautiful frontend and a robust backend.

## 🚀 Features

### **Storefront**
- **Premium Glassmorphism UI:** Modern, sleek, and highly responsive design built with vanilla HTML/CSS.
- **Fluid Typography & Layouts:** Fully optimized for mobile, tablet, and desktop viewing.
- **Dynamic Product Filtering:** Instantly filter between categories like Streaming, Gaming, Social, and Utility.
- **Cart & Checkout:** Intuitive checkout flow with bKash payment verification integration.
- **"My Orders" Hub:** Persistent local order tracking for customers to quickly view the status of all their past purchases.

### **Communication Hub**
- **Real-Time Order Chat:** Customers can communicate directly with dealers regarding specific orders.
- **Image Uploads:** Customers can upload screenshots (e.g., payment proofs) directly in the chat using Cloudinary integration.
- **Discord Webhook Alerts:** The system pings your Discord server automatically when new orders arrive, reviews are posted, or orders are fulfilled.

### **Admin Dashboard**
- **Live Business Analytics:** Track Total Revenue, Order Volume, Average Order Value (AOV), and visualize 7-day trends with integrated charting.
- **Live Stock Management:** Update inventory on the fly with low-stock warnings.
- **Product Management:** Full CRUD capabilities for updating product details, uploading custom images, and toggling visibility.
- **Order Fulfillment:** Approve, Reject, or Fulfill orders. Automatically generates delivery codes when marking orders as "Delivered."
- **Dealer Calculator:** Built-in floating calculator tool for dealers to compute bulk pricing effortlessly.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 / CSS3 (Vanilla, No heavy frameworks)
- Vanilla JavaScript
- Chart.js (for Admin Analytics)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- Multer & Cloudinary (Image Processing & Cloud Storage)
- Resend API (Email Delivery)
- JSON Web Tokens (JWT) for secure Admin Authentication

---

## 🔒 Security & Best Practices

Bonded Bazar prioritizes security for both the administrators and the buyers:
- **Environment Variables:** All secrets (Database URI, API keys, Passwords) are strictly separated using `.env`.
- **Stateless Authentication:** Admin routes are protected using secure JWT tokens.
- **Strict Error Handling:** The backend uses custom middleware to capture upload crashes or database errors, ensuring the server remains alive and responds gracefully.

---

## 📦 Local Development

To run Bonded Bazar locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fay-saal/bonded-store.git
   cd bonded-store
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory with the following credentials:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_PASSWORD=your_admin_dashboard_password
   DISCORD_WEBHOOK_URL=your_discord_webhook
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```

5. **Access the Application:**
   - Storefront: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

---
*Developed by **Faysal Ahmed***
