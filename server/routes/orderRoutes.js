import express from 'express';
import { 
  createOrder, 
  updateOrderStatus, 
  acceptDelivery, 
  getMyOrders, 
  getAvailableDeliveries 
} from '../controllers/orderController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { generateInvoicePDF } from '../utils/invoiceGenerator.js';

const router = express.Router();

// Enforce authentication on all order routes
router.use(verifyToken);

// ==========================================
// 1. SHOPKEEPER ROUTES
// ==========================================

// Create a spot purchase or pre-book future harvest produce
router.post('/', requireRole('SHOPKEEPER', 'ADMIN'), createOrder);

// ==========================================
// 2. COMMON / ROLE-BASED HISTORY ROUTES
// ==========================================

// Get user-specific orders based on token role (Farmer, Shopkeeper, Driver)
router.get('/my-orders', getMyOrders);

// ==========================================
// 3. DRIVER LOGISTICS ROUTES
// ==========================================

// View unassigned orders flagged as READY_FOR_PICKUP
router.get('/driver/available', requireRole('DRIVER', 'ADMIN'), getAvailableDeliveries);

// Driver claims/accepts a delivery
router.put('/:orderId/accept', requireRole('DRIVER', 'ADMIN'), acceptDelivery);

// ==========================================
// 4. ORDER STATE MACHINE TRANSITION
// ==========================================

// Updates status: READY_FOR_PICKUP, PICKED_UP, IN_TRANSIT, DELIVERED
router.put('/:orderId/status', updateOrderStatus);

// ==========================================
// 5. TAX INVOICE GENERATION (PDF)
// ==========================================

// Download official PDF invoice for orders
router.get('/:orderId/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('farmer', 'name phone address')
      .populate('buyer', 'name phone address')
      .populate('driver', 'name phone')
      .populate('product', 'name category unit');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Set HTTP headers to prompt download of PDF in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Invoice_${order._id.toString().slice(-6).toUpperCase()}.pdf`
    );

    generateInvoicePDF(order, res);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate PDF invoice', error: err.message });
  }
});

// ==========================================
// 6. ADMIN PLATFORM OVERVIEW & ANALYTICS
// ==========================================

router.get('/admin/overview', requireRole('ADMIN'), async (req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }),
      Order.find()
        .populate('farmer', 'name phone address')
        .populate('buyer', 'name phone address')
        .populate('driver', 'name phone')
        .populate('product', 'name category unit pricePerUnit')
        .sort({ createdAt: -1 }),
      Product.find()
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeDeliveries = orders.filter(o => 
      ['DRIVER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(o.status)
    );

    const roleCounts = {
      FARMER: users.filter(u => u.role === 'FARMER').length,
      SHOPKEEPER: users.filter(u => u.role === 'SHOPKEEPER').length,
      DRIVER: users.filter(u => u.role === 'DRIVER').length,
      ADMIN: users.filter(u => u.role === 'ADMIN').length
    };

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        platformCommission: Math.round(totalRevenue * 0.05), // 5% platform fee
        totalOrders: orders.length,
        activeDeliveriesCount: activeDeliveries.length,
        totalProducts: products.length,
        futureProduceCount: products.filter(p => p.type === 'FUTURE').length
      },
      roleCounts,
      users,
      orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;