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

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Explicit valid state transitions
    // Both 'PLACED' and 'PREBOOKED' can transition directly to 'READY_FOR_PICKUP'
    const allowedTransitions = {
      PLACED: ['READY_FOR_PICKUP', 'CANCELLED'],
      PREBOOKED: ['READY_FOR_PICKUP', 'CANCELLED'],
      READY_FOR_PICKUP: ['DRIVER_ASSIGNED', 'PICKED_UP', 'CANCELLED'],
      DRIVER_ASSIGNED: ['PICKED_UP', 'IN_TRANSIT'],
      PICKED_UP: ['IN_TRANSIT'],
      IN_TRANSIT: ['DELIVERED']
    };

    if (allowedTransitions[order.status] && !allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({
        message: `Invalid state transition: Cannot change status from ${order.status} to ${status}`
      });
    }

    order.status = status;
    if (status === 'READY_FOR_PICKUP') order.readyAt = new Date();
    if (status === 'DELIVERED') order.deliveredAt = new Date();

    await order.save();

    // Trigger Socket.IO updates to clients if connected
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('order_status_updated', {
        orderId: order._id,
        status: order.status
      });

      if (status === 'READY_FOR_PICKUP') {
        io.emit('new_delivery_available', { orderId: order._id });
      }
    }

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

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('driver_assigned', {
        orderId: order._id,
        driverId: req.user.id
      });
    }

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
      .populate('product', 'name category unit pricePerUnit type')
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
      .populate('buyer', 'name phone deliveryAddress address');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};