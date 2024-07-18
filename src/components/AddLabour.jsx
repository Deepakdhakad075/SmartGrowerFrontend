import React, { useState } from 'react';
import { addLabour } from '../api';

const AddLabour = ({ token }) => {
  const [name, setName] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const labourData = { name };
    await addLabour(labourData, token);
    // Handle post-submit actions like resetting form, showing success message, etc.
  };

  return (
    <div>
      <h1>Add Labour</h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Labour</button>
      </form>
    </div>
  );
};

export default AddLabour;
