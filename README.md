# EduStay - Student Accommodation Platform

A comprehensive web application for students to find and book accommodation near their universities. Built with React.js frontend and Spring Boot backend.

## 🏠 About EduStay

EduStay is a modern student accommodation platform that connects students with verified property owners, making it easy to find safe, affordable, and convenient housing options near universities.

## ✨ Features

### For Students
- 🔍 **Property Search** - Find accommodation by city or university
- ✅ **Verified Properties** - All listings are verified for quality and safety
- 💰 **Budget-Friendly Options** - Properties designed for student budgets
- 📱 **Easy Booking** - Simple and secure online booking process
- 🔐 **Secure Authentication** - JWT-based user authentication

### For Property Owners
- 📝 **List Properties** - Easy property listing management
- 📊 **Owner Dashboard** - Track bookings and manage listings
- 💼 **Marketing Tools** - Promote properties effectively

### Technical Features
- 🔒 **JWT Authentication** - Secure user sessions with 30-minute token expiry
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI/UX** - Professional design with smooth animations
- 🔄 **Auto-logout** - Automatic session management for security

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **CSS3** - Custom styling with modern design principles
- **Fetch API** - HTTP client for API communication

### Backend
- **Spring Boot** - Java-based backend framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **MySQL** - Relational database
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Maven** - Dependency management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divagarkathiresan/EduStay.git
   cd edustay/Backend/demo
   ```

2. **Configure Database**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/edustay
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Run the Backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend**
   ```bash
   cd ../Frontend/myapp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   Frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
EduStay/
├── Backend/
│   └── demo/
│       ├── src/main/java/com/example/demo/
│       │   ├── controller/     # REST API controllers
│       │   ├── entity/         # JPA entities
│       │   ├── repository/     # Data access layer
│       │   ├── service/        # Business logic
│       │   ├── config/         # Security configuration
│       │   └── utils/          # JWT utilities
│       └── pom.xml
└── Frontend/
    └── myapp/
        ├── src/
        │   ├── components/     # Reusable components
        │   ├── pages/          # Page components
        │   ├── utils/          # API utilities
        │   └── App.js
        └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/users/register` - User registration
- `POST /api/auth/users/login` - User login
- `GET /api/auth/users` - Get all users (protected)

### Security Features
- JWT token expiration: 30 minutes
- Automatic logout on token expiry
- Protected routes with authentication middleware
- Secure password handling

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Mobile-first design approach
- **Smooth Animations** - Hover effects and transitions
- **Consistent Branding** - Unified color scheme and typography
- **Accessibility** - WCAG compliant design elements

## 🔒 Security Features

- JWT-based stateless authentication
- Automatic token validation
- Session timeout management
- Protected route navigation
- Secure API communication
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment
```bash
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
npm run build
# Deploy the build folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - React.js, CSS3, Responsive Design
- **Backend Development** - Spring Boot, MySQL, JWT Authentication
- **UI/UX Design** - Modern, Professional Interface

## 📞 Contact

For any queries or support, please reach out:

- **GitHub**: [EduStay Repository](https://github.com/Divagarkathiresan/EduStay.git)

---

⭐ **Star this repository if you find it helpful!**
