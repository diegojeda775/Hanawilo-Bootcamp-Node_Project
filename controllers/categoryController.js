const Category = require("../models/Category");

//For root or  '/' categories
const getCategories = async (req, res, next) => {
  // query parameter
  const filter = {};
  const options = {};

  if (Object.keys(req.query).length) {
    const { sortByCategory, categoryName, gender, limit } = req.query;

    if (categoryName) filter.categoryName = true;
    if (gender) filter.gender = true;

    if (limit) options.limit = limit;
    if (sortByCategory)
      options.sort = {
        categoryName: sortByCategory === "asc" ? "1" : "-1",
      };
  }

  try {
    const result = await Category.find({}, filter, options);
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);

    res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .json(newCategory);
  } catch (err) {
    next(err);
  }
};

const deleteCategories = async (req, res, next) => {
  try {
    const deletedCategories = await Category.deleteMany();
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(deletedCategories);
  } catch (err) {
    next(err);
  }
};

//For /category/:categoryId
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(category);
  } catch (err) {
    next(err);
  }
};
const putCategory = async (req, res, next) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedCategory);
  } catch (err) {
    next(err);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = Category.findByIdAndDelete(req.params.categoryId);
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(deletedCategory);
  } catch (err) {}
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategories,
  getCategory,
  putCategory,
  deleteCategory,
};
