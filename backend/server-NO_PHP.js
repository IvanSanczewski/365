import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// Setting file's routes (ES6)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public'))); // Serving static files


// Setting multer to upload images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage });


// Reading initially stored data from data.json
let data = [];
const dataPath = join(__dirname, 'data.json');

try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
    console.error('Error reading data.json:', error);
}


// GET route to retreive all posts
app.get('/api/posts', (req, res) => {
    res.json(data);
});


// POST route to create new posts
app.post('/api/posts', upload.single('image'), (req, res) => {
    const { text, location, year, password } = req.body;

    // Password validation
    if (password !== 'kapuscinski') {
        return res.status(401).json({ error: 'wrong password'})
    }

    // Creating new post
    const newPost = {
        id: Date.now(),
        image: `/uploads/${req.file.filename}`,
        text,
        location,
        year
    };

    data.push(newPost);

    // Saving the new post to data.json
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({ message: 'vision succcessfully added!' });
});


// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});