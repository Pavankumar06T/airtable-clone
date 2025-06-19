import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddRecord() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5001/api/tables', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTables(res.data))
    .catch(err => console.error(err));
  }, [token]);

  const handleTableChange = (tableId) => {
    setSelectedTable(tableId);
    const table = tables.find(t => t._id === tableId);
    setFields(table?.fields || []);
    setValues({});
  };

  const handleChange = (label, value) => {
    setValues(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/tables/${selectedTable}/records`, { record: values }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Record added successfully!');
      setValues({});
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add record.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Record</h2>

      <select onChange={(e) => handleTableChange(e.target.value)} value={selectedTable}>
        <option value="">Select a Table</option>
        {tables.map(table => (
          <option key={table._id} value={table._id}>{table.name}</option>
        ))}
      </select><br /><br />

      {fields.length > 0 && (
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <label>{field.label}</label><br />
              {field.type === 'dropdown' ? (
                <select
                  value={values[field.label] || ''}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={values[field.label] || false}
                  onChange={(e) => handleChange(field.label, e.target.checked)}
                />
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={values[field.label] || ''}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit">Add Record</button>
        </form>
      )}

      <p>{message}</p>
    </div>
  );
}

export default AddRecord;