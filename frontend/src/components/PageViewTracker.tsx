import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Send pageview on route change
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search,
      title: document.title 
    });
  }, [location]);

  return null; // This component doesn't render anything
}

export default PageViewTracker;
