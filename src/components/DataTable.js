import React, { useState } from 'react';
import { Table, Button, Form, Pagination, Badge } from 'react-bootstrap';

const DataTable = ({ 
  data, 
  columns, 
  keyField, 
  searchable = true, 
  pagination = true,
  actions = false,
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {}
}) => {
  // Defensive: always use an array
  const safeData = Array.isArray(data) ? data : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtering
  const filteredData = safeData.filter(item =>
    columns.some(col =>
      String(item[col.field] || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData;

  // Render cell helper
  const renderCell = (item, col) => {
    if (col.render) return col.render(item);
    if (col.badge) return <Badge bg={col.badge}>{item[col.field]}</Badge>;
    return item[col.field];
  };

  return (
    <div
      className="data-table-container"
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 16px rgba(52, 152, 219, 0.07)',
        padding: 24,
        marginBottom: 24,
        border: '1px solid #e0e6ed'
      }}
    >
      {searchable && (
        <Form.Group className="mb-4">
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="me-2"
              style={{
                borderRadius: 10,
                border: '1px solid #e0e6ed',
                background: '#f0f4fa',
                fontSize: 16,
                padding: '10px 14px'
              }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setSearchTerm('')}
              style={{
                borderRadius: 10,
                border: '1px solid #e0e6ed',
                background: '#fff'
              }}
            >
              <i className="fas fa-times"></i>
            </Button>
          </div>
        </Form.Group>
      )}

      <div className="table-responsive">
        <Table
          striped
          bordered
          hover
          className="mb-0"
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            background: '#fff',
            fontSize: 15
          }}
        >
          <thead style={{ background: '#f8fafd' }}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.field}
                  style={{
                    ...col.style,
                    fontWeight: 600,
                    color: '#3498db',
                    background: '#f8fafd',
                    borderBottom: '2px solid #e0e6ed',
                    fontSize: 15
                  }}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th
                  style={{
                    width: '120px',
                    fontWeight: 600,
                    color: '#3498db',
                    background: '#f8fafd',
                    borderBottom: '2px solid #e0e6ed',
                    fontSize: 15
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(item => (
                <tr key={item[keyField]} style={{ verticalAlign: 'middle' }}>
                  {columns.map(col => (
                    <td key={`${item[keyField]}-${col.field}`} style={{ verticalAlign: 'middle' }}>
                      {renderCell(item, col)}
                    </td>
                  ))}
                  {actions && (
                    <td className="text-nowrap" style={{ verticalAlign: 'middle' }}>
                      {onView && (
                        <Button
                          variant="info"
                          size="sm"
                          className="me-1"
                          style={{ borderRadius: 8, fontWeight: 600 }}
                          onClick={() => onView(item)}
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-1"
                          style={{ borderRadius: 8, fontWeight: 600 }}
                          onClick={() => onEdit(item)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ borderRadius: 8, fontWeight: 600 }}
                          onClick={() => onDelete(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center text-muted py-4"
                  style={{ background: '#f8fafd', fontSize: 16 }}
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted" style={{ fontSize: 15 }}>
            Showing {Math.min(paginatedData.length, itemsPerPage)} of {filteredData.length} items
          </div>
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  borderRadius: 8,
                  fontWeight: 600,
                  minWidth: 36,
                  textAlign: 'center'
                }}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default DataTable;