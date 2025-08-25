# CarRentPro - Modern Car Rental Application

A sleek, modern car rental application built with React and enhanced with GSAP animations.

## ✨ Features

- **Modern Navigation**: Animated CardNav component with GSAP-powered interactions
- **Focus Cards**: Interactive car cards with hover effects and smooth animations
- **Responsive Design**: Mobile-first approach with smooth transitions
- **Advanced Filtering**: Comprehensive search and filter system
- **Smooth Animations**: GSAP-powered animations for enhanced user experience

## 🚀 Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.8.0
- **Animations**: GSAP (GreenSock Animation Platform)
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Context API with useReducer
- **Performance**: Hardware acceleration and optimized animations

## 📁 Project Structure

```
car-rental-frontend/
├── src/
│   ├── components/
│   │   ├── CardNav.js          # Modern animated navigation
│   │   ├── CardNav.css         # Navigation styles
│   │   ├── FocusCarCards.js    # Interactive car cards
│   │   ├── Filters.js          # Search and filter component
│   │   ├── Footer.js           # Application footer
│   │   └── CarCard.js          # Individual car card
│   ├── pages/
│   │   ├── Home.js             # Landing page
│   │   ├── Browse.js           # Car browsing page
│   │   ├── CarDetails.js       # Individual car details
│   │   ├── Contact.js          # Contact page
│   │   ├── Admin.js            # Admin panel
│   │   ├── Terms.js            # Terms of service
│   │   ├── Privacy.js          # Privacy policy
│   │   └── Refund.js           # Refund policy
│   ├── state/
│   │   └── CarsContext.js      # Global car state management
│   ├── store/
│   │   └── seed.js             # Sample car data
│   ├── App.js                  # Main application component
│   ├── index.js                # Application entry point
│   └── styles.css              # Global styles and CSS variables
├── public/
│   └── index.html              # HTML template
└── package.json                 # Dependencies and scripts
```

## 🎨 Key Components

### CardNav
- **GSAP Animations**: Smooth height transitions and staggered card reveals
- **Responsive Design**: Mobile-optimized with collapsible menu
- **Modern UI**: Card-based navigation with hover effects
- **Accessibility**: Proper ARIA labels and keyboard navigation

### FocusCarCards
- **Interactive Cards**: Hover-to-focus with blur effects
- **Smooth Transitions**: Hardware-accelerated animations
- **Performance Optimized**: Uses `will-change` and `transform3d`
- **Responsive Grid**: Adapts to different screen sizes

## 🚗 Car Data

The application includes 24 diverse vehicles:
- **Luxury**: Mercedes-Benz, BMW, Audi, Lexus
- **Sports**: Porsche, Ferrari, Lamborghini, McLaren
- **SUVs**: Range Rover, Land Cruiser, X5, Q7
- **Electric**: Tesla Model S, Model 3, Model X
- **Hybrid**: Prius, Camry Hybrid, Accord Hybrid
- **Compact**: Civic, Corolla, Golf, Focus

## 🎯 Installation & Usage

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🎭 Animation Features

- **GSAP Integration**: Professional-grade animations
- **Smooth Scrolling**: Enhanced scroll behavior
- **Hardware Acceleration**: Optimized for 60fps performance
- **Responsive Animations**: Adapts to device capabilities

## 🔧 Customization

### Colors
CSS variables for easy theming:
```css
:root {
  --bg: #0f0f23;
  --card: #1a1a2e;
  --acc: #3b82f6;
  --text: #ffffff;
}
```

### Navigation Items
Configure navigation in `App.js`:
```javascript
const navItems = [
  {
    label: "Browse",
    bgColor: "#0D0716",
    links: [
      { label: "All Cars", href: "/cars" }
    ]
  }
];
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 768px, 1024px, 1440px
- **Touch Friendly**: Optimized for touch interactions
- **Performance**: Optimized animations for mobile devices

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Suspense boundaries for smooth loading
- **Hardware Acceleration**: CSS transforms and will-change
- **Optimized Images**: SVG placeholders and error handling

## 🔍 Search & Filtering

- **Real-time Search**: Instant results as you type
- **Advanced Filters**: Brand, type, transmission, fuel, price
- **URL State**: Shareable filtered results
- **Responsive Filters**: Mobile-optimized filter sidebar

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using React and GSAP
