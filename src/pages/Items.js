import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { getItems, addItem, updateItem, deleteItem } from '../api';
import DataTable from '../components/DataTable';

const Items = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    min_stock: '',
    barcode: ''
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await getItems();
      setItems(Array.isArray(response) ? response : []);
    } catch (error) {
      setError('Failed to load items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        min_stock: 1,
        barcode: 1
      };
      if (currentItem) {
        await updateItem({ ...payload, id: currentItem.id });
      } else {
        await addItem(payload);
      }
      loadItems();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.data || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      stock: item.stock,
      // min_stock and barcode are not included in the form
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await deleteItem(item.id);
        loadItems();
      } catch (error) {
        setError('Failed to delete item');
      }
    }
  };

  const columns = [
    { field: 'id', header: 'ID', style: { width: '120px', color: '#888' } },
    { field: 'name', header: 'Name', style: { fontWeight: 600 } },
    { field: 'category', header: 'Category', style: { color: '#555' } },
    {
      field: 'stock',
      header: 'Stock',
      render: (item) => (
        <span className={item.stock < 1 ? 'text-danger fw-bold' : 'fw-bold'} style={{ fontSize: 16 }}>
          {item.stock}
          {item.stock < 1 && <i className="fas fa-exclamation-circle ms-2"></i>}
        </span>
      ),
      style: { textAlign: 'center' }
    }
    // Do NOT include min_stock or barcode
  ];

  return (
    <div className="p-4" style={{ background: '#f8fafd', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: 700, color: '#23272b', letterSpacing: 1 }}>
          <i className="fas fa-box me-2 text-primary"></i>
          Manage Items
        </h2>
        <Button
          variant="primary"
          onClick={() => {
            setCurrentItem(null);
            setFormData({
              name: '',
              category: '',
              stock: '',
              min_stock: 1,
              barcode: 1
            });
            setShowModal(true);
          }}
          style={{
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(52,152,219,0.10)'
          }}
        >
          <i className="fas fa-plus me-2"></i> Add New Item
        </Button>
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
            data={items || []}
            columns={columns}
            keyField="id"
            actions
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        contentClassName="border-0"
        style={{ borderRadius: 18 }}
      >
        <Modal.Header closeButton style={{ borderBottom: 'none', background: '#f8fafd', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
          <Modal.Title style={{ fontWeight: 700, color: '#3498db' }}>
            {currentItem ? 'Edit Item' : 'Add New Item'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ background: '#f8fafd', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Item Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600 }}>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600 }}>Current Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                    style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* min_stock and barcode are hidden and not shown in the form */}
          </Modal.Body>
          <Modal.Footer style={{ borderTop: 'none', background: '#f8fafd', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              style={{ borderRadius: 10, fontWeight: 600 }}
            >
              {loading ? 'Saving...' : 'Save Item'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Items;