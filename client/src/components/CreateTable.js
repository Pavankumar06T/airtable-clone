import React, { useState } from 'react';
import axios from 'axios';

function CreateTable() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/tables', {
        name,
        description,
      });
      setMessage('✅ Table created successfully!');
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error creating table.');
    }
  };

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h2>Create Table</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Table Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button type="submit">Create Table</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateTable;