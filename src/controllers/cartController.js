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
      "_id name price images countInStock",
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

    cart.cartItems = cart.cartItems.map((item) => {
      if (item.countInStock == null && item.product?.countInStock != null) {
        item.countInStock = item.product.countInStock;
      }
      return item;
    });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

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
      const newQty = existItem.qty + qty;

      existItem.countInStock = product.countInStock;
      if (newQty > product.countInStock) {
        existItem.qty = product.countInStock;
      } else {
        existItem.qty = newQty;
      }
    } else {
      cart.cartItems.push({
        product: productId,
        name: product.name,
        images: product.images,
        price: product.price,
        countInStock: product.countInStock,
        qty: Math.min(qty, product.countInStock),
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

    const normalizeProductId = (product) => {
      if (!product) return null;
      if (typeof product === "string") return product;
      if (product._id) return product._id.toString();
      if (typeof product.toString === "function") return product.toString();
      return null;
    };

    cart.cartItems = cart.cartItems.filter((item) => {
      const itemProductId = normalizeProductId(item.product);
      return itemProductId !== productId;
    });

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

const updateCartQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const normalizeProductId = (product) => {
      if (!product) return null;
      if (typeof product === "string") return product;
      if (product._id) return product._id.toString();
      if (typeof product.toString === "function") return product.toString();
      return null;
    };

    const cartItem = cart.cartItems.find(
      (item) => normalizeProductId(item.product) === productId,
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    cartItem.countInStock = product.countInStock;

    if (qty > product.countInStock) {
      cartItem.qty = product.countInStock;
    } else if (qty > 0) {
      cartItem.qty = qty;
    } else {
      cart.cartItems = cart.cartItems.filter(
        (item) => normalizeProductId(item.product) !== productId,
      );
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
  updateCartQty,
  updateShippingAddress,
  updatePaymentMethod,
  clearCart,
};
