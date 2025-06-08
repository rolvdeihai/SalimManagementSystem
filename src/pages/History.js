import React, { useEffect, useState } from 'react';
import { Button, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { getHistory, updateHistory, deleteHistory } from '../api';
import DataTable from '../components/DataTable';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [editForm, setEditForm] = useState({ qty: '', action: '' });
  const [filter, setFilter] = useState({
    from: '',
    to: '',
    query: ''
  });

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line
  }, []);

  const loadHistory = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory(params);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load history');
      setHistory([]);
    }
    setLoading(false);
  };

  // Filtering logic for item name and employee name only
  const filteredHistory = history.filter(item => {
    const q = filter.query.trim().toLowerCase();
    if (!q) return true;
    const itemName = String(item.item_name ?? '').toLowerCase();
    const employeeName = String(item.employee_name ?? '').toLowerCase();
    return (
      itemName.includes(q) ||
      employeeName.includes(q)
    );
  });

  // Date filter logic
  const dateFilteredHistory = filteredHistory.filter(item => {
    if (!filter.from && !filter.to) return true;
    const itemDate = new Date(item.timestamp);
    let fromOk = true, toOk = true;
    if (filter.from) fromOk = itemDate >= new Date(filter.from + 'T00:00:00');
    if (filter.to) toOk = itemDate <= new Date(filter.to + 'T23:59:59');
    return fromOk && toOk;
  });

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setEditForm({
      qty: entry.qty,
      action: entry.action
    });
    setShowEditModal(true);
  };

  const handleDelete = async (entry) => {
    if (window.confirm(`Are you sure you want to delete this history entry?\n\n${JSON.stringify(entry, null, 2)}`)) {
      setLoading(true);
      setError('');
      try {
        await deleteHistory(entry.id);
        await loadHistory();
      } catch (err) {
        setError('Failed to delete history entry');
      }
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    setEditForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await updateHistory({
        id: editEntry.id,
        qty: editForm.qty,
        action: editForm.action
      });
      setShowEditModal(false);
      await loadHistory();
    } catch (err) {
      setError('Failed to update history entry');
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilter(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const handleFilterApply = () => {
    // Optionally, you can fetch from API with date range if supported
    // For now, just filter locally
  };

  const columns = [
    {
      field: 'timestamp',
      header: 'Date',
      style: { width: 180, fontFamily: 'monospace', fontSize: 15, color: '#888' },
      render: (item) => (
        <span style={{ fontFamily: 'monospace', fontSize: 15 }}>
          {item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}
        </span>
      )
    },
    { field: 'employee_name', header: 'Employee Name', style: { fontWeight: 600 } },
    { field: 'item_name', header: 'Item Name', style: { fontWeight: 600 } },
    { field: 'qty', header: 'Quantity', style: { textAlign: 'center', fontWeight: 600 } },
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
    <div className="p-4" style={{ background: '#f8fafd', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: 700, color: '#23272b', letterSpacing: 1 }}>
          <i className="fas fa-history me-2 text-success"></i>
          History
        </h2>
        <Button
          variant="secondary"
          onClick={() => loadHistory()}
          style={{
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(52,152,219,0.10)'
          }}
        >
          <i className="fas fa-sync-alt me-2"></i> Refresh
        </Button>
      </div>

      {/* Filter section */}
      <div className="card mb-4 p-3" style={{ borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(52,152,219,0.07)' }}>
        <Form>
          <Row className="align-items-end g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: 600 }}>From</Form.Label>
                <Form.Control
                  type="date"
                  name="from"
                  value={filter.from}
                  onChange={handleFilterChange}
                  style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 15 }}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label style={{ fontWeight: 600 }}>Until</Form.Label>
                <Form.Control
                  type="date"
                  name="to"
                  value={filter.to}
                  onChange={handleFilterChange}
                  style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 15 }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label style={{ fontWeight: 600 }}>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="query"
                  placeholder="Search by item or employee name..."
                  value={filter.query}
                  onChange={handleFilterChange}
                  style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 15 }}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                className="w-100"
                style={{ borderRadius: 10, fontWeight: 600 }}
                onClick={handleFilterApply}
                type="button"
              >
                Apply Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      <div
        className="card shadow-sm border-0 mb-4"
        style={{
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 4px 24px rgba(52,152,219,0.10)'
        }}
      >
        <div className="card-body p-0">
          <DataTable
            data={dateFilteredHistory}
            columns={columns}
            keyField="id"
            actions
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        contentClassName="border-0"
        style={{ borderRadius: 18 }}
      >
        <Modal.Header closeButton style={{ borderBottom: 'none', background: '#f8fafd', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
          <Modal.Title style={{ fontWeight: 700, color: '#27ae60' }}>
            Edit History Entry
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body style={{ background: '#f8fafd', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Quantity</Form.Label>
              <Form.Control
                name="qty"
                type="number"
                value={editForm.qty}
                onChange={handleEditFormChange}
                required
                style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Action</Form.Label>
              <Form.Control
                name="action"
                value={editForm.action}
                onChange={handleEditFormChange}
                required
                style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
              />
            </Form.Group>
            {/* Show other fields as read-only */}
            {columns.filter(col => !['qty', 'action'].includes(col.field)).map(col => (
              <Form.Group className="mb-2" key={col.field}>
                <Form.Label style={{ fontWeight: 500 }}>{col.header}</Form.Label>
                <Form.Control
                  type="text"
                  value={editEntry ? editEntry[col.field] : ''}
                  readOnly
                  style={{ borderRadius: 8, background: '#f8fafd', fontSize: 15, color: '#888' }}
                />
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: 'none', background: '#f8fafd', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={loading}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default History;