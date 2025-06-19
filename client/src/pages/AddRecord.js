import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AddRecord() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [table, setTable] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/tables/${tableId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTable(res.data);
        
        // Initialize form data with empty values
        const initialData = {};
        res.data.fields.forEach(field => {
          initialData[field.label] = field.type === 'checkbox' ? false : '';
        });
        setFormData(initialData);
      } catch (err) {
        setError('Failed to load table fields');
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [tableId, token]);

  const handleChange = (fieldLabel, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldLabel]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5001/api/tables/${tableId}/records`,
        { values: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/tables/${tableId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add record');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!table) return <div>Table not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Add Record to {table.name}</h2>
      <form onSubmit={handleSubmit}>
        {table.fields.map((field) => (
          <div key={field.label} style={{ marginBottom: '15px' }}>
            <label>{field.label}:</label>
            
            {field.type === 'dropdown' ? (
              <select
                value={formData[field.label] || ''}
                onChange={(e) => handleChange(field.label, e.target.value)}
                required
                style={{ marginLeft: '10px' }}
              >
                <option value="">Select an option</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={formData[field.label] || false}
                onChange={(e) => handleChange(field.label, e.target.checked)}
                style={{ marginLeft: '10px' }}
              />
            ) : (
              <input
                type={field.type === 'number' ? 'number' : 
                     field.type === 'date' ? 'date' : 'text'}
                value={formData[field.label] || ''}
                onChange={(e) => handleChange(field.label, e.target.value)}
                required={field.required}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            )}
          </div>
        ))}
        
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add Record
        </button>
        <button 
          type="button" 
          onClick={() => navigate(`/tables/${tableId}`)}
          style={{ marginLeft: '10px', padding: '8px 16px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddRecord;