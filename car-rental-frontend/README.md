# CHALYATI - Premium Car Rental Service

A modern, responsive car rental website built with React, featuring a sleek dark theme and comprehensive car management system.

## ✨ Features

- **Modern Dark Theme**: Elegant black & white design
- **Responsive Design**: Mobile-first approach with smooth animations
- **Dynamic Filtering**: Real-time search and filter capabilities
- **Admin Panel**: Complete car management system
- **Real-time Data**: Live inventory updates
- **WhatsApp Integration**: Direct customer communication
- **Smooth Transitions**: Hardware-accelerated animations
- **Performance Optimized**: Uses `will-change` and `transform3d`
- **Responsive Grid**: Adapts to different screen sizes

## 🚗 Car Data

The application includes 20 diverse vehicles from your current inventory:
- **Renault**: KWID, KIGER variants
- **Honda**: CITY sedan
- **Suzuki**: BALENO, BREZZA VXI, DZIRE
- **Toyota**: GLANZA hatchback
- **Tata**: NEXON EV variants, ALTROZ
- **Hyundai**: i20 hatchback
- **Kia**: SELTOS, CARENS, SONET
- **Mercedes-Benz**: C220d variants
- **Audi**: Q3 30 TDI

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
  --bg: #000000;
  --card: #111111;
  --acc: #ffffff;
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

## 🚀 Performance Features

- **Lazy Loading**: Components load on demand
- **Optimized Images**: Efficient image handling
- **Smooth Animations**: 60fps performance
- **Fast Navigation**: Instant page transitions

## 🔒 Security

- **Admin Authentication**: Password-protected admin panel
- **Data Validation**: Input sanitization and validation
- **Secure Storage**: Local storage with data integrity checks

## 📊 Data Management

- **Dynamic Filters**: Brand, type, transmission, fuel filters
- **Real-time Search**: Instant search results
- **Price Range Filtering**: Flexible pricing options
- **Owner Information**: Direct contact details for each vehicle

## 🌟 Future Enhancements

- **Phase 2**: Availability calendar and payment integration
- **Advanced Booking**: Multi-day rental options
- **Customer Reviews**: Rating and feedback system
- **Mobile App**: Native mobile application
