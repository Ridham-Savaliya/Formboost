<<<<<<< HEAD
<div align="center">
  <!-- LOGO -->
  <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1765024967/formboost-favicon-color_af2opq.png" alt="Formboost Logo" width="120" style="margin-bottom:16px;" />

  <!-- Title -->
  <h1 style="font-weight:900; font-size:46px; margin-bottom:0;">Formboost</h1>

  <!-- Subtitle -->
  <p style="font-size:19px; font-weight:500; color:#5e5e5e; margin-top:6px;">
    Smart Forms, Cleaner Insights.
  </p>
</div>




### 🖼 Preview Highlights

<p align="center">

  <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1765024304/8_dbshoi.jpg" width="350" />  
  <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1765024304/11_zlek1t.jpg" width="350" /> 
    <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1765024304/7_rqqvyh.jpg" width="350" />  
  <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1765024304/12_zc9rqv.jpg" width="350" />  
</p>


# 🚀 Formboost

> **Formboost** — The Ultimate Next-Gen Form & Data Management Platform  
> Empower your workflows with powerful, intuitive, and scalable form creation, data visualization, and analytics — all in one seamless experience.

---

<div align="center">
  <img src="https://res.cloudinary.com/dsqpc6sp6/image/upload/v1765025074/Logo_PNG_qhhmqu.png" width="40%" alt="Formboost Logo"/>
</div>
*Your forms, supercharged.*

---

## Table of Contents

- [About Formboost](#about-formboost)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Scripts](#scripts)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## About Formboost

Formboost is a modern, full-stack form builder and data analytics platform designed to simplify data collection and visualization for businesses and developers alike.  
Built with cutting-edge technologies, Formboost offers a premium user experience with robust backend services and a sleek, responsive frontend.

---

## ✨ Features

- **Dynamic Form Builder:** Create customizable forms with drag-and-drop ease.  
- **Real-time Data Visualization:** Interactive charts and dashboards powered by Chart.js, Recharts, and MUI X-Charts.  
- **CSV Export & Data Management:** Export form responses effortlessly with CSV and file-saver integration.  
- **User Authentication & Security:** Secure login with JWT, bcrypt hashing, and rate limiting.  
- **Responsive UI:** Built with Chakra UI, MUI, TailwindCSS, and styled-components for a polished look.  
- **State Management:** Efficient state handling using Recoil.  
- **Notifications:** Real-time toast notifications with React-Toastify.  
- **Backend API:** RESTful API with Express, Sequelize ORM, MySQL, and robust middleware for validation and security.  
- **Email Integration:** Automated emails with Nodemailer and Resend.  
- **Advanced Logging:** Winston and Loki for scalable logging and monitoring.  
- **Google AI Integration:** Leverage Google GenAI for smart form suggestions and analytics.  

---

## 🛠️ Tech Stack

| Frontend                          | Backend                          | Database & Others               |
|----------------------------------|---------------------------------|--------------------------------|
| React 18, Vite                   | Node.js, Express                | MySQL (via Sequelize ORM)       |
| Chakra UI, MUI, TailwindCSS      | JWT, Bcrypt, Helmet, CORS       | Firebase Admin                  |
| React Router DOM, Recoil         | Joi Validation, Multer           | Winston Logging, Loki           |
| Chart.js, Recharts, MUI X-Charts | Nodemailer, Resend               | Google APIs, Google GenAI       |
| React-Toastify, Framer Motion    | Rate Limiter, XSS-Clean          | dotenv for environment config  |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+  
- MySQL Server  
- npm or yarn package manager  

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/formboost.git
cd formboost
```

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database and API keys
npm run migration:run   # Run database migrations
npm run seeder:run:all  # Seed initial data (optional)
npm run dev             # Start backend server in dev mode
```

#### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev             # Start frontend dev server
```

Open your browser at `http://localhost:3000` (or the port shown in terminal).

---

## 📁 Project Structure

```
formboost/
├── backend/                # Express API server
│   ├── src/
│   │   ├── app.js          # Express app setup
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Business logic
│   │   ├── middlewares/    # Security, validation
│   │   ├── models/         # Sequelize models
│   │   ├── migrations/     # DB migrations
│   │   └── utils/          # Helpers and utilities
├── frontend/               # React frontend app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── recoil/         # State management atoms/selectors
│   │   ├── styles/         # Tailwind, Chakra, MUI themes
│   │   └── utils/          # Helpers and API clients
├── README.md               # This file
├── package.json            # Root package config (if monorepo)
```

---

## 📜 Available Scripts

### Backend

| Command                 | Description                              |
|-------------------------|------------------------------------------|
| `npm run dev`           | Start backend server with nodemon        |
| `npm run start`         | Start backend server (production)        |
| `npm run build`         | Build backend with esbuild                |
| `npm run migration:run` | Run database migrations                   |
| `npm run migration:undo`| Undo last migration                       |
| `npm run seeder:run`    | Run seeders                              |
| `npm run lint`          | Run ESLint for code quality               |
| `npm run format`        | Format code with Prettier                 |
=======
# FormBoost

FormBoost is a comprehensive web application that provides a powerful form-building and data management solution. It offers a user-friendly interface for creating and customizing forms, as well as advanced features for data analysis and reporting.

## Installation
>>>>>>> 40af3738882195070cb782017fb42cd1189d4275

### Frontend

1. Clone the repository:
```
git clone https://github.com/your-username/formboost-frontend.git
```
2. Navigate to the project directory:
```
cd formboost-frontend
```
3. Install dependencies:
```
npm install
```
4. Start the development server:
```
npm run dev
```
5. Open your browser and visit `http://localhost:3000` to access the application.

### Backend

1. Clone the repository:
```
git clone https://github.com/your-username/formboost.git
```
2. Navigate to the project directory:
```
cd formboost
```
3. Install dependencies:
```
npm install
```
4. Set up the environment variables:
   - Create a `.env` file in the project root directory.
   - Add the necessary environment variables, such as database connection details, API keys, and other configuration settings.
5. Run the database migrations:
```
npm run migration:run
```
6. Start the development server:
```
npm run dev
```
7. The backend server will be running at `http://localhost:8000`.

## Usage

The FormBoost application provides the following key features:

1. **Form Builder**: Create and customize forms with a wide range of input fields, validation rules, and advanced features.
2. **Data Management**: Collect and store form submissions in a secure database, with options for exporting data in various formats.
3. **Analytics and Reporting**: Analyze form data using powerful visualization tools and generate custom reports.
4. **User Management**: Manage user accounts, roles, and permissions to control access to the application.

To get started, log in to the application and navigate to the "Forms" section to begin creating and managing your forms.

## API

The FormBoost backend provides a RESTful API for interacting with the application programmatically. The API documentation can be found at `http://localhost:8000/api/docs`.

## Contributing

We welcome contributions from the community! If you would like to contribute to the FormBoost project, please follow these steps:

<<<<<<< HEAD
Formboost Team – [contact@formboost.com](mailto:contact@formboost.com)  
GitHub: [https://github.com/Ridham-Savaliya/formboost](https://github.com/yourusername/formboost)  
Twitter: [@formboost](https://twitter.com/formboost)  
=======
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.
>>>>>>> 40af3738882195070cb782017fb42cd1189d4275

Please ensure that your code adheres to the project's coding standards and that you have added appropriate tests.

<<<<<<< HEAD
<p align="center">
  <em>Formboost &mdash; Empowering your data, one form at a time.</em>
</p>

=======
## License

FormBoost is licensed under the [MIT License](LICENSE).

## Testing

The FormBoost project includes a comprehensive test suite to ensure the reliability and stability of the application. To run the tests, use the following commands:

```
# Frontend
npm run lint

# Backend
npm run lint
npm run test
```

Make sure all tests pass before submitting any changes.
>>>>>>> 40af3738882195070cb782017fb42cd1189d4275
