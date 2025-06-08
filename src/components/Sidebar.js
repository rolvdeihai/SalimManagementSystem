import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Nav
      className="flex-column sidebar bg-dark text-white p-4"
      style={{
        minHeight: '100vh',
        width: 260,
        boxShadow: '2px 0 16px rgba(52,152,219,0.07)',
        borderRight: '1px solid #23272b',
        background: 'linear-gradient(180deg, #23272b 0%, #2c3e50 100%)'
      }}
    >
      <div className="sidebar-header mb-5 text-center">
        <div
          style={{
            background: 'linear-gradient(135deg, #3498db 60%, #2980b9 100%)',
            borderRadius: '50%',
            width: 60,
            height: 60,
            margin: '0 auto 12px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <i className="fas fa-box-open fa-2x text-white"></i>
        </div>
        <h3 style={{ fontWeight: 700, color: '#fff', letterSpacing: 1 }}>Inventory Manager</h3>
        <p className="text-muted mb-0" style={{ fontSize: 15 }}>
          Welcome, <span style={{ color: '#fff', fontWeight: 500 }}>{user?.name}</span>
        </p>
      </div>

      <Nav.Item className="mb-2">
        <Nav.Link
          as={Link}
          to="/"
          active={isActive('/')}
          className={`d-flex align-items-center sidebar-link ${isActive('/') ? 'active-link' : ''}`}
          style={navLinkStyle(isActive('/'))}
        >
          <i className="fas fa-tachometer-alt me-3"></i>
          <span>Dashboard</span>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item className="mb-2">
        <Nav.Link
          as={Link}
          to="/items"
          active={isActive('/items')}
          className={`d-flex align-items-center sidebar-link ${isActive('/items') ? 'active-link' : ''}`}
          style={navLinkStyle(isActive('/items'))}
        >
          <i className="fas fa-box me-3"></i>
          <span>Items</span>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item className="mb-2">
        <Nav.Link
          as={Link}
          to="/employees"
          active={isActive('/employees')}
          className={`d-flex align-items-center sidebar-link ${isActive('/employees') ? 'active-link' : ''}`}
          style={navLinkStyle(isActive('/employees'))}
        >
          <i className="fas fa-users me-3"></i>
          <span>Employees</span>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item className="mb-2">
        <Nav.Link
          as={Link}
          to="/history"
          active={isActive('/history')}
          className={`d-flex align-items-center sidebar-link ${isActive('/history') ? 'active-link' : ''}`}
          style={navLinkStyle(isActive('/history'))}
        >
          <i className="fas fa-history me-3"></i>
          <span>History</span>
        </Nav.Link>
      </Nav.Item>

      <Nav.Item className="mb-2">
        <Nav.Link
          as={Link}
          to="/settings"
          active={isActive('/settings')}
          className={`d-flex align-items-center sidebar-link ${isActive('/settings') ? 'active-link' : ''}`}
          style={navLinkStyle(isActive('/settings'))}
        >
          <i className="fas fa-cog me-3"></i>
          <span>Settings</span>
        </Nav.Link>
      </Nav.Item>

      <div className="mt-auto pt-4">
        <Nav.Item>
          <Nav.Link
            onClick={onLogout}
            className="d-flex align-items-center text-danger sidebar-link"
            style={{
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 16,
              background: 'rgba(231,76,60,0.08)',
              marginTop: 10,
              transition: 'background 0.2s'
            }}
          >
            <i className="fas fa-sign-out-alt me-3"></i>
            <span>Logout</span>
          </Nav.Link>
        </Nav.Item>
      </div>
    </Nav>
  );
};

// Helper for nav link style
function navLinkStyle(active) {
  return {
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 16,
    color: active ? '#3498db' : '#fff',
    background: active ? 'rgba(52,152,219,0.13)' : 'transparent',
    transition: 'background 0.2s, color 0.2s'
  };
}

export default Sidebar;