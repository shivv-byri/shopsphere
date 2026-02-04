const exp=require("express")
const cart=exp.Router()
const UserCart=require("../models/Cart")
const auth = require("../middlewares/auth");

cart.get("/", auth, async (req, res) => {
  const userId = req.user.userId;
  const cartDoc = await UserCart.findOne({ userId });
  if (!cartDoc) {
    return res.json({ items: [] });
  }
  res.json({ items: cartDoc.items });
});


cart.post("/add", auth, async (req, res) => {
  const userId = req.user.userId;
  const { productId, sellerId, quantity } = req.body;
  if (!productId || !sellerId) {
    return res.status(400).json({ message: "Missing fields" });
  }
  let cartDoc = await UserCart.findOne({ userId });
  if (!cartDoc) {
    cartDoc = await UserCart.create({
      userId,
      items: [{ productId, sellerId, quantity: quantity || 1 }]
    });
    return res.status(201).json(cartDoc.items);
  }
  const index = cartDoc.items.findIndex(
    item => item.productId.toString() === productId
  );
  if (index > -1) {
    cartDoc.items[index].quantity += quantity || 1;
  } else {
    cartDoc.items.push({ productId, sellerId, quantity: quantity || 1 });
  }
  await cartDoc.save();
  res.json(cartDoc.items);
});


cart.put("/update", auth, async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  const cartDoc = await UserCart.findOne({ userId });
  if (!cartDoc) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const index = cartDoc.items.findIndex(
    item => item.productId.toString() === productId
  );
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  if (quantity <= 0) {
    cartDoc.items.splice(index, 1);
  } else {
    cartDoc.items[index].quantity = quantity;
  }
  await cartDoc.save();
  res.json(cartDoc.items);
});


cart.delete("/remove", auth, async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;
  const cartDoc = await UserCart.findOne({ userId });
  if (!cartDoc) {
    return res.status(404).json({ message: "Cart not found" });
  }
  cartDoc.items = cartDoc.items.filter(
    item => item.productId.toString() !== productId
  );
  await cartDoc.save();
  res.json(cartDoc.items);
});


module.exports=cart
