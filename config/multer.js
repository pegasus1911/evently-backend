const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'RecipeTracker-shows',
    allowed_formats: ['jpg','jpeg','png','AVIF'],
  }
});

module.exports = multer({storage});