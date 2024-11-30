# **Cura Project**

## **Project Overview**

Cura is a MERN stack application designed for managing appointments and patient records. This repository includes both the **backend** (Node.js/Express) and **frontend** (React) codebases.

---

## **Getting Started**

### **1. Clone the Repository**

Run the following command to clone the repository:

git clone <repository-url>

### **2. Create a New Branch**

Before working on a feature, create a new branch:

git checkout -b feature/<new-feature-name>

---

### **3. Install Dependencies**

To install dependencies for both the backend and frontend:

#### **Backend**

Navigate to the `backend` folder:

cd backend

Install dependencies:

npm install

#### **Frontend**

Navigate to the `frontend` folder:

cd ../frontend

Install dependencies:

npm install

### **4. Run the Application**

#### **Backend**

Start the backend server:

cd backend
npm run dev

#### **Frontend**

Start the frontend React app:

cd ../frontend
npm start

---

### **5. Access the Application**

- Open your browser and navigate to `http://localhost:3000` for the frontend.
- The backend API runs on `http://localhost:5000`.

---

## **Working on a Feature**

1. Ensure you are working on your feature branch:
   git checkout feature/<new-feature-name>
2. After making changes, commit them:
   git add .
   git commit -m "Add <description of changes>"
3. Push your branch to the repository:
   git push origin feature/<new-feature-name>

---

## **Common Commands**

Here are some frequently used Git and npm commands:

### **Git**

- **Switch Branches**:
  git checkout <branch-name>
- **Merge a Branch**:
  git merge feature/<branch-name>

### **npm**

- **Run the Backend Server**:
  npm run dev
- **Run the Frontend**:
  npm start

---

## **Troubleshooting**

1. **MongoDB Not Running**:
   Ensure MongoDB is running locally. Start it using:

   mongod

2. **CORS Issues**:
   If you encounter CORS errors, ensure the frontend uses the correct backend URL (defined in the `proxy` field in `frontend/package.json`).

3. **Missing Dependencies**:
   If `npm install` fails, try deleting `node_modules` and reinstalling:
   rm -rf node_modules
   npm install

---
