import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Importación necesaria para obtener rutas

// 1. Configurar __dirname y __filename para módulos ES6
const __filename = fileURLToPath(import.meta.url); // Convierte la URL del módulo a ruta de archivo
const __dirname = path.dirname(__filename); // Obtiene el directorio del archivo actual

// 2. Inicializar Express y middlewares
const app = express();
app.use(cors()); // Permite peticiones CORS
app.use(express.json()); // Parsea el cuerpo de las peticiones como JSON

// 3. Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public'))); // Ruta relativa a la carpeta /public

// 4. Ruta principal: sirve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Ruta absoluta a index.html
    // try {
    //     const data = JSON.parse(fs.readFileSync('C:/Users/Ivan/Documents/IT/365/backend/mockup.json', 'utf8'));
    //     res.json(data);
    // } catch (error) {
    //     res.status(500).json({ error: 'Error al leer mockup.json' });
    // }    
});

// 5. Configurar Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Guarda imágenes en /public/uploads
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Nombre único para evitar colisiones
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 6. Ruta GET: Obtener posts desde mockup.json
app.get('/api/posts', (req, res) => {
  try {
    // Leer mockup.json ubicado en /backend
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockup.json'), 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer mockup.json' });
  }
});

// 7. Ruta POST: Crear un nuevo post
app.post('/api/posts', upload.single('image'), (req, res) => {
  try {
    // Crear objeto del nuevo post
    const newPost = {
      id: Date.now(),
      image: `/uploads/${req.file.filename}`, // Ruta relativa a la imagen
      text: req.body.text,
      location: req.body.location,
      year: req.body.year
    };

    // Guardar en mockup.json
    const dataPath = path.join(__dirname, 'mockup.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.push(newPost);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2)); // Formato legible

    res.json({ message: 'Post agregado exitosamente!' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el post' });
  }
});

// 8. Iniciar servidor en puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});