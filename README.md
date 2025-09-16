# CHALYATI - Premium Car Rental Platform

A full-stack car rental application built with React frontend and Node.js/Express backend, featuring a modern dark theme and comprehensive car management system.

## 🚀 Project Overview

CHALYATI is a complete car rental platform that allows users to browse, filter, and rent premium vehicles. The application features an elegant dark theme, real-time data management, and a comprehensive admin panel for car inventory management.

## 🏗️ Architecture

```
CHALYATI/
├── car-rental-frontend/     # React frontend application
├── car-rental-backend/      # Node.js/Express backend API
├── deploy.sh               # Deployment script
└── package.json            # Root package configuration
```

## ✨ Features

### Frontend Features
- **Modern Dark Theme**: Elegant black & white design with smooth animations
- **Responsive Design**: Mobile-first approach with hardware-accelerated animations
- **Dynamic Filtering**: Real-time search and filter capabilities
- **Admin Panel**: Complete car management system with authentication
- **Real-time Data**: Live inventory updates via API integration
- **WhatsApp Integration**: Direct customer communication
- **Performance Optimized**: Uses `will-change` and `transform3d` for 60fps performance

### Backend Features
- **MongoDB Integration**: Connected to MongoDB Atlas
- **RESTful API**: Complete CRUD operations for car management
- **Admin Authentication**: JWT-based admin authentication
- **File Upload**: Image upload with Multer
- **Data Validation**: Comprehensive validation using Mongoose schemas
- **Error Handling**: Robust error handling and logging
- **CORS Support**: Configured for frontend integration

## 🚗 Car Inventory

The application includes 20+ diverse vehicles from various brands:
- **Renault**: KWID, KIGER variants
- **Honda**: CITY sedan
- **Suzuki**: BALENO, BREZZA VXI, DZIRE
- **Toyota**: GLANZA hatchback
- **Tata**: NEXON EV variants, ALTROZ
- **Hyundai**: i20 hatchback
- **Kia**: SELTOS, CARENS, SONET
- **Mercedes-Benz**: C220d variants
- **Audi**: Q3 30 TDI

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM** - Client-side routing
- **GSAP** - Professional animations
- **Three.js** - 3D graphics and animations
- **Socket.io Client** - Real-time communication
- **CSS3** - Styling with custom properties

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Socket.io** - Real-time communication
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (>=18.0.0)
- npm (>=8.0.0)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CHALYATI
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   npm run install-backend
   
   # Install frontend dependencies
   npm run install-frontend
   ```

3. **Environment Setup**

   Create `.env` file in `car-rental-backend/`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/car-rental
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_PASSWORD=admin123
   ```

4. **Start the application**
   ```bash
   # Start backend (Terminal 1)
   npm run dev
   
   # Start frontend (Terminal 2)
   cd car-rental-frontend && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin

## 📚 API Documentation

### Cars API
- `GET /api/cars` - Get all cars with filtering and pagination
- `GET /api/cars/featured` - Get featured cars
- `GET /api/cars/stats` - Get car statistics
- `GET /api/cars/options` - Get filter options
- `GET /api/cars/:id` - Get single car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Admin API
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get admin dashboard data
- `POST /api/admin/cars` - Create new car (admin only)
- `PUT /api/admin/cars/:id` - Update car (admin only)
- `DELETE /api/admin/cars/:id` - Delete car (admin only)
- `POST /api/admin/seed` - Seed database (admin only)

### Gallery API
- `GET /api/gallery` - Get gallery images
- `POST /api/gallery` - Upload gallery image (admin only)
- `DELETE /api/gallery/:id` - Delete gallery image (admin only)

## 🔧 Development

### Available Scripts

#### Root Level
```bash
npm start              # Start backend server
npm run dev           # Start backend in development mode
npm run build         # Install backend dependencies
npm run install-backend    # Install backend dependencies
npm run install-frontend   # Install frontend dependencies
npm run build-frontend     # Build frontend for production
```

#### Backend
```bash
cd car-rental-backend
npm start             # Start production server
npm run dev          # Start development server with nodemon
npm run seed         # Seed database with sample data
npm run init-admin   # Initialize admin user
```

#### Frontend
```bash
cd car-rental-frontend
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
```

## 🎨 Customization

### Theme Colors
The application uses CSS custom properties for easy theming:
```css
:root {
  --bg: #000000;        /* Background color */
  --card: #111111;      /* Card background */
  --acc: #ffffff;       /* Accent color */
  --text: #ffffff;      /* Text color */
}
```

### Adding New Cars
1. Access the admin panel at `/admin`
2. Login with admin credentials
3. Use the "Add New Car" form
4. Upload car images
5. Fill in all required details

## 🔒 Security

- **JWT Authentication**: Secure admin authentication
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Proper cross-origin setup
- **Helmet.js**: Security headers
- **Rate Limiting**: API rate limiting (configurable)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 768px, 1024px, 1440px
- **Touch Friendly**: Optimized for touch interactions
- **Progressive Enhancement**: Works on all devices

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd car-rental-frontend
npm run build
# Deploy using Vercel CLI or dashboard
```

### Backend Deployment
The backend can be deployed to any Node.js hosting service:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your-production-jwt-secret
ADMIN_PASSWORD=your-secure-admin-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Devulapellykushal**
- GitHub: [@devulapellykushal](https://github.com/devulapellykushal)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database solution
- All the open-source libraries used in this project

## 📞 Support

For support, email support@chalyati.com or create an issue in the repository.

---

**CHALYATI** - Premium Car Rental Experience 🚗✨
