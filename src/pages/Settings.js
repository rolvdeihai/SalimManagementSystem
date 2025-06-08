import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { updateSettings } from '../api';

const Settings = () => {
  const [settings, setSettings] = useState({
    api_url: process.env.REACT_APP_API_URL || '',
    api_secret: process.env.REACT_APP_API_SECRET || '',
    low_stock_threshold: 5,
    enable_email_alerts: false,
    email_recipient: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4" style={{ background: '#f8fafd', minHeight: '100vh' }}>
      <h2 className="mb-4" style={{ fontWeight: 700, color: '#23272b', letterSpacing: 1 }}>
        <i className="fas fa-cog me-2 text-primary"></i>
        System Settings
      </h2>

      {success && <Alert variant="success" className="mb-4">Settings saved successfully!</Alert>}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row className="g-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm border-0"
            style={{
              borderRadius: 18,
              background: '#fff',
              boxShadow: '0 4px 24px rgba(52,152,219,0.10)'
            }}>
            <Card.Header className="bg-white py-3" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottom: '1px solid #f0f4fa' }}>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#3498db' }}>
                <i className="fas fa-link me-2"></i>
                API Configuration
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600 }}>API URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="api_url"
                    value={settings.api_url}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600 }}>API Secret Key</Form.Label>
                  <Form.Control
                    type="password"
                    name="api_secret"
                    value={settings.api_secret}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={saving}
                    style={{ borderRadius: 10, fontWeight: 600, minWidth: 170 }}
                  >
                    {saving ? 'Saving...' : 'Save API Settings'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm border-0"
            style={{
              borderRadius: 18,
              background: '#fff',
              boxShadow: '0 4px 24px rgba(52,152,219,0.10)'
            }}>
            <Card.Header className="bg-white py-3" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottom: '1px solid #f0f4fa' }}>
              <h5 className="mb-0" style={{ fontWeight: 700, color: '#27ae60' }}>
                <i className="fas fa-bell me-2"></i>
                Notification Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600 }}>Low Stock Threshold</Form.Label>
                  <Form.Control
                    type="number"
                    name="low_stock_threshold"
                    value={settings.low_stock_threshold}
                    onChange={handleChange}
                    min="1"
                    required
                    style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
                  />
                  <Form.Text className="text-muted">
                    Send alerts when stock falls below this number
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="enable-email-alerts"
                    label="Enable Email Alerts"
                    name="enable_email_alerts"
                    checked={settings.enable_email_alerts}
                    onChange={handleChange}
                    style={{ fontWeight: 600, fontSize: 16 }}
                  />
                </Form.Group>
                {settings.enable_email_alerts && (
                  <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: 600 }}>Notification Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email_recipient"
                      value={settings.email_recipient}
                      onChange={handleChange}
                      required={settings.enable_email_alerts}
                      style={{ borderRadius: 10, background: '#f0f4fa', fontSize: 16 }}
                    />
                    <Form.Text className="text-muted">
                      Where to send notification emails
                    </Form.Text>
                  </Form.Group>
                )}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="success"
                    type="submit"
                    disabled={saving}
                    style={{ borderRadius: 10, fontWeight: 600, minWidth: 220 }}
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;