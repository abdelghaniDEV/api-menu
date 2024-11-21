const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, editProduct, deleteProduct } = require('../controller/product.controller');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("../config//cloudinary")
const multer = require('multer');
const { authenticate } = require('../middleware/autMiddleware');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowedFormats: ['jpg', 'png', 'jpeg']
  }
})

const upload = multer({storage : storage})

router.route('/').post( upload.single('image'),createProduct).get(   getAllProducts);
router.route('/:productID').patch(authenticate , upload.single('image'),editProduct).delete(authenticate ,deleteProduct)
  

module.exports = router;
