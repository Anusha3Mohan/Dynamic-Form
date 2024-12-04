import React, { useState } from "react";
import "./App.css";


const Form = ({ formFields, formData, handleChange, handleSubmit, editingId }) => (
  <form onSubmit={handleSubmit} className="user-form">
    {formFields.map((field) => (
      <div key={field.name} className="form-group">
        <label className="form-label">{field.label}</label>
        {field.type === "dropdown" ? (
          <select
            className="form-control"
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">-- Select --</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className="form-control"
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.label}
            required={field.required}
          />
        )}
      </div>
    ))}
    <button
      type="submit"
      className="btn btn-primary"
      style={{ backgroundColor: "#E08600", color: "white" }}
    >
      {editingId ? "Update" : "Submit"}
    </button>
  </form>
);

const App = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({
    "User Information": [],
    "Address Information": [],
    "Payment Information": [],
  });
  const [message, setMessage] = useState("");
  const [formVisible, setFormVisible] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const formOptions = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["Kerala", "Tamil Nadu", "Karnataka", "Goa", "Other"],
          required: true,
        },
        { name: "zipCode", type: "number", label: "Pin code", required: true },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "number", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  const handleFormSelection = (e) => {
    const selected = e.target.value;
    setSelectedForm(selected);
    setFormFields(formOptions[selected]?.fields || []);
    setFormData({});
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formFields.some((f) => f.required && !formData[f.name])) {
      setMessage("Please fill out all required fields.");
      return;
    }

    const formType = selectedForm;
    if (editingId) {
      const updatedData = submittedData[formType].map((data) =>
        data.id === editingId ? { ...formData, id: editingId } : data
      );
      setSubmittedData({
        ...submittedData,
        [formType]: updatedData,
      });
      setMessage("Form updated successfully!");

      // Show an alert after the update
      window.alert("Form updated successfully!");

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      const newEntry = { ...formData, id: Date.now() };
      setSubmittedData((prevData) => ({
        ...prevData,
        [formType]: [...prevData[formType], newEntry],
      }));
      setMessage("Form submitted successfully!");

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }

    setFormData({});
    setFormVisible(false);
    setEditingId(null);
  };

  const renderTable = (formType) => (
    <div className="submitted-data-section mt-5">
      <h3 className="mt-4 mb-3" style={{ color: "#E08600" }}>
        {formType}
      </h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            {formOptions[formType].fields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData[formType].map((data) => (
            <tr key={data.id}>
              {formOptions[formType].fields.map((field) => (
                <td key={field.name}>{data[field.name]}</td>
              ))}
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => {
                    setEditingId(data.id);
                    setFormVisible(true);
                    setFormData(data);
                  }}
                >
                  Edit
                </button>
                <button
                  style={{ marginLeft: "20px" }}
                  className="btn btn-danger"
                  onClick={() =>
                    setSubmittedData({
                      ...submittedData,
                      [formType]: submittedData[formType].filter((item) => item.id !== data.id),
                    })
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center">
        <span style={{ color: "#763A12" }}>User</span>
        <span style={{ color: "#E08600" }}> Form</span>
      </h1>

      {formVisible ? (
        <div className="form-section">
          <div className="form-group">
            <label>Select Form Type</label>
            <select className="form-control" onChange={handleFormSelection} value={selectedForm}>
              <option value="">-- Select --</option>
              {Object.keys(formOptions).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {formFields.length > 0 && (
            <Form
              formFields={formFields}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              editingId={editingId}
            />
          )}

          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
      ) : (
        <>
          {Object.keys(submittedData).map(
            (formType) =>
              submittedData[formType].length > 0 && renderTable(formType)
          )}
          <button
            style={{ marginTop: "20px" }}
            onClick={() => {
              setFormVisible(true);
              setMessage("");
            }}
            className="btn btn-secondary mt-3"
          >
            Add Information
          </button>
        </>
      )}
    </div>
  );
};

export default App;
