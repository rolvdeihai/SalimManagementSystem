import React from 'react';
import { Card } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, variant = 'primary', onClick }) => {
  // Custom color palette for variants
  const bgColors = {
    primary: 'linear-gradient(135deg, #3498db 70%, #2980b9 100%)',
    warning: 'linear-gradient(135deg, #f7b731 70%, #f1c40f 100%)',
    info: 'linear-gradient(135deg, #17c0eb 70%, #00b894 100%)',
    success: 'linear-gradient(135deg, #27ae60 70%, #2ecc71 100%)',
    danger: 'linear-gradient(135deg, #e74c3c 70%, #c0392b 100%)',
    dark: 'linear-gradient(135deg, #23272b 70%, #2c3e50 100%)'
  };

  return (
    <Card
      className="stats-card mb-3 shadow-sm border-0"
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        background: bgColors[variant] || bgColors.primary,
        color: '#fff',
        borderRadius: 18,
        minHeight: 110,
        transition: 'box-shadow 0.2s',
        boxShadow: '0 4px 24px rgba(52,152,219,0.10)'
      }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center py-3 px-4">
        <div>
          <Card.Title className="mb-1" style={{ fontSize: '1.05rem', opacity: 0.92, letterSpacing: 0.5 }}>
            {title}
          </Card.Title>
          <Card.Text as="h3" className="mb-0 fw-bold" style={{ fontSize: 32, letterSpacing: 1 }}>
            {value}
          </Card.Text>
        </div>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.13)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          <i className={`fas fa-${icon}`} style={{ fontSize: 32, opacity: 0.93 }}></i>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;