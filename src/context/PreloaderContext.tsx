import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface PreloaderContextType {
  isActive: boolean;
  mode: 'initial' | 'route' | 'ascend';
  routeLabel: string;
  isInitialIntroComplete: boolean;
  triggerAscend: () => void;
  finishPreloader: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | null>(null);

export const usePreloader = (): PreloaderContextType => {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }
  return context;
};

const getRouteLabel = (path: string): string => {
  if (path === '/') return 'HOME';
  if (path.startsWith('/services')) return 'SERVICES';
  if (path.startsWith('/about')) return 'ABOUT';
  if (path.startsWith('/team')) return 'TEAM';
  if (path.startsWith('/portfolio')) return 'PORTFOLIO';
  if (path.startsWith('/contact')) return 'CONTACT';
  return 'ARANEA DEN';
};

interface PreloaderProviderProps {
  children: React.ReactNode;
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({ children }) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(true);
  const [mode, setMode] = useState<'initial' | 'route' | 'ascend'>('initial');
  const [routeLabel, setRouteLabel] = useState<string>(getRouteLabel(location.pathname));
  const [isInitialIntroComplete, setIsInitialIntroComplete] = useState(false);
  
  const isFirstRender = useRef(true);
  const prevPathRef = useRef(location.pathname);

  // Handle route changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      const targetLabel = getRouteLabel(location.pathname);
      setRouteLabel(targetLabel);
      setMode('route');
      setIsActive(true);

      // Scroll immediately while behind preloader curtain
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      
      // Delay-refresh ScrollTrigger after layout stabilizes
      setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [location.pathname]);

  const triggerAscend = useCallback(() => {
    setRouteLabel('ELEVATION');
    setMode('ascend');
    setIsActive(true);
  }, []);

  const finishPreloader = useCallback(() => {
    setIsActive(false);
    if (!isInitialIntroComplete) {
      setIsInitialIntroComplete(true);
    }
    setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);
  }, [isInitialIntroComplete]);

  return (
    <PreloaderContext.Provider
      value={{
        isActive,
        mode,
        routeLabel,
        isInitialIntroComplete,
        triggerAscend,
        finishPreloader,
      }}
    >
      {children}
    </PreloaderContext.Provider>
  );
};
