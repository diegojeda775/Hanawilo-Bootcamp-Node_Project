const Item = require("../models/Item");
const path = require("path");

const getItems = async (req, res, next) => {
  // query parameter
  const filter = {};
  const options = {};
  if (Object.keys(req.query).length) {
    const { gender, price, isClearance, colors, size, sortByPrice, limit } =
      req.query;

    if (gender) filter.gender = true;
    if (price) filter.price = true;
    if (isClearance) filter.isClearance = true;
    if (colors) filter.colors = true;
    if (size) filter.size = true;

    if (limit) options.limit = limit;
    if (sortByPrice)
      options.sort = {
        price: sortByPrice,
      };
  }

  try {
    const items = await Item.find({}, filter, options);
    res.status(200).header("Content-Type", "application/json").json(items);
  } catch (err) {
    next(err);
  }
};

const postItem = async (req, res, next) => {
  try {
    const newItem = await Item.create(req.body);

    res.status(200).header("Content-Type", "application/json").json(newItem);
  } catch (err) {
    next(err);
  }
};

const deleteItems = async (req, res, next) => {
  try {
    const itemsDeleted = await Item.deleteMany();
    res
      .status(200)
      .header("Content-Type", "application/json")
      .json(itemsDeleted);
  } catch (err) {
    next(err);
  }
};

//For /item/:itemId
const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    res.status(200).setHeader("Content-Type", "application/json").json(item);
  } catch (err) {
    next(err);
  }
};
const putItem = async (req, res, next) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(updatedItem);
  } catch (err) {
    next(err);
  }
};
const deleteItem = async (req, res, next) => {
  try {
    const itemDeleted = await Item.findByIdAndDelete(req.params.itemId);

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(itemDeleted);
  } catch (err) {
    next(err);
  }
};

const getItemRatings = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(item.ratings);
  } catch (err) {
    next(err);
  }
};

const createItemRating = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    item.ratings.push(req.body);
    // save new rating to the database
    await item.save();

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json(item.ratings);
  } catch (err) {
    next(err);
  }
};

const deleteItemRatings = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    item.ratings = [];
    // save new rating to the database
    await item.save();

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json({
        message: `Deleted all ratings for item id ${req.params.itemId}`,
      });
  } catch (err) {
    next(err);
  }
};

// for ./:itemId/ratings/:ratingId
const getItemRating = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    let rating = item.ratings.find((rating) =>
      req.params.ratingId.equals(rating._id)
    );

    if (!rating)
      rating = { message: `No rating found with id: ${req.params.ratingId}` };

    res.status(200).setHeader("Content-Type", "application/json").json(rating);
  } catch (err) {
    next(err);
  }
};

const updateItemRating = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    let rating = item.ratings.find((rating) =>
      req.params.ratingId.equals(rating._id)
    );

    if (rating) {
      const ratingIndexPosition = items.ratings.indexOf(rating);
      item.ratings.splice(ratingIndexPosition, 1, req.body);
      rating = req.body;
      await item.save();
    } else {
      rating = { message: `No rating found with id: ${req.params.ratingId}` };
    }

    res.status(200).setHeader("Content-Type", "application/json").json(rating);
  } catch (err) {
    next(err);
  }
};

const deleteItemRating = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);
    let rating = item.ratings.find((rating) =>
      req.params.ratingId.equals(rating._id)
    );

    if (rating) {
      const ratingIndexPosition = items.ratings.indexOf(rating);
      item.ratings.splice(ratingIndexPosition, 1);
      await item.save();
      rating = {
        message: `Successfully deleted rating with id: ${req.params.ratingId}`,
      };
    } else {
      rating = { message: `No rating found with id: ${req.params.ratingId}` };
    }

    res.status(200).setHeader("Content-Type", "application/json").json(rating);
  } catch (err) {
    next(err);
  }
};

const postItemImage = async (req, res, next) => {
  try {
    const err = { message: "Error uploading file" };
    if (!req.files) next(err);

    const file = req.files.file;

    if (!file.mimetype.startsWith("image")) next(err);
    if (file.size > process.env.MAX_FILE_SIZE) next(err);

    file.name = `photo_${req.params.itemId}${path.parse(file.name).ext}`;
    const filePath = process.env.FILE_UPLOAD_PATH + file.name;

    file.mv(filePath, async (err) => {
      await Item.findByIdAndUpdate(req.params.itemId, { image: file.name });

      res
        .status(200)
        .setHeader("Content-Type", "application/json")
        .json({ message: "Image uploaded!" });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
