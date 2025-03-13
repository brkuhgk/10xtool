/**
 * Calendar Addon
 */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import './styles.css';

const Calendar = ({ settings, instanceId }) => {
  // Use instance-specific settings
  const calendarColor = settings?.calendarColor || '#8B5CF6';
  const calendarTitle = settings?.title || 'Calendar';
  
  // Create instance-specific storage key
  const storageKey = `calendar-selected-date-${instanceId}`;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Load previously selected date from localStorage
  useEffect(() => {
    const savedDate = localStorage.getItem(storageKey);
    if (savedDate) {
      try {
        setSelectedDate(parseInt(savedDate));
      } catch (error) {
        console.error('Error loading saved date:', error);
      }
    } else {
      setSelectedDate(new Date().getDate());
    }
  }, [storageKey]);
  
  // Save selected date to localStorage
  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem(storageKey, selectedDate.toString());
    }
  }, [selectedDate, storageKey]);
  
  // Get current month details
  const getCurrentMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and total days in month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Adjust first day to make Monday the first day of week (0 = Monday, 6 = Sunday)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    return { year, month, adjustedFirstDay, daysInMonth };
  };
  
  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };
  
  const { year, month, adjustedFirstDay, daysInMonth } = getCurrentMonthData();
  const monthName = getMonthName(month);
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };
  
  // Select a date
  const handleDateClick = (day) => {
    setSelectedDate(day);
    
    // Store the selected date for this instance
    const selectedDateObj = new Date(year, month, day);
    localStorage.setItem(`${storageKey}-full`, selectedDateObj.toISOString());
    
    // If there's an onDateSelect callback, use it
    if (settings?.onDateSelect) {
      settings.onDateSelect(selectedDateObj);
    }
  };
  
  // Render day cells
  const renderDays = () => {
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const blankCells = Array(adjustedFirstDay).fill(null);
    const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allCells = [...blankCells, ...dayCells];
    
    // Week day headers
    const weekDayHeaders = weekDays.map((day, index) => (
      <div key={`weekday-${index}`} className="calendar-weekday">
        {day}
      </div>
    ));
    
    // Day cells
    const dayElements = allCells.map((day, index) => {
      if (day === null) {
        return <div key={`empty-${index}`} className="calendar-day empty"></div>;
      }
      
      const isToday = day === new Date().getDate() && 
                      month === new Date().getMonth() && 
                      year === new Date().getFullYear();
                      
      const isSelected = day === selectedDate;
      
      return (
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
          style={{
            ...(isToday && { backgroundColor: calendarColor }),
            ...(isSelected && !isToday && { 
              backgroundColor: `${calendarColor}33`, 
              borderColor: calendarColor 
            })
          }}
        >
          {day}
        </div>
      );
    });
    
    return (
      <>
        <div className="calendar-weekdays">{weekDayHeaders}</div>
        <div className="calendar-days">{dayElements}</div>
      </>
    );
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-icon-title">
          <CalendarIcon size={18} className="calendar-icon" style={{ color: calendarColor }} />
          <h2 className="calendar-title" style={{ color: calendarColor }}>{calendarTitle}</h2>
        </div>
        <div className="calendar-navigation">
          <button className="calendar-nav-btn" onClick={goToPreviousMonth} style={{ color: calendarColor }}>
            <ChevronLeft size={18} />
          </button>
          <button className="calendar-nav-btn" onClick={goToNextMonth} style={{ color: calendarColor }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="calendar-body">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;