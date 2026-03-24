const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const products = [
    {id: 1, name: "Enterprise License", price: 499.99, stock: 999},
    {id: 2, name: "Professional License", price: 199.99, stock: 999},
    {id: 3, name: "Basic License", price: 49.99, stock: 999},
];
let nextId = 4;

app.get('/api/products', (req, res) => res.json(products));
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: "product not found" });
    }
});
app.post('/api/products', (req, res) => {
    const p = { id: nextId++, ...req.body };
    products.push(p);
    res.status(201).json(p);
});

app.listen(8081, () => console.log('Product service (Node fallback) on 8081'));
