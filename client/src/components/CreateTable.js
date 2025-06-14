import React, { useState } from 'react';
import axios from 'axios';

function CreateTable() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/tables', {
        name,
        description,
      });
      setMessage('Table created successfully!');
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setMessage('Error creating table.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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
        ></textarea>
        <br />
        <button type="submit">Create Table</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateTable;