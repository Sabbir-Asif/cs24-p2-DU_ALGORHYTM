import React, { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import './index.css';

const GenerateBill = () => {
  // Updated state without distance and time, arrivalTime and departureTime as strings for datetime-local input
  const [data, setData] = useState({
    registrationNumber: '',
    wardNumber: '',
    landfillId: '', // Added landfillId as it's needed for route calculation
    arrivalTime: '', // To be set as datetime-local input values
    departureTime: '',
    weight: '',
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Assuming the backend will calculate distance and time based on other data
      const { data: responseData } = await axios.post('http://localhost:8080/api/optimized-route', data);
      setResponse(responseData);
    } catch (error) {
      console.error(error);
      setError('Failed to generate bill. Please try again.');
    }
  };

  // Function to fetch route details
  const fetchRoute = async () => {
    try {
      const routeData = await axios.post('http://localhost:8080/api/optimized-route', {
        wardNumber: data.wardNumber,
        landfillId: data.landfillId,
      });
      console.log('Route details:', routeData.data); // Log or set this data as needed
    } catch (error) {
      console.error(error);
      setError('Failed to fetch route details.');
    }
  };

  // Function to generate a PDF from HTML
  function generatePDF() {
    const element = document.getElementById('billTable');
    if (element) {
      html2pdf().from(element).set({
        margin: [10, 0, 10, 0],
        filename: 'bill.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      }).save();
    } else {
      console.error('Element #billTable not found!');
    }
  }

  return (
    <div className="form-container">
      <h1>Generate Bill</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vehicle Registration Number:</label>
          <input type="text" name="registrationNumber" onChange={handleChange} value={data.registrationNumber} required />
        </div>
        <div>
          <label>STS ID:</label>
          <input type="number" name="wardNumber" onChange={handleChange} value={data.wardNumber} required />
        </div>
        <div>
          <label>Landfill ID:</label>
          <input type="number" name="landfillId" onChange={handleChange} value={data.landfillId} required />
        </div>
        <div>
          <label>Arrival Time:</label>
          <input type="datetime-local" name="arrivalTime" onChange={handleChange} value={data.arrivalTime} required />
        </div>
        <div>
          <label>Departure Time:</label>
          <input type="datetime-local" name="departureTime" onChange={handleChange} value={data.departureTime} required />
        </div>
        <div>
          <label>Amount of Waste (kg):</label>
          <input type="number" name="weight" onChange={handleChange} value={data.weight} required />
        </div>
        <button type="button" onClick={fetchRoute}>Get Route</button>
        <button type="submit">Generate Bill</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <>
          <table id="billTable">
            <tbody>
              <tr><th>Field</th><th>Value</th></tr>
              {Object.entries(response).map(([key, value]) => (
                <tr key={key}><td>{key}</td><td>{value.toString()}</td></tr>
              ))}
            </tbody>
          </table>
          <button onClick={generatePDF}>Download Bill as PDF</button>
        </>
      )}
    </div>
  );
};

export default GenerateBill;
