import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for touch interactions
const TouchInteractionContext = createContext({
  isTouchDevice: false,
  isLongPress: false,
  isCardDragging: false,
  longPressedCard: null,
  setLongPressedCard: () => {},
  setIsCardDragging: () => {}
});

export const useTouchInteraction = () => useContext(TouchInteractionContext);

export const TouchInteractionProvider = ({ children }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const [isCardDragging, setIsCardDragging] = useState(false);
  const [longPressedCard, setLongPressedCard] = useState(null);
  
  // Detect touch device
  useEffect(() => {
    const isTouchCapable = 'ontouchstart' in window || 
      window.DocumentTouch && document instanceof window.DocumentTouch || 
      navigator.maxTouchPoints > 0;
    
    setIsTouchDevice(isTouchCapable);
    
    // Add classes to body for CSS targeting
    if (isTouchCapable) {
      document.body.classList.add('touch-device');
    } else {
      document.body.classList.remove('touch-device');
    }
    
    return () => {
      document.body.classList.remove('touch-device');
    };
  }, []);
  
  // Add global touch event handlers for long press
  useEffect(() => {
    if (!isTouchDevice) return;
    
    let longPressTimer;
    const longPressDuration = 500; // ms
    
    const handleTouchStart = (e) => {
      // Check if target has the draggable-handle class or is child of it
      const target = e.target;
      const isHandle = target.closest('.card-header');
      
      if (isHandle) {
        longPressTimer = setTimeout(() => {
          setIsLongPress(true);
          // The card ID would be set by the component that contains the handle
        }, longPressDuration);
      }
    };
    
    const handleTouchEnd = () => {
      clearTimeout(longPressTimer);
      setIsLongPress(false);
      
      // Small delay to allow drag to complete before resetting
      setTimeout(() => {
        setLongPressedCard(null);
      }, 100);
    };
    
    const handleTouchMove = () => {
      // If moving, cancel the long press timer
      clearTimeout(longPressTimer);
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(longPressTimer);
    };
  }, [isTouchDevice]);
  
  return (
    <TouchInteractionContext.Provider value={{
      isTouchDevice,
      isLongPress,
      isCardDragging,
      longPressedCard,
      setLongPressedCard,
      setIsCardDragging
    }}>
      {children}
    </TouchInteractionContext.Provider>
  );
};