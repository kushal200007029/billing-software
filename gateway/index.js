const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// Auth proxy (Python FastAPI on 8001)
app.use('/auth', createProxyMiddleware({ 
    target: 'http://127.0.0.1:8001', 
    changeOrigin: true,
    pathRewrite: { '^/auth': '' }
}));

// Products proxy (Go Gin on 8081)
app.use('/products', createProxyMiddleware({ 
    target: 'http://127.0.0.1:8081', 
    changeOrigin: true,
    pathRewrite: { '^/products': '/api/products' }
}));

// Billing proxy (Java Spring Boot on 8082)
app.use('/billing', createProxyMiddleware({ 
    target: 'http://127.0.0.1:8082', 
    changeOrigin: true,
    pathRewrite: { '^/billing': '/api/billing' }
}));

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`API Gateway listening on http://localhost:${PORT}`);
});
