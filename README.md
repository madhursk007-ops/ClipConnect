# ClipConnect - Premium Video Editor Marketplace

A full-stack, production-ready SaaS web application connecting video editors with clients/content creators.

## 🎬 Overview

ClipConnect is a premium marketplace platform that bridges the gap between talented video editors and clients seeking professional video editing services. Built with modern technologies and best practices, it offers a seamless experience for both editors and clients.
- **Editor Profiles**: Showcase portfolios, skills, pricing, and availability
- **Project Marketplace**: Clients post projects, editors submit proposals
- **Real-time Messaging**: Built-in chat system for collaboration
- **Rating & Review System**: Build trust through community feedback
- **Advanced Search & Filtering**: Find the perfect match for your project

### Premium UI/UX
- **Cinematic Design**: Dark theme with electric purple and neon blue accents
- **Smooth Animations**: Framer Motion-inspired transitions and micro-interactions
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Glassmorphism Effects**: Modern UI with depth and transparency
- **Loading States**: Skeleton screens and smooth transitions

## 🛠 Tech Stack

### Frontend
- **HTML5** with semantic markup
- **CSS3** with custom properties and animations
- **Vanilla JavaScript** (ES6+)
- **Font Awesome** for icons
- **Google Fonts** (Inter & Poppins)

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Helmet** for security
- **Rate limiting** for API protection

## 📁 Project Structure

```
ClipConnect/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Message.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── messages.js
│   │   └── reviews.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── css/
│   │   ├── styles.css
│   │   ├── animations.css
│   │   └── auth.css
│   ├── js/
│   │   ├── main.js
│   │   ├── auth.js
│   │   └── animations.js
│   ├── index.html
│   └── (additional HTML pages)
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ClipConnect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy .env file and update with your credentials
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/clipconnect
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Update `MONGODB_URI` with your connection string

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   The API will be running at `http://localhost:5000`

6. **Frontend Setup**
   ```bash
   cd ../frontend
   ```
   
   You can serve the frontend using any static server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js serve package
   npx serve . -p 3000
   
   # Using Live Server extension in VS Code
   ```

7. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - API Health Check: `http://localhost:5000/api/health`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "editor",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Professional video editor"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### User Endpoints

#### Get All Users
```http
GET /api/users?role=editor&skills=video-editing&page=1&limit=10
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Get Featured Editors
```http
GET /api/users/editors/featured?limit=6
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "YouTube Video Editing",
  "description": "Need editing for 10-minute YouTube video",
  "category": "video-editing",
  "budget": 500,
  "deadline": "2024-02-01T00:00:00.000Z",
  "requirements": {
    "duration": "10 minutes",
    "format": "YouTube",
    "revisions": 2
  }
}
```

#### Get Projects
```http
GET /api/projects?status=open&category=video-editing&page=1&limit=10
```

#### Submit Proposal
```http
POST /api/projects/:id/proposals
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I can help with this project",
  "estimatedTime": "3 days",
  "proposedBudget": 450
}
```

### Message Endpoints

#### Get Conversations
```http
GET /api/messages?page=1&limit=20
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipient": "user_id",
  "content": "Hello, I'm interested in your project",
  "project": "project_id"
}
```

## 🎨 Design System

### Color Palette
- **Primary Black**: `#0B0B0F`
- **Secondary Black**: `#1a1a1f`
- **Accent Purple**: `#7F5AF0`
- **Accent Blue**: `#2CB9FF`
- **Accent Pink**: `#FF2E63`

### Typography
- **Headings**: Poppins (300-800 weight)
- **Body**: Inter (400-600 weight)

### Animations
- **Page Transitions**: Fade + slide effects
- **Hover States**: Smooth transforms and glows
- **Loading States**: Skeleton screens and spinners
- **Scroll Animations**: Intersection Observer-based reveals

## 🔧 Development

### Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (when implemented)
```

### Code Style
- **ES6+** JavaScript features
- **Modular CSS** with custom properties
- **Semantic HTML5** markup
- **Responsive-first** design approach

### Browser Support
- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy the Node.js application

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend (if using build tools)
2. Deploy the static files
3. Update API base URL in JavaScript files

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
PORT=5000
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevent API abuse and brute force attacks
- **Helmet.js**: Security headers for Express
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](#-api-documentation)
2. Review the [Troubleshooting](#troubleshooting) section
3. Create an issue in the repository
4. Contact the development team

## 🔮 Future Features

- [ ] Real-time notifications
- [ ] Video file upload and preview
- [ ] Advanced analytics dashboard
- [ ] Mobile applications (React Native)
- [ ] Payment integration (Stripe)
- [ ] Advanced search with AI recommendations
- [ ] Portfolio video hosting
- [ ] Collaborative editing tools
- [ ] Subscription plans for premium features

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

#### CORS Issues
- Check frontend URL in CORS configuration
- Ensure API base URL is correct in frontend

#### Authentication Errors
- Verify JWT secret is set
- Check token expiration
- Ensure proper Authorization header format

#### Styling Issues
- Clear browser cache
- Check CSS file imports
- Verify CSS custom properties support

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=clipconnect:*
```

---

**Built with ❤️ by the ClipConnect Team**
