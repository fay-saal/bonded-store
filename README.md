<div align="center">

# Bonded Bazar v1.0

**A premium digital storefront built for speed, aesthetics, and flawless user experiences.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<a href="https://github.com/fay-saal/bonded-store.git">🐙 Repository</a> &nbsp;&nbsp;•&nbsp;&nbsp; <a href="https://github.com/fay-saal/bonded-store/issues">🐙 Issues</a>

</div>

<br>

```diff
+ $ npm run start
+   Initializing Bonded Bazar...
+     Database: MongoDB Connected successfully
+     Storage: Cloudinary initialized
+   Services: Storefront & Admin APIs online
+       Port: 3000
+       Environment: Production
+ ✔ System fully operational - 235ms
```

<br>

---
### `> tech stack`
---
<br>

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

<br>

---
### `> core features`
---
- **Storefront UI:** Premium glassmorphism aesthetics with fluid typography and native-feeling mobile responsiveness. No heavy frontend frameworks.
- **Cart & Checkout:** Frictionless bKash checkout verification with persistent local order history ("My Orders").
- **Live Order Chat:** Built-in real-time customer/dealer messaging with Cloudinary-backed screenshot attachments.
- **Admin Analytics:** Live-calculating charts and stats (Revenue, Orders, AOV), low-stock warnings, and inline inventory editing.
- **Order Management:** Fulfill, Reject, or Verify orders instantly. Auto-generates delivery codes and pings Discord webhooks.

<br>

---
### `> environment variables`
---

| Variable | Required | Description |
|---|:---:|---|
| `PORT` | ✅ | The port number your server will run on (e.g., 3000) |
| `MONGODB_URI` | ✅ | MongoDB connection string for the primary database |
| `JWT_SECRET` | ✅ | Cryptographic key used to sign Admin session tokens |
| `ADMIN_PASSWORD` | ✅ | Master password required to access the admin dashboard |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary credentials for chat image uploads |
| `CLOUDINARY_API_KEY` | ✅ | API Key for Cloudinary image processing |
| `CLOUDINARY_API_SECRET`| ✅ | API Secret for Cloudinary authentication |
| `DISCORD_WEBHOOK_URL` | ⚡️ | Optional: Webhook URL to receive live order/review notifications |

<br>

---
### `> license`
---
MIT © 2026 Faysal (DieBack Theatre)

<br>

---
### 🔗 `> links`
---
- **Repository:** [github.com/fay-saal/bonded-store](https://github.com/fay-saal/bonded-store.git)
- **Issues:** [github.com/fay-saal/bonded-store/issues](https://github.com/fay-saal/bonded-store/issues)

<br>
<br>

<div align="center">
Built with ⚡️ by <a href="https://github.com/fay-saal">DieBack Theatre</a>
</div>
