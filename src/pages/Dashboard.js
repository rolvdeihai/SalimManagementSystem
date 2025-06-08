import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getItems, getEmployees, getHistory } from '../api';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalEmployees: 0,
    recentActivity: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [items, employees, history] = await Promise.all([
        getItems(),
        getEmployees(),
        getHistory({ limit: 5 })
      ]);

      const lowStockItems = items.filter(
        item => Number(item.stock) < 1
      ).length;

      setStats({
        totalItems: items.length,
        lowStockItems,
        totalEmployees: employees.length,
        recentActivity: history
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const historyColumns = [
    {
      field: 'timestamp',
      header: 'Date',
      style: { width: '180px' },
      render: (item) => (
        <span style={{ fontFamily: 'monospace', fontSize: 15 }}>
          {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
        </span>
      )
    },
    { field: 'employee_name', header: 'Employee' },
    { field: 'item_name', header: 'Item' },
    { field: 'qty', header: 'Qty', style: { width: '80px', textAlign: 'center' } },
    {
      field: 'action',
      header: 'Action',
      render: (item) => (
        <span
          className={`badge ${item.action === 'deduct' ? 'bg-danger' : 'bg-success'}`}
          style={{
            fontSize: 14,
            padding: '6px 14px',
            borderRadius: 8,
            letterSpacing: 0.5,
            fontWeight: 600,
            textTransform: 'capitalize'
          }}
        >
          {item.action}
        </span>
      )
    }
  ];

  return (
    <Container fluid className="p-4" style={{ background: '#f8fafd', minHeight: '100vh' }}>
      <h1 className="mb-4" style={{ fontWeight: 700, color: '#23272b', letterSpacing: 1 }}>
        <i className="fas fa-tachometer-alt me-2 text-primary"></i>
        Dashboard
      </h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={3}>
              <StatsCard
                title="Total Items"
                value={stats.totalItems}
                icon="box"
                variant="primary"
              />
            </Col>
            <Col md={3}>
              <StatsCard
                title="Low Stock"
                value={stats.lowStockItems}
                icon="exclamation-triangle"
                variant="warning"
              />
            </Col>
            <Col md={3}>
              <StatsCard
                title="Employees"
                value={stats.totalEmployees}
                icon="users"
                variant="info"
              />
            </Col>
            <Col md={3}>
              <StatsCard
                title="Today's Activity"
                value={stats.recentActivity.length}
                icon="history"
                variant="success"
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <div
                className="card shadow-sm border-0"
                style={{
                  borderRadius: 18,
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 4px 24px rgba(52,152,219,0.10)'
                }}
              >
                <div className="card-header bg-white border-0 py-3" style={{ borderBottom: '1px solid #f0f4fa' }}>
                  <h5 className="mb-0" style={{ fontWeight: 700, color: '#23272b', letterSpacing: 0.5 }}>
                    <i className="fas fa-history me-2 text-success"></i>
                    Recent Activity
                  </h5>
                </div>
                <div className="card-body p-0">
                  <DataTable
                    data={stats.recentActivity}
                    columns={historyColumns}
                    keyField="timestamp"
                    searchable={false}
                    pagination={false}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;