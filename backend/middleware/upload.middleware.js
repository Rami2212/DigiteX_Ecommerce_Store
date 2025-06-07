const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Custom storage based on fieldname
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';

        if (file.fieldname === 'profileImage') {
            folder = 'assets/uploads/profileImages/';
        } else if (file.fieldname === 'productImage' || file.fieldname === 'variantImages' || file.fieldname === 'productImages') {
            folder = 'assets/uploads/productImages/';
        } else if (file.fieldname === 'categoryImage') {
            folder = 'assets/uploads/categoryImages/';
        } else {
            folder = 'assets/uploads/others/';
        }

        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, PNG, or WEBP files allowed'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
