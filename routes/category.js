const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategories,
  getCategory,
  putCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const protectedRoute = require("../middlewares/auth");

router
  .route("/")
  .get(getCategories)
  .post(protectedRoute, createCategory)
  .delete(deleteCategories);

router
  .route("/:categoryId")
  .get(getCategory)
  .put(protectedRoute, putCategory)
  .delete(protectedRoute, deleteCategory);

module.exports = router;
