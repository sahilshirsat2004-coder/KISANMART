import { Product } from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, category, pricePerUnit, unit, type, availableQuantity, expectedHarvestDate } = req.body;
    if (type === 'FUTURE' && !expectedHarvestDate) {
      return res.status(400).json({ message: 'Expected harvest date is required for future produce' });
    }
    const product = await Product.create({
      farmer: req.user.id,
      name,
      category,
      pricePerUnit,
      unit,
      type,
      availableQuantity,
      expectedHarvestDate: type === 'FUTURE' ? new Date(expectedHarvestDate) : null
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, type } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (type) query.type = type.toUpperCase();

    const products = await Product.find(query)
      .populate('farmer', 'name phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name phone address');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
