/**
 * Addon Template
 * Copy this file as a starting point for new addons
 */
import React from 'react';
import { Box } from 'lucide-react'; // Replace with appropriate icon
import './styles.css';

const AddonTemplate = ({ onSomeAction }) => {
  return (
    <div className="addon-template">
      <div className="addon-header">
        <Box size={18} className="addon-icon" />
        <h2 className="addon-title">Addon Title</h2>
      </div>
      
      <div className="addon-content">
        {/* Your addon content goes here */}
        <p>This is a template for creating new addons.</p>
      </div>
    </div>
  );
};

export default AddonTemplate;