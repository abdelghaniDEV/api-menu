const Category = require("../module/category-module");
const productModule = require("../module/product-module");

// create a new category
const createCategory = async (req, res) => {
  console.log(req.body)
  try {
    const { name, subCategories } = req.body;
    const category = new Category({ name, subCategories });
    await category.save();
    res.status(201).json({ status: "SUCCESS", data: category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(201).json({ status: "SUCCESS", data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editCategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    // العثور على الفئة الحالية
    const existingCategory = await Category.findById(req.params.categoryID);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // استخراج أسماء الفئات الفرعية القديمة والجديدة
    const oldSubCategoryNames = existingCategory.subCategories.map(
      (sub) => sub.name
    );
    const newSubCategoryNames = subCategories.map((sub) => sub.name);

    // تحديث الفئة الرئيسية
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryID,
      { $set: { name, subCategories } },
      { new: true }
    );

    // تحديث المنتجات المرتبطة
    for (const oldSubCategory of oldSubCategoryNames) {
      if (!newSubCategoryNames.includes(oldSubCategory)) {
        // إذا تمت إزالة الفئة الفرعية القديمة، قم بإزالة ارتباطها من المنتجات
        await productModule.updateMany(
          {
            category: req.params.categoryID,
            subCategory: oldSubCategory,
          },
          { $unset: { subCategory: "" } } // إزالة الفئة الفرعية
        );
      }
    }

    for (const newSubCategory of newSubCategoryNames) {
      if (!oldSubCategoryNames.includes(newSubCategory)) {
        // إذا تم إضافة فئة فرعية جديدة، تأكد من وجود ارتباطات صحيحة إذا لزم الأمر
        await productModule.updateMany(
          {
            category: req.params.categoryID,
            subCategory: { $exists: false }, // المنتجات بدون فئة فرعية
          },
          { $set: { subCategory: newSubCategory } }
        );
      }
    }

    res.json({
      message: "Category and related products updated successfully",
      updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// Delete categories
const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.categoryID);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    createCategory,
    getAllCategories,
    editCategory,
    deleteCategory,
}
