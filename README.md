# 🚀 PDFolio - AI-Powered PDF Generator

![PDFolio](https://user-images.githubusercontent.com/your-gif.gif)  
**AI-driven PDF generation with user authentication, chat, and MongoDB integration**

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-blue?style=for-the-badge)](https://your-vercel-url.com)  
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge)](https://www.mongodb.com/)

---

## 🎯 Features
✅ **Animated Interface** - Welcomes users with a smooth UI  
✅ **User Authentication** - Secure login & signup with MongoDB  
✅ **AI Chat System** - ChatGPT-like interface for topic generation  
✅ **PDF Generation** - Generate and download PDFs seamlessly  
✅ **Profile Management** - Update user details & API keys  
✅ **Vercel Deployment** - Hosted with CI/CD pipeline  

---

## 📂 Project Structure
```plaintext
📦 PDFolio
 ┣ 📂 components         # Reusable UI components
 ┣ 📂 lib                # Utility functions (Rate limit, DB connection, etc.)
 ┣ 📂 pages              # Next.js pages (Dashboard, Auth, etc.)
 ┣ 📂 public             # Static assets
 ┣ 📂 styles             # Global styles (CSS)
 ┣ 📜 package.json       # Dependencies & scripts
 ┗ 📜 README.md          # Project documentation
```

---

## 🚀 Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/PDFolio.git
cd PDFolio
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env.local` file and add:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
MONGODB_URI=
JWT_SECRET=
AI_API_PROVIDER=huggingface
HUGGINGFACE_API_KEY=

```

### 4️⃣ Run Locally
```bash
npm run dev
```

### 5️⃣ Deploy to Vercel
```bash
vercel
```

---

## 📸 Screenshots
![Dashboard](https://user-images.githubusercontent.com/your-dashboard.gif)  
> *A sleek, user-friendly dashboard for managing PDFs*

![PDF Generation](https://user-images.githubusercontent.com/your-pdf-generation.gif)  
> *Real-time AI-powered PDF creation*

---

## 🌍 Live Demo
🔗 [Click here to access PDFolio](https://pdfolio.vercel.app/)

💬 **Have questions?** Open an issue or reach out! 🚀
