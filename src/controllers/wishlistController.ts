import Wishlist from "../models/wishlistModel.js";

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "_id name price images rating numReviews description countInStock",
    );

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [productId],
      });
    } else {
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId,
      );

      if (!alreadyExists) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();

    wishlist = await wishlist.populate(
      "products",
      "_id name price images rating numReviews description countInStock",
    );

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ error: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId,
    );

    await wishlist.save();

    wishlist = await wishlist.populate(
      "products",
      "_id name price images rating numReviews description countInStock",
    );

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };
