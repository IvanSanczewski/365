import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// const __dirname = path.dirname(new URL(import.meta.url).pathname);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

const app = express();
app.use(cors());
app.use(express.json());

// Serves the frontend
// app.use(express.static(path.join(__dirname, '../public'))); 
app.use(express.static(path.join('C:/Users/Ivan/Documents/IT/365/public'))); 

// Serves index.html
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '../public/index.html'));
  res.sendFile(path.join('C:/Users/Ivan/Documents/IT/365/public/index.html'));
});


// Sets multer for DEV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, path.join(__dirname, '../public/uploads'));
    cb(null, path.join('C:/Users/Ivan/Documents/IT/365/public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Path for mockup.json
app.get('/api/posts', (req, res) => {
  try {
    // const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockup.json'), 'utf8'));
    const data = JSON.parse(fs.readFileSync(path.join('C:/Users/Ivan/Documents/IT/365/backend/mockup.json'), 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer mockup.json' });
  }
});

// Path to update posts during DEV
app.post('/api/posts', upload.single('image'), (req, res) => {
  try {
    const newPost = {
      id: Date.now(),
      image: `/uploads/${req.file.filename}`,
      text: req.body.text,
      location: req.body.location,
      year: req.body.year
    };

    // const dataPath = path.join(__dirname, 'mockup.json');
    const dataPath = path.join('C:/Users/Ivan/Documents/IT/365/backend/mockup.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.push(newPost);

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ message: 'Post agregado (desarrollo)!' });

  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el post' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});