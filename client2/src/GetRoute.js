import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RouteMap = () => {
    const [formData, setFormData] = useState({
      registrationNumber: '',
      wardNumber: '',
      landfillId: '',
      arrivalTime: '',
      departureTime: '',
      weight: '',
    });

const [route, setRoute] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/get-route', formData);
      const routeData = response.data.solution.routes.flatMap(r => r.points.flatMap(p => p.coordinates));
      setRoute(routeData);
    } catch (error) {
      console.error('Failed to fetch route', error);
    }
  };

  // Function to fetch route details
  const fetchRoute = async () => {
    try {
      const routeData = await axios.post('http://localhost:8080/api/get-route', {
        wardNumber: data.wardNumber,
        landfillId: data.landfillId,
      });
      console.log('Route details:', routeData.data); // Log or set this data as needed
    } catch (error) {
      console.error(error);
      setError('Failed to fetch route details.');
    }
  };

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
        <button type="submit">Get Route</button>
      </form>
      {route.length > 0 && (
        <MapContainer center={[52.52, 13.405]} zoom={13} style={{ height: 400, width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={route} color="red" />
        </MapContainer>
      )}
    </div>
  );
};

export default GenerateBill;
