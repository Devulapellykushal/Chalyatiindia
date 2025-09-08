import React, { Suspense, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import navlogo from './assets/navlogo.png';
import CardNav from './components/CardNav.jsx';
import Footer from './components/Footer.jsx';
import LoadingPage from './components/LoadingPage.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Admin from './pages/Admin';
import Browse from './pages/Browse';
import CarDetails from './pages/CarDetails';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Terms from './pages/Terms';
import { CarsProvider } from './state/CarsContext';
import { suppressResizeObserverErrors } from './utils/resizeObserverUtils';

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Suppress ResizeObserver errors
    suppressResizeObserverErrors();
    
    // Show loading page for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
        { label: "Corporate", href: "/cars", ariaLabel: "Corporate rentals" }
      ]
    },
    {
      label: "Support",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Help Center", href: "/cars", ariaLabel: "Help center" },
        { label: "Terms", href: "/legal/terms", ariaLabel: "Terms of service" },
        { label: "Privacy", href: "/legal/privacy", ariaLabel: "Privacy policy" }
      ]
    }
  ];

  return (
    <CarsProvider>
      <Router>
        <div className="App">
          {/* Diagonal Grid Background - Last Layer */}
          <div className="diagonal-grid-bg"></div>
          
          {isLoading ? (
            <LoadingPage />
          ) : (
            <>
              <ScrollProgress />
              <CardNav
                logo={navlogo}
                logoAlt="CHALYATI"
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
                  <Route path="/legal/terms" element={<Terms />} />
                  <Route path="/legal/privacy" element={<Privacy />} />
                  <Route path="/legal/refund" element={<Refund />} />
                </Routes>
              </Suspense>
              <Footer />
            </>
          )}
        </div>
      </Router>
    </CarsProvider>
  );
}

export default App;
