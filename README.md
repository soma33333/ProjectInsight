# ProjectInsight

**ProjectInsight** is a full-stack web application that empowers users to share and collaborate on project ideas and details. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it offers a user-friendly interface where users can post, edit, and explore projects while fostering a collaborative environment.

--

## Features

- **User Authentication:** Secure sign-up and login functionality to ensure only authorized users can post or edit projects.
- **Project Posting:** Users can create detailed project posts including titles, descriptions, technologies used, and more.
- **Edit & Update:** Users can edit or update their own project posts.
- **Project Browsing:** View all posted projects with easy navigation and filtering options.
- **Comments:** Users can add comments to project posts to provide feedback, suggestions, or ask questions.
- **Contact Contributors:** Users can contact project contributors directly for collaboration or inquiries.
- **Responsive Design:** Optimized for desktops, tablets, and mobile devices.

---

## Tech Stack

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **State Management:** React Context API

---

## Installation & Setup

### Prerequisites
- Node.js & npm
- MongoDB (local or cloud-based like MongoDB Atlas)

### Clone the Repository
```bash
https://github.com/soma33333/ProjectInsight.git
cd projectinsight
```

### Backend Setup
```bash
cd backend
npm install

# Create a .env file and add the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

nodemon index.js
```

### Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

The app will run at `http://localhost:3000` and the backend server at `http://localhost:5000`.

---

## Folder Structure

```
projectinsight/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
├── .env
└── README.md
```

---

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

---

## Deployed Application

You can access the live version of **ProjectInsight** here:

- **Vercel Deployment-Frontend:** [https://projectinsightfrontend.vercel.app/](https://projectinsightfrontend.vercel.app/)
- **Vercel Deployment-Backend:** [https://projectinsightbackend.vercel.app/](https://projectinsightbackend.vercel.app/)

---

## Contact

For any questions or suggestions, feel free to reach out:

- **Name:** Somashekar (Soma)
- **Email:** somashekar.n3333@example.com
- **GitHub:** [soma33333](https://github.com/soma33333)

