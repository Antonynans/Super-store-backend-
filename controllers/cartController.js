import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

function calcPrices(cartItems) {
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product",
      "_id name price image brand",
    );

    if (!cart) {
      return res.status(200).json({
        user: req.user._id,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "PayPal",
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product: productId, qty } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        cartItems: [],
      });
    }

    const existItem = cart.cartItems.find(
      (item) => item.product.toString() === productId,
    );

    if (existItem) {
      existItem.qty = qty;
    } else {
      cart.cartItems.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        brand: product.brand,
        qty,
      });
    }

    const prices = calcPrices(cart.cartItems);
    cart.itemsPrice = prices.itemsPrice;
    cart.shippingPrice = prices.shippingPrice;
    cart.taxPrice = prices.taxPrice;
    cart.totalPrice = prices.totalPrice;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId,
    );

    const prices = calcPrices(cart.cartItems);
    cart.itemsPrice = prices.itemsPrice;
    cart.shippingPrice = prices.shippingPrice;
    cart.taxPrice = prices.taxPrice;
    cart.totalPrice = prices.totalPrice;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.shippingAddress = req.body;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.paymentMethod = req.body.paymentMethod;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getCart,
  addToCart,
  removeFromCart,
  updateShippingAddress,
  updatePaymentMethod,
  clearCart,
};
