const express = require("express");
const {
  getItems,
  postItem,
  deleteItems,
  getItem,
  putItem,
  deleteItem,
  getItemRatings,
  createItemRating,
  deleteItemRatings,
  getItemRating,
  updateItemRating,
  deleteItemRating,
  postItemImage,
} = require("../controllers/itemController");
const protectedRoute = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getItems)
  .post(protectedRoute, postItem)
  .delete(protectedRoute, deleteItems);

router
  .route("/:itemId")
  .get(getItem)
  .put(protectedRoute, putItem)
  .delete(protectedRoute, deleteItem);

router
  .route("/:itemId/ratings")
  .get(getItemRatings)
  .post(protectedRoute, createItemRating)
  .delete(protectedRoute, deleteItemRatings);

router.route("./:itemId/image").post(protectedRoute, postItemImage);

router
  .route("/:itemId/ratings/:ratingId")
  .get(getItemRating)
  .put(protectedRoute, updateItemRating)
  .delete(protectedRoute, deleteItemRating);

module.exports = router;
