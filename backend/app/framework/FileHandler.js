import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { defaultValue } from './functions.js'; // Feltételezve, hogy ez elérhető
// 1. A célmappa és méret
const UPLOAD_DIR = path.resolve(defaultValue(process.env.UPLOAD_DIR, "uploads"));
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
// 2. Tárolási stratégia (marad)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = file.fieldname + '-' + uniqueSuffix + extension;
        cb(null, newFileName);
    }
});
// A GLOBÁLIS "uploadErrors" TÖRÖLVE!
// Segédfüggvény (marad)
const cleanupFiles = (paths) => {
    if (!paths)
        return;
    paths.forEach(path => {
        fs.unlink(path, (err) => {
            if (err)
                console.error(`Error deleting file: ${path}`, err);
        });
    });
};
// 3. Multer konfiguráció: Típus ellenőrzés és Hiba GYŰJTÉS a req-en
export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Inicializálás Kérésenként (NEM globálisan!)
        if (!req.uploadErrors) {
            req.uploadErrors = [];
        }
        const extension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            // Nem szakítjuk meg, csak gyűjtjük a hibát a kéréshez
            req.uploadErrors.push({
                message: `Only ${allowedExtensions.join(", ")} formats allowed: ${file.originalname}`,
                path: file.originalname,
                originalName: file.originalname
            });
        }
        cb(null, true);
    }
});
// ----------------------------------------------------
// 4. Multer Error Handler (4 paraméteres)
// Csak a Multer által dobott (next(err)) hibákat kezeli
// ----------------------------------------------------
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // NEM TÖRÖLJÜK A FÁJLOKAT ITT, MERT A REQ.FILES HIÁNYOS LEHET!
        // A Multer hiba esetén azonnali választ küldünk.
        return res.status(400).json({
            message: `Multer error occurred: ${err.code}.`
        });
    }
    // Ha a hiba nem Multer hiba, de err jött, továbbítjuk
    next(err);
};
// ----------------------------------------------------
// 5. Upload Error Handler (3 paraméteres)
// Validálja a méretet és feldolgozza az ÖSSZES hibát
// ----------------------------------------------------
export const uploadErrorHandler = (req, res, next) => {
    const uploadedFiles = req.files || [];
    // Méret validáció (most már ismerjük a size-t, mivel a feltöltés befejeződött)
    uploadedFiles.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
            req.uploadErrors.push({
                message: `File size too large for '${file.originalname}'. Max size is ${MAX_FILE_SIZE}.`,
                path: file.path,
                originalName: file.originalname
            });
        }
    });
    if (req.uploadErrors.length > 0) {
        const filesToDelete = [];
        req.uploadErrors.forEach(e => {
            const fileToDelete = uploadedFiles.find(f => f.originalname === e.originalName);
            if (fileToDelete)
                filesToDelete.push(fileToDelete.path);
        });
        cleanupFiles(filesToDelete);
        return res.status(400).json({
            message: req.uploadErrors.map(e => e.message)
        });
    }
    next();
};
