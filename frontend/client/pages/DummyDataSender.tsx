import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { sendDummyData } from '../lib/slices/dataSlice';

const DummyDataSender: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, response } = useAppSelector((state) => state.data);
  const [dummyData, setDummyData] = useState({ name: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDummyData({ ...dummyData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sendDummyData(dummyData));
  };

  return (
    <div>
      <h2>Send Dummy Data to Backend</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={dummyData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={dummyData.email}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Dummy Data'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {response && <p style={{ color: 'green' }}>Success: {JSON.stringify(response)}</p>}
    </div>
  );
};

export default DummyDataSender;
