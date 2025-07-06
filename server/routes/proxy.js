import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/product/:barcode', async (req, res) => {
  const { barcode } = req.params;
  
  try {
    const response = await axios.get(`https://products-test-aci.onrender.com/product/${barcode}`);
    res.json(response.data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    
    // Handle different types of errors
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(err.response.status).json({
        error: 'Failed to fetch product data',
        details: err.response.data
      });
    } else if (err.request) {
      // The request was made but no response was received
      res.status(503).json({
        error: 'External service unavailable',
        details: 'No response received from external API'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        error: 'Failed to fetch product data',
        details: err.message
      });
    }
  }
});

export default router; 