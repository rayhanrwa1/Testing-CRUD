import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './BarangList.css';

const BarangList = ({ barangList, refreshData, setSelectedBarang }) => {

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/barang/${id}`);
    refreshData();
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const totalStars = 5;

    return (
      <div className="rating">
        {[...Array(totalStars)].map((_, index) => (
          <FontAwesomeIcon
            key={index}
            icon={index < fullStars ? faStarSolid : faStarRegular}
            className={index < fullStars ? 'star filled' : 'star'}
          />
        ))}
        {halfStar && <FontAwesomeIcon icon={faStarSolid} className="star half-filled" />}
      </div>
    );
  };

  return (
    <div className="barang-list">
      {barangList.map(barang => (
        <div key={barang.id} className="barang-card">
          <img src={`http://localhost:5000/uploads/${barang.gambar}`} alt={barang.nama} />
          <div className="barang-card-content">
            <h3>{barang.nama}</h3>
            <div className="rating-container">
              {renderStars(barang.bintang)}
            </div>
            <p className="price">Rp{barang.harga.toLocaleString()}</p>
            <p>{barang.deskripsi}</p>
            <p>Tanggal: {barang.tanggal}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarangList;
