import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ViewRecord() {
  const { tableId } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [table, setTable] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTableRecords = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/tables/${tableId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTable(res.data);
      } catch (err) {
        console.error('❌ Error fetching records:', err);
        setMessage('Failed to fetch table data.');
      }
    };

    fetchTableRecords();
  }, [tableId, token]);

  if (!table) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Records for Table: {table.name}</h2>
      <p>{table.description}</p>

      <button onClick={() => navigate(`/table/${tableId}/add-record`)}>➕ Add Record</button>

      <br /><br />
      {table.records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {table.fields.map((field, index) => (
                <th key={index}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.records.map((record, rowIndex) => (
              <tr key={rowIndex}>
                {table.fields.map((field, colIndex) => (
                  <td key={colIndex}>
                    {typeof record.values[field.label] === 'boolean'
                      ? record.values[field.label] ? '✅' : '❌'
                      : record.values[field.label] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default ViewRecord;