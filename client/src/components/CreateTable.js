import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateTable() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fields: [{ label: '', type: 'text', options: [], required: false }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...formData.fields];
    
    if (field === 'type' && value !== 'dropdown') {
      updatedFields[index].options = [];
    }
    
    updatedFields[index][field] = value;
    setFormData({ ...formData, fields: updatedFields });
  };

  const addField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { label: '', type: 'text', options: [], required: false }]
    });
  };

  const removeField = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields.splice(index, 1);
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post('http://localhost:5001/api/tables', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create table');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Create New Table</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Table Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Description (optional):</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '8px', minHeight: '80px' }}
          />
        </div>

        <h3>Fields</h3>
        {formData.fields.map((field, index) => (
          <div key={index} style={{ 
            border: '1px solid #eee', 
            padding: '15px', 
            marginBottom: '15px',
            borderRadius: '5px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label>Label:</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                  required
                  style={{ width: '100%', padding: '6px' }}
                />
              </div>
              
              <div>
                <label>Type:</label>
                <select
                  value={field.type}
                  onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                  style={{ width: '100%', padding: '6px' }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="url">URL</option>
                  <option value="textarea">Textarea</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                  />
                  Required
                </label>
              </div>
            </div>

            {field.type === 'dropdown' && (
              <div>
                <label>Options (comma separated):</label>
                <input
                  type="text"
                  value={field.options.join(', ')}
                  onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
                  required
                  style={{ width: '100%', padding: '6px' }}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => removeField(index)}
              style={{ 
                marginTop: '10px', 
                padding: '5px 10px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Remove Field
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addField}
          style={{ 
            marginBottom: '20px',
            padding: '8px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Add Field
        </button>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '10px'
            }}
          >
            {loading ? 'Creating...' : 'Create Table'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CreateTable;