import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL,"apiiii");

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addLabour = async (labourData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${API_URL}/labours`, labourData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding labour:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getLabours = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/labours`, config);
    return response.data;
  } catch (error) {
    console.error('Error getting labours:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateLabour = async (id, labourData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/labours/${id}`, labourData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating labour:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addDailyReport = async (labourId, reportData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${API_URL}/labours/${labourId}/dailyReports`, reportData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding daily report:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getLabour = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/labours/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Error getting labour:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  export const createReceipt = async (token, labourId, receipt) => {
    const response = await axios.post(`${API_URL}/labours/labours/${labourId}/receipts`, receipt, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  export const deleteLabour = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/labours/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete labour');
    } else if (error.request) {
      throw new Error('Request failed');
    } else {
      throw new Error('Failed to delete labour');
    }
  }
};
export const deleteDailyReport = async (labourId, reportId, token) => {
    const response = await fetch(`${API_URL}/labours/${labourId}/dailyReports/${reportId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete daily report');
    }
  };
  
  export const editDailyReport = async (labourId, reportId, updatedData, token) => {
    const response = await fetch(`${API_URL}/labours/${labourId}/dailyReports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to edit daily report');
    }
  };