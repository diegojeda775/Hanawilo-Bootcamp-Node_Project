const { default: isEmail } = require("validator/lib/isEmail");
const User = require("../models/User");
const crypto = require("crypto");

const getUsers = async (req, res, next) => {
  // query parameter
  const filter = {};
  const options = {};
  if (Object.keys(req.query).length) {
    const { gender, userName, sortByUserName, limit } = req.query;
    if (gender) filter.gender = true;
    if (userName) filter.userName = true;

    if (limit) options.limit = limit;
    if (ortByUserName)
      options.sort = {
        userName: ortByUserName,
      };
  }

  try {
    const users = await User.find({}, filter, options);

    res.status(200).header("Content-Type", "application/json").json(users);
  } catch (err) {
    next(err);
  }
};

const postUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    // res.status(201).header("Content-Type", "application/json").json(newUser);
    sendTokenResponse(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

const deleteUsers = async (req, res, next) => {
  try {
    const usersDeleted = await User.deleteMany();

    res
      .status(200)
      .header("Content-Type", "application/json")
      .json(usersDeleted);
  } catch (err) {
    next(err);
  }
};

//For /user/:userId
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    res.status(200).setHeader("Content-Type", "application/json").json(user);
  } catch (err) {
    next();
  }
};

const putUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userDeleted = await User.findOneAndDelete(req.params.userId);

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(userDeleted);
  } catch (err) {
    next(err);
  }
};
//for '/login'
const login = async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password)
    throw new Error("Please provide a email and password");

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("User does not exist");

  const isMatch = await user.matchPassword(password);

  if (!isMatch) throw new Error("Invalid Credentials");

  sendTokenResponse(user, 200, res);
};

//use node mailer to send an email with resetting password
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new Error("User does not exist");

  const resetToken = user.getResetPasswordToken();

  try {
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json({
        message: `Password has been reset with reset token: ${resetToken}`,
      });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new Error("Failed to reset password");
  }
};

const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.query.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid token from user!");

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
};

//for update password endpoint
const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const passwordMatches = await user.matchPassword(req.body.password);

  if (!passwordMatches) throw new Error("Password is incorrect");

  user.password = req.body.newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
};

// for logout endpoint
const logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ message: "Successfully logged out!" });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 + 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json(token);
};

module.exports = {
  getUsers,
  postUser,
  deleteUsers,
  getUser,
  putUser,
  deleteUser,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
};
