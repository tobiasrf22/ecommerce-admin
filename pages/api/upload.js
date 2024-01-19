// api/upload.js
/*
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';

export default async function handle(req, res) {
    const form = new multiparty.Form();

    try {
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        if (files && Array.isArray(files.files)) {
            const uploadedFiles = files.files;

            // Define la ruta donde se guardarán las imágenes
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            // Crea el directorio si no existe
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Mueve cada archivo a la carpeta de uploads
            const savedFiles = uploadedFiles.map((file) => {
                const oldPath = file.path;
                const newPath = path.join(uploadDir, file.originalFilename);

                fs.renameSync(oldPath, newPath);
                return newPath;
            });

            console.log('Number of files:', savedFiles.length);
            res.json(savedFiles);
        } else {
            console.error('No files found or files is not an array');
            res.status(400).json({ error: 'No files found or files is not an array' });
        }
    } catch (error) {
        console.error('Error parsing form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const config = {
    api: { bodyParser: false },
};
*/
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(process.cwd(), 'public/uploads/'));
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
    }),
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    try {
        await upload.array('files')(req, res);

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`,
        }));
        console.log('uploaddddd:',uploadedFiles)
        res.status(200).json(uploadedFiles);
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).json({ error: 'Error uploading files' });
    }
}


//TODO: HACER QUE ANDE LO DE SUBIR IMAGENES PARA TENER UN URL