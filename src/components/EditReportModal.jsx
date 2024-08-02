import React, { useState, useEffect } from 'react';

const EditReportModal = ({ reportData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...reportData,
    date: reportData.date || new Date().toISOString().split('T')[0]  // Provide a default date if undefined
  });

  useEffect(() => {
    setFormData({
      ...reportData,
      date: reportData.date || new Date().toISOString().split('T')[0]  // Update formData when reportData changes
    });
  }, [reportData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Report</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date:</label>
            <input
              type="date"
              name="date"
              value={new Date(formData.date).toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Number of Labours:</label>
            <input
              type="number"
              name="numberofLabours"
              value={formData.numberofLabours}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rate:</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Work Hours:</label>
            <input
              type="number"
              name="workHours"
              value={formData.workHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Daily Charge:</label>
            <input
              type="number"
              name="dailyCharge"
              value={formData.dailyCharge}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#ffc000] text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportModal;
