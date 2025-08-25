import React, { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CardNav from './components/CardNav';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import Browse from './pages/Browse';
import CarDetails from './pages/CarDetails';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Terms from './pages/Terms';
import { CarsProvider } from './state/CarsContext';

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const navItems = [
    {
      label: "Browse",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "All Cars", href: "/cars", ariaLabel: "Browse all cars" },
        { label: "Featured", href: "/cars?featured=true", ariaLabel: "Featured cars" },
        { label: "Luxury", href: "/cars?type=luxury", ariaLabel: "Luxury cars" },
        { label: "Sports", href: "/cars?type=sports", ariaLabel: "Sports cars" }
      ]
    },
    {
      label: "Services", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Rent a Car", href: "/cars", ariaLabel: "Rent a car" },
        { label: "Long Term", href: "/cars", ariaLabel: "Long term rentals" },
        { label: "Corporate", href: "/contact", ariaLabel: "Corporate rentals" }
      ]
    },
    {
      label: "Support",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Contact", href: "/contact", ariaLabel: "Contact us" },
        { label: "Help Center", href: "/contact", ariaLabel: "Help center" },
        { label: "Terms", href: "/legal/terms", ariaLabel: "Terms of service" },
        { label: "Privacy", href: "/legal/privacy", ariaLabel: "Privacy policy" }
      ]
    }
  ];

  return (
    <CarsProvider>
      <Router>
        <div className="App">
          <CardNav
            logoAlt="CarRentPro"
            items={navItems}
            baseColor="#000000"
            menuColor="#ffffff"
            buttonBgColor="#ffffff"
            buttonTextColor="#000000"
            ease="power3.out"
          />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cars" element={<Browse />} />
              <Route path="/cars/:id" element={<CarDetails />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              <Route path="/legal/refund" element={<Refund />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </CarsProvider>
  );
}

export default App;
