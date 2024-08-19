import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BarangForm.css';

const BarangForm = ({ selectedBarang, refreshData }) => {
  const [form, setForm] = useState({
    nama: '',
    gambar: null,
    bintang: '',
    deskripsi: '',
    harga: '',
    tanggal: ''
  });

  useEffect(() => {
    if (selectedBarang) {
      setForm({
        ...selectedBarang,
        gambar: null // Reset gambar saat editing, untuk menjaga file yang sudah ada.
      });
    }
  }, [selectedBarang]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    try {
      if (selectedBarang) {
        await axios.put(`http://localhost:5000/api/barang/${selectedBarang.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/barang', formData);
      }
      // Call refreshData to update the data
      refreshData();
      // Reset the form
      setForm({
        nama: '',
        gambar: null,
        bintang: '',
        deskripsi: '',
        harga: '',
        tanggal: ''
      });
      // Optionally, navigate away or show a success message
    } catch (error) {
      alert(error.response.data.message || 'Upload gagal, ukuran gambar mungkin terlalu besar');
    }
  };

  return (
    <div className="form-container">
      <h2>{selectedBarang ? 'Edit Barang' : 'Tambah Barang'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Nama Barang</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama Barang"
          required
        />

        <label>Gambar Barang</label>
        <input type="file" name="gambar" onChange={handleChange} />

        <label>Bintang</label>
        <input
          type="number"
          name="bintang"
          value={form.bintang}
          onChange={handleChange}
          placeholder="Bintang"
          required
        />

        <label>Deskripsi</label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          placeholder="Deskripsi"
          required
        />

        <label>Harga</label>
        <input
          type="number"
          name="harga"
          value={form.harga}
          onChange={handleChange}
          placeholder="Harga"
          required
        />

        <label>Tanggal Publish</label>
        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {selectedBarang ? 'Update' : 'Tambah'}
        </button>
      </form>
    </div>
  );
};

export default BarangForm;
