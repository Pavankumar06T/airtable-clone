import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/tables', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTables(res.data);
      } catch (err) {
        setError('Failed to load tables');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div>Loading tables...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Tables</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <button 
        onClick={() => navigate('/tables/create')}
        style={{ marginBottom: '20px', padding: '10px 15px' }}
      >
        Create New Table
      </button>

      {tables.length === 0 ? (
        <p>No tables found. Create your first table!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {tables.map((table) => (
            <div 
              key={table._id} 
              onClick={() => navigate(`/tables/${table._id}`)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              <h3>{table.name}</h3>
              <p>{table.description || 'No description'}</p>
              <small>{table.fields.length} fields • {table.records?.length || 0} records</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;