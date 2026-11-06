 # 🖥️ TechZone Electronics

**A modern, full-stack e-commerce platform for electronics retailers**  
*Built with React, Supabase (PostgreSQL), and deployed on Cloudflare Pages*

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://techzone-7rl.pages.dev)
[![GitHub](https://img.shields.io/badge/GitHub-Source-black?style=for-the-badge&logo=github)](https://github.com/Abdullahi-Junior/TechZone)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 📖 Overview

TechZone Electronics is a complete, production-ready web application designed for electronics retail businesses. It provides a **customer-facing storefront** for browsing and reserving products, alongside a **secure admin dashboard** for managing inventory, categories, and customer requests.

### 🎯 Business Problem Solved
- **For Shop Owners:** A professional online presence with easy inventory management, requiring no technical skills.
- **For Customers:** A frictionless way to browse products and make reservations via web forms or instant WhatsApp inquiries.
- **For the Business:** Centralized tracking of all customer requests with approval workflows.

---

## ✨ Features

### 🛍️ Customer Storefront
- **Responsive Homepage** with hero banner, category showcase, and featured products.
- **Smart Product Browsing** with real-time search and category filtering.
- **Mobile-First Design** with hamburger menu and native dropdown pickers.
- **Product Detail Pages** with full specifications, stock status, and images.
- **Dual Reservation System:**
  - 📋 Structured web form for formal requests.
  - 💬 One-click WhatsApp integration with pre-filled messages.
- **Category Drawer** for intuitive mobile navigation.

### 🔐 Admin Dashboard
- **Secure Authentication** powered by Supabase Auth.
- **Role-Based Access Control** — only authorized admins can manage the store.
- **Product Management** — Add, edit, delete, activate/deactivate products.
- **Category Management** — Create unlimited custom categories.
- **Image Upload System** — Upload from device OR Insert image URLs.
- **Reservation Management** — View, approve, reject, or complete customer requests.

### 🛡️ Security & Architecture
- **Row Level Security (RLS)** on all database tables.
- **Public read access** only for active products.
- **Protected write access** — only authenticated admins can modify data.
- **Environment variable management** for sensitive credentials.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React , JavaScript  |
| **Backend/Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage  |
| **Security** | Row Level Security (RLS) Policies |
| **Deployment** | Cloudflare Pages (CI/CD via GitHub) |


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account 
- A Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdullahi-Junior/TechZone.git
   cd TechZone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

---

## 📂 Project Structure

```text
TechZone/
├── public/
│   └── _redirects              # SPA routing for Cloudflare
├── src/
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Route components (Home, Products, Admin)
│   ├── services/               # API layer (Supabase calls)
│   ├── lib/
│   │   └── supabase.js         # Supabase client config
│   ├── App.jsx                 # Router setup
│   └── main.jsx                # Entry point
├── .env                        # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md & LICENSE
```

---

## 🔒 Security Considerations

This project implements defense-in-depth security:
1. **Row Level Security (RLS)** — Every database table has policies restricting access based on user role.
2. **Anon Role** — Public users can only READ active products and INSERT reservations.
3. **Authenticated Admin Role** — Only verified admins can UPDATE/DELETE products and manage reservations.
4. **JWT Authentication** — Supabase Auth handles secure session management.
5. **Environment Variables** — Sensitive keys are never committed to GitHub.

---

## 🚧 Future Enhancements (Version 2.0)
- [ ] Customer accounts with reservation history
- [ ] Email notifications via Resend/SendGrid
- [ ] Coupon and loyalty program system
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] Analytics dashboard for shop owners

---

## 👨‍💻 Author

**Engr. Abdullahi**  
Computer Science & Engineering, Graduate  
📧 abdullahi@iut-dhaka.edu  
🔗 [GitHub](https://github.com/Abdullahi-Junior) | [Live Demo](https://techzone-7rl.pages.dev)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<div align="center">
  <strong>If you found this project useful, consider giving it a ⭐ on GitHub!</strong>
</div>