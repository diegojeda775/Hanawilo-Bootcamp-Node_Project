const express = require("express");
const {
  getUsers,
  postUser,
  deleteUsers,
  getUser,
  putUser,
  deleteUser,
  login,
  forgotPassword,
  logout,
  resetPassword,
  updatePassword,
} = require("../controllers/userController");
const protectedRoute = require("../middlewares/auth");
const adminValidator = require("../middlewares/utils/validators");

const router = express.Router();

router
  .route("/")
  .get(protectedRoute, adminValidator, getUsers)
  .post(postUser)
  .delete(protectedRoute, deleteUsers);

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword").put(resetPassword);

router.route("/updatepassword").put(protectedRoute, updatePassword);

router.route("/logout").get(protectedRoute, logout);

router
  .route("/:userId")
  .get(protectedRoute, getUser)
  .put(protectedRoute, putUser)
  .delete(protectedRoute, deleteUser);

module.exports = router;
