// services/api.js
import axios from "axios";

const API_URL = "/api";

export const EmployeeService = {
  // Get all employees
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  },

  // Create a new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${API_URL}/employees`, employeeData);
      return response.data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw error;
    }
  },

  // Update an existing employee
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await axios.put(
        `${API_URL}/employees/${employeeId}`,
        employeeData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw error;
    }
  },

  // Delete an employee
  deleteEmployee: async (employeeId) => {
    try {
      const response = await axios.delete(`${API_URL}/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },
};

// You can define similar service functions for managing states and documents as well
