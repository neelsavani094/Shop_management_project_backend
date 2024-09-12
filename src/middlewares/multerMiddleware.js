const multer = require("multer");

const mimeTypes = ["image/jpeg", "image/png", "image/jpg"];

const { v4: uuidv4 } = require("uuid");

const generateFileName = (prefix) => {
    return (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const fileName = `${prefix}-${uniqueSuffix}-${file.originalname}`;
        cb(null, fileName);
    };
};

const fileFilter = (req, file, cb) => {
    if (mimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG and PNG are allowed"));
    }
};

const profilePictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/user");
    },
    filename: generateFileName("profilePicture"),
});

const profilePictureUpload = multer({
    storage: profilePictureStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
    },
});

module.exports = {
    profilePictureUpload,
};