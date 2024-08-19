import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarangForm from './BarangForm';
import BarangList from './BarangList';
import './App.css';
import Admin from './App'; 

const App = () => {
  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

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
    <div style={styles.container}>
      <div className="row mb-3 align-items-center">
        <div className="col-md-9">
          <h1 className="title">Halaman Admin</h1>
        </div>
      <div className="col-md-3 text-md-end">
          <button className="admin-button" onClick={handleAdminClick}>Kembali</button>
        </div>
      </div>
       <BarangForm selectedBarang={selectedBarang} refreshData={refreshData} />
       <BarangList barangList={barangList} refreshData={refreshData} setSelectedBarang={setSelectedBarang} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    paddingBottom: '20px',
  }
};

export default App;
