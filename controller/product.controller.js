const categoryModule = require("../module/category-module");
const Product = require("../module/product-module");

// add product module
const createProduct = async (req, res) => {
  console.log(req.body);
  try {
    const { name, description, price, categoryId, subCategory } = req.body;

    const category = await categoryModule.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // تحقق من أن الفئة الفرعية تنتمي إلى الفئة
    if (!category.subCategories.some((sub) => sub.name === subCategory)) {
      return res
        .status(400)
        .json({ error: "Subcategory does not belong to the category" });
    }

    const product = new Product({
      // ...req.body,
      name,
      description,
      price,
      category: categoryId,
      subCategory,
      image: req.file.path,
    });
    await product.save();
    res.status(201).json({ status: "SUCCESS", data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ status: "SUCCESS", data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit product
const editProduct = async (req, res) => {
  console.log(req.body);
  try {
    const { name, description, price, categoryId, subCategory } = req.body;
    const updateDate = {
      name,
      description,
      price,
      category : categoryId,
      subCategory,
    };
    if (req.file) {
      updateDate.image = req.file.path;
    }

    const category = await categoryModule.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    // تحقق من أن الفئة الفرعية تنتمي إلى الفئة
    if (!category.subCategories.some((sub) => sub.name === subCategory)) {

      return res
        .status(400)
        .json({ error: "Subcategory does not belong to the category" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productID,
      { $set: updateDate },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productID
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  editProduct,
  deleteProduct,
};
