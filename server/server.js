const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const filePath = './data.json';

// Folder untuk menyimpan gambar
const imageDir = './uploads';
if (!fs.existsSync(imageDir)){
  fs.mkdirSync(imageDir);
}

// Konfigurasi multer untuk penyimpanan file dan batasan ukuran
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imageDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Batasan ukuran file 2MB
});

// Baca data dari file JSON
const readData = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

// Tulis data ke file JSON
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Endpoint untuk mendapatkan semua barang
app.get('/api/barang', (req, res) => {
  const data = readData();
  res.json(data);
});

// Endpoint untuk menambahkan barang baru dengan upload gambar
app.post('/api/barang', upload.single('gambar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Gambar tidak diupload atau ukuran terlalu besar (max 2MB)' });
  }

  const data = readData();
  const newBarang = {
    id: Date.now(),
    nama: req.body.nama,
    gambar: req.file ? req.file.filename : '',
    bintang: req.body.bintang,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    tanggal: req.body.tanggal
  };
  data.push(newBarang);
  writeData(data);
  res.json(newBarang);
});

// Endpoint untuk mengupdate barang
app.put('/api/barang/:id', upload.single('gambar'), (req, res) => {
  const data = readData();
  const barangIndex = data.findIndex((b) => b.id === parseInt(req.params.id));
  if (barangIndex >= 0) {
    data[barangIndex] = { ...data[barangIndex], ...req.body };
    if (req.file) {
      data[barangIndex].gambar = req.file.filename;
    }
    writeData(data);
    res.json(data[barangIndex]);
  } else {
    res.status(404).json({ message: 'Barang tidak ditemukan' });
  }
});

// Endpoint untuk menghapus barang
app.delete('/api/barang/:id', (req, res) => {
  let data = readData();
  data = data.filter((b) => b.id !== parseInt(req.params.id));
  writeData(data);
  res.json({ message: 'Barang berhasil dihapus' });
});

// Menyajikan gambar secara statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
