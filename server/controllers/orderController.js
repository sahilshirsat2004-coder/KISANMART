import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress } = req.body;
    const targetProduct = await Product.findById(productId);
    if (!targetProduct || !targetProduct.isActive) {
      return res.status(404).json({ message: 'Produce not found or inactive' });
    }

    const isPrebook = targetProduct.type === 'FUTURE';
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, availableQuantity: { $gte: Number(quantity) } },
      { 
        $inc: { 
          availableQuantity: -Number(quantity),
          reservedQuantity: isPrebook ? Number(quantity) : 0 
        } 
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    const totalAmount = Number(quantity) * targetProduct.pricePerUnit;
    const initialStatus = isPrebook ? 'PREBOOKED' : 'PLACED';

    const order = await Order.create({
      orderType: targetProduct.type,
      buyer: req.user.id,
      farmer: targetProduct.farmer,
      product: targetProduct._id,
      quantity: Number(quantity),
      agreedPricePerUnit: targetProduct.pricePerUnit,
      totalAmount,
      status: initialStatus,
      deliveryAddress
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: 'READY_FOR_PICKUP', driver: null },
      { driver: req.user.id, status: 'DRIVER_ASSIGNED' },
      { new: true }
    );
    if (!order) return res.status(400).json({ message: 'Delivery not available' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const role = req.user.role;
    let filter = {};
    if (role === 'SHOPKEEPER') filter.buyer = req.user.id;
    else if (role === 'FARMER') filter.farmer = req.user.id;
    else if (role === 'DRIVER') filter.driver = req.user.id;

    const orders = await Order.find(filter)
      .populate('product', 'name category unit')
      .populate('buyer', 'name phone address')
      .populate('farmer', 'name phone address')
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'READY_FOR_PICKUP', driver: null })
      .populate('product', 'name unit')
      .populate('farmer', 'name phone address')
      .populate('buyer', 'name phone deliveryAddress');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
