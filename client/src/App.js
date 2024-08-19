import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarangList from './barangList_2';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';
import Admin from './Admin'; // pastikan Admin.jsx berada di folder yang sesuai

const App = () => {
  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false); // State untuk menampilkan halaman admin

  const refreshData = async () => {
    const response = await axios.get('http://localhost:5000/api/barang');
    setBarangList(response.data);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAdminClick = () => {
    setShowAdmin(true); // Set state untuk menampilkan halaman admin
  };

  if (showAdmin) {
    return <Admin />; // Render halaman admin jika state showAdmin true
  }

  return (
    <div className="container">
      <div className="row mb-3 align-items-center">
        <div className="col-md-9">
          <h1 className="title">Produk List</h1>
        </div>
        <div className="col-md-3 text-md-end">
          <button className="admin-button" onClick={handleAdminClick}>Admin</button>
        </div>
      </div>
      <BarangList 
        barangList={barangList} 
        refreshData={refreshData} 
        setSelectedBarang={setSelectedBarang} 
        showButtons={false} // Set to false to hide buttons
      />
    </div>
  );
};

export default App;
