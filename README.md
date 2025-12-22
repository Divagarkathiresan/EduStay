# EduStay - Student Accommodation Platform

A comprehensive web application for students to find and book accommodation near their universities. Built using **React.js (Frontend)**, **Spring Boot (Backend)**, and **MySQL (Database)**. Deployed on **Render** for production-grade hosting.

---

## 🏠 About EduStay

EduStay is a modern student accommodation platform that connects students with verified property owners, enabling safe, affordable, and convenient housing choices near educational institutions.

---

## ✨ Features

### For Students

* 🔍 **Property Search** — Search by city, district, or university
* 🏘️ **Verified Listings** — Only trusted and validated properties
* 💰 **Budget-Friendly Options** — Tailored for student affordability
* 📱 **Simple Booking Flow** — Seamless booking experience
* 🔐 **Secure Authentication** — JWT-based login and role-based access

### For Property Owners

* 📝 **Add & Manage Listings** — Intuitive property management
* 📊 **Owner Dashboard** — Track property status & student interactions
* 📈 **Property Insights** — Better visibility and marketing support

### Technical Features

* 🔒 **JWT Authentication with 30-minute expiry**
* 🔄 **Auto Logout** on token expiry
* 📱 **Fully Responsive UI**
* 🎨 **Modern & Clean Design**
* 🚀 **Optimized API Architecture**

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* CSS3
* Fetch API

### Backend

* Spring Boot
* Spring Security
* Spring Data JPA
* MySQL
* JWT Authentication
* Maven

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v14+)
* Java 17+
* MySQL 8.0+
* Maven 3.6+

---

## 🗄️ Backend Setup

1. **Clone the Repository**

   ```bash
   git clone <your-repository-url>
   cd EduStay-postgreSql/EduStay/Backend/demo
   ```

2. **Configure MySQL Database**
   In `src/main/resources/application.properties`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/edustay
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   spring.jpa.show-sql=true
   ```

3. **Run the Backend**

   ```bash
   mvn spring-boot:run
   ```

   Backend runs on: **[http://localhost:8080](http://localhost:8080)**

---

## 💻 Frontend Setup

1. **Navigate to the frontend**

   ```bash
   cd ../../../Frontend/myapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

   Frontend runs on: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
EduStay-postgreSql/
├── EduStay/
│   ├── Backend/
│   │   └── demo/
│   │       ├── src/main/java/com/example/demo/
│   │       │   ├── controller/     # REST controllers
│   │       │   ├── entity/         # JPA entities
│   │       │   ├── repository/     # Database access layer
│   │       │   ├── service/        # Business logic
│   │       │   ├── config/         # Security, CORS, JWT configs
│   │       │   └── utils/          # JWT utility classes
│   │       ├── pom.xml
│   │       └── Dockerfile
│   └── Frontend/
│       └── myapp/
│           ├── src/
│           │   ├── components/     # Reusable components
│           │   ├── pages/          # Main pages
│           │   ├── utils/          # API functions
│           │   └── App.js
│           ├── package.json
│           └── public/
└── README.md
```

---

## 🔐 API Endpoints

### Authentication

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/api/auth/users/register` | Register a new user             |
| POST   | `/api/auth/users/login`    | Authenticate user and issue JWT |
| GET    | `/api/auth/users`          | Get all users (protected)       |

### Security Highlights

* JWT token expiration: **30 minutes**
* Auto logout on expiry
* Secure password hashing
* Role-based secured endpoints

---

## 🌐 UI/UX Features

* Clean and modern layout
* Fully responsive (mobile, tablet, desktop)
* Consistent theme and visual hierarchy
* Smooth hover and transition animations
* Accessibility-friendly design

---

## 🔒 Security Features

* Stateless authentication
* Secure API endpoints
* Password hashing with BCrypt
* Token validation filters
* CORS configured for frontend communication

---

## 🚀 Deployment (Render)

### Backend Deployment

1. Create a **Render Web Service**
2. Add environment variables:

   * `DbUrl`
   * `DbUserName`
   * `DbPassword`
3. Build & run with:

   ```bash
   mvn clean package
   java -jar target/demo-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment

1. Run:

   ```bash
   npm run build
   ```
2. Deploy the generated **build/** folder to:

   * Render Static Site
   * Vercel
   * Netlify (optional)

---

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch
3. Commit and push changes
4. Open a pull request

---

## 📝 License

Licensed under the **MIT License**.

---

## 👥 Team

* Frontend: React.js, CSS
* Backend: Spring Boot, MySQL
* UI/UX: Modern User-Centric Design

---

## 📞 Contact

GitHub Repository:
[https://github.com/Divagarkathiresan/EduStay](https://github.com/Divagarkathiresan/EduStay)

