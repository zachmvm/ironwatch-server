const Employee = require("../models/employee");

// Controller functions for CRUD operations
async function createEmployee(req, res) {
  const data = req.body;
  try {
    // Check if email already exists
    const existingEmail = await Employee.findOne({ email: data.email });
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Check if phone number already exists
    const existingPhoneNumber = await Employee.findOne({
      phoneNumber: data.phoneNumber,
    });
    if (existingPhoneNumber) {
      throw new Error("Phone number already exists");
    }

    // Create new employee
    const newEmployee = await Employee.create(data);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getAllEmployees(req, res) {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function updateEmployeeById(req, res) {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function deleteEmployeeById(req, res) {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
