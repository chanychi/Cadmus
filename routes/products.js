const express = require('express');
const router = express.Router();
const ProductRequest = require('../controllers/ProductController.js');
const FetchProductRequest = new ProductRequest()

router.get('/', async (req, res) => {
  try {
    const data = await FetchProductRequest.getAllProducts()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

router.get('/:productId', async (req, res) => {
  let productId = req.params.productId
  productId = parseInt(productId)

  try {
    const data = await FetchProductRequest.getProductById(productId)
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
})

router.get('/:productId/styles', async (req, res) => {
  let productId = req.params.productId
  productId = parseInt(productId)
  try {
    const data = await FetchProductRequest.getProductStyles(productId)
    res.status(200).json(data)
  } catch (error) {

  }
})

module.exports = router