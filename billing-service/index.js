const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const invoices = [];
let nextId = 1;

app.get('/api/billing/invoices', (req, res) => res.json(invoices));
app.post('/api/billing/invoices', (req, res) => {
    const total = req.body.items ? req.body.items.reduce((s, i) => s + (i.price * i.quantity), 0) : 0;
    const inv = {
        id: nextId++,
        customerName: req.body.customerName,
        totalAmount: total,
        items: req.body.items || [],
        date: new Date()
    };
    invoices.push(inv);
    res.status(201).json(inv);
});

app.listen(8082, () => console.log('Billing service (Node fallback) on 8082'));
