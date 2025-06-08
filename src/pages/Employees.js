import React, { useEffect, useState } from 'react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../api';
import DataTable from '../components/DataTable';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'employee',
    pin: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load employees');
      setEmployees([]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData(f => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = (emp) => {
    setCurrentEmployee(emp);
    setFormData({
      name: emp.name,
      role: emp.role,
      pin: ''
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentEmployee(null);
    setFormData({
      name: '',
      role: 'employee',
      pin: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (emp) => {
    if (window.confirm(`Are you sure you want to delete employee "${emp.name}"?`)) {
      setLoading(true);
      setError('');
      try {
        await deleteEmployee(emp.id);
        await loadEmployees();
      } catch (err) {
        setError('Failed to delete employee');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (currentEmployee) {
        await updateEmployee({ id: currentEmployee.id, ...formData });
      } else {
        await addEmployee(formData);
      }
      setShowModal(false);
      await loadEmployees();
    } catch (err) {
      setError('Failed to save employee');
    }
    setLoading(false);
  };

  const columns = [
    { field: 'id', header: 'ID', style: { width: 90, color: '#888' } },
    { field: 'name', header: 'Name', style: { fontWeight: 600 } },
    { field: 'role', header: 'Role', render: (item) => (
      <span className={`badge ${item.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: 14, borderRadius: 8, fontWeight: 600, textTransform: 'capitalize' }}>
        {item.role}
      </span>
    )},
    { field: 'last_login', header: 'Last Login', style: { fontFamily: 'monospace', fontSize: 15, color: '#888' } }
  ];

  return (
    <div className="p-4" style={{ background: '#f8fafd', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: 700, color: '#23272b', letterSpacing: 1 }}>
          <i className="fas fa-users me-2 text-info"></i>
          Employees
        </h2>
        <Button
          variant="primary"
          onClick={handleAdd}
          style={{
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(52,152,219,0.10)'
          }}
        >
          <i className="fas fa-plus me-2"></i> Add Employee
        </Button>
      </div>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
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
            data={employees}
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
        centered
        contentClassName="border-0"
        style={{ borderRadius: 18 }}
      >
        <Modal.Header closeButton style={{ borderBottom: 'none', background: '#f8fafd', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
          <Modal.Title style={{ fontWeight: 700, color: '#3498db' }}>
            {currentEmployee ? 'Edit Employee' : 'Add Employee'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ background: '#f8fafd', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Name *</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Role *</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>
                {currentEmployee ? 'New PIN (leave blank to keep current)' : 'PIN *'}
              </Form.Label>
              <Form.Control
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleChange}
                placeholder={currentEmployee ? "Enter new PIN" : "Enter PIN"}
                required={!currentEmployee}
                style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
              />
            </Form.Group>
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
              {loading ? 'Saving...' : 'Save Employee'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;