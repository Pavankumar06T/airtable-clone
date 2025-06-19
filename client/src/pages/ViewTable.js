import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ViewTable() {
  const { tableId } = useParams();
  const token = localStorage.getItem('token');
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/tables/${tableId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTable(res.data);
      } catch (err) {
        setError('Failed to load table');
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTable();
  }, [tableId, token]);

  if (loading) return <div>Loading table...</div>;
  if (error) return <div>{error}</div>;
  if (!table) return <div>Table not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{table.name}</h2>
      <p>{table.description}</p>
      
      <button 
        onClick={() => navigate(`/tables/${tableId}/add-record`)}
        style={{ marginBottom: '20px' }}
      >
        ➕ Add Record
      </button>

      {table.records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {table.fields.map((field) => (
                  <th key={field.label} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.records.map((record, index) => (
                <tr key={index}>
                  {table.fields.map((field) => (
                    <td key={`${index}-${field.label}`} style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {record.values[field.label]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewTable;