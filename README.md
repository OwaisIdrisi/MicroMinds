# 🧠 MicroMinds

MicroMinds is a full-stack blog application where users can **create, edit, delete, and read blogs**.  
It includes **user authentication, authorization, image upload,like blog, and other users blogs**.  

---

## 🚀 Features
- 🔐 User Authentication (JWT-based with access + refresh tokens)
- ✍️ Create, Read, Update, Delete (CRUD) blogs
- 🖼️ Image Upload (Cloudinary + Multer)
- ❤️ Like and interact with blogs from other users
- 🎨 Modern UI with React + Tailwind CSS
- 🌐 Deployed on **Vercel (frontend)** & **Render (backend)**

---

## 🛠️ Tech Stack

### Frontend
- React
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer + Cloudinary
- JWT Authentication

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/OwaisIdrisi/MicroMinds.git
cd MicroMinds
```
### 2. Setup Backend
```
cd server
npm install
```
Create a .env file in the backend folder and add
```
PORT=8000
MONGO_URI=
CORS_ORIGIN=*
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=10d
```
Run backend:

```npm run dev```

### 3. Setup Frontend

```
cd frontend
npm install
```

Run frontend:

```npm run dev```


---

## ⚡ Deployment

Frontend → Vercel

Backend → Render



---

## 🔮 Future Enhancements

🌟 Comments on blogs

🌟 admin dashboard

🌟 Rich text editor for blogs

🌟 Dark mode support



---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a PR.


---
 **Created by Owais Idrisi**
