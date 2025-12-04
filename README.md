# 🎓 Full-Stack Scholarship Platform

A comprehensive **full-stack scholarship platform** built with **Node.js, Express, MongoDB, React, Vite, Tailwind**, and an **AI-powered chatbot**. This platform includes separate apps for users and admin, complete CRUD functionality, JWT authentication, and smart search capabilities.


# Connect Scholarship Portal 🚀

Excited to share my latest project: **Opportunity Portal**!  

I’ve built a **full-stack platform** to manage and track global opportunities and funding posts.  

---

## Features

- ✅ **Post Management**: Create, approve, and track opportunities  
- ✅ **Subscriber System**: Users get email updates for new posts  
- ✅ **Role-based Users**: Admins and regular users with secure authentication  
- ✅ **Analytics Dashboard**: Built in **Metabase** with KPIs, charts, and automated daily/weekly email reports  

---

## Tech Stack

- **Backend**: Node.js, Express  
- **Database**: MongoDB  
- **Frontend**: React.js  
- **Analytics**: Metabase  

---

## Learning Outcomes

This project helped me practice:

- Backend development and API design  
- Database modeling and management  
- Data analytics and dashboard creation  

---

## Screenshot

- Metabase Dashboard (screenshot o: <img width="1058" height="818" alt="image" src="https://github.com/user-attachments/assets/9111c292-2cc5-4855-974a-ca41d7021a9b" />
 

---

*This project showcases my ability to build end-to-end web applications with real-world features, including analytics and automated reporting.*

### 🚀 Quick Start

## Backend
```
cd backend
npm install
# Create .env file with:
# MONGO_URI=<Your MongoDB URI>
# JWT_SECRET=<Your JWT Secret>
npm run dev
```
## Frontend
```
cd frontend
npm install
# Create .env with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```
## Admin
```
cd admin
npm install
# Create .env with:
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

🌟 Features
## User Frontend

1. User registration & login

2. JWT-based authentication

3. Post creation & management

4. Search & filter scholarships

5. Responsive UI with Tailwind

6. Protected routes

## Admin Panel

1. Completely separate React app (port 3001)

2. Dashboard with charts & statistics

3. User management (CRUD)

4. Post moderation & approval

5. Role-based access control

## Backend

1. Node.js + Express REST API

2. MongoDB for data storage

3. JWT authentication & authorization

4. CRUD operations for posts & users

5. Admin-specific routes

## AI Chatbot

1. Floating chat UI

2. Real-time messaging

3. Free keyword-based search

4. Quick suggestion chips & chat history

5. Supports queries like:

"Fully funded scholarships in USA"

"Masters programs in Germany"

"Upcoming deadlines for engineering scholarships"

# Database Schema

1. Users: _id, name, email, password, role

2. Posts/Scholarships: _id, title, description, country, fundingType, deadline, createdBy, status

3. Admin: _id, username, email, password, role


 # Free Keyword-Based Version

No API key required

Just copy the free version code into frontend and backend

Provides basic keyword matching for scholarship search





# 🔧 Troubleshooting

Make sure .env files are correctly configured

MongoDB is running or Atlas URI is valid

Ports 5000 (backend), 3000 (user frontend), 3001 (admin) are free

For CORS issues, check backend cors middleware configuration

# 📚 References

React Docs: https://reactjs.org

Vite Docs: https://vitejs.dev

Tailwind CSS: https://tailwindcss.com

MongoDB: https://www.mongodb.com

OpenAI API: https://platform.openai.com

🎉 Project Ready!

This full-stack scholarship platform is production-ready, modular, and scalable.
Enjoy exploring, contributing, and extending your platform with features like voice input, multi-language support, or chat history export! 🚀


---
