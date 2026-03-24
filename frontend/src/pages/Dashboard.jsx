import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Package, FileText, Plus, ShoppingCart } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:8000/billing/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
    window.location.reload();
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productName === product.name);
    if (existing) {
      setCart(cart.map(item => item.productName === product.name ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productName: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const createInvoice = async () => {
    if (!customerName || cart.length === 0) return alert('Please provide customer name and add items to cart');
    
    try {
      await axios.post('http://localhost:8000/billing/invoices', {
        customerName,
        items: cart
      });
      alert('Invoice created successfully!');
      setCart([]);
      setCustomerName('');
      fetchInvoices();
      setActiveTab('invoices');
    } catch (err) {
      alert('Failed to create invoice');
    }
  };

  return (
    <div className="animate-fade-in">
      <nav className="navbar" style={{ margin: '-2rem -2rem 2rem -2rem', borderRadius: '16px 16px 0 0' }}>
        <h2 className="text-gradient">NexBill Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray">Hi, {username}</span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="flex gap-4 mb-6">
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} /> Products & Cart
        </button>
        <button 
          className={`btn ${activeTab === 'invoices' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('invoices')}
        >
          <FileText size={18} /> Invoices
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="grid grid-cols-3">
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h3 className="mb-4">Product Catalog</h3>
            <div className="grid grid-cols-2">
              {products.map(p => (
                <div key={p.id} className="card" style={{ background: 'var(--bg-primary)' }}>
                  <h4>{p.name}</h4>
                  <p className="text-gray mb-4">${p.price.toFixed(2)}</p>
                  <button className="btn btn-secondary w-full" onClick={() => addToCart(p)}>
                    <Plus size={16} /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 flex items-center gap-2"><ShoppingCart size={20} /> Current Cart</h3>
            <div className="input-group">
              <label className="input-label">Customer Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            
            <div className="mb-4" style={{ minHeight: '150px' }}>
              {cart.length === 0 ? (
                <p className="text-gray text-center mt-4">Cart is empty</p>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center mb-2" style={{ padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <span>{item.quantity}x {item.productName}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-between items-center mb-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <strong>Total:</strong>
              <strong className="text-gradient">${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong>
            </div>

            <button className="btn btn-primary w-full" onClick={createInvoice} disabled={cart.length === 0 || !customerName}>
              Generate Invoice
            </button>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="card">
          <h3 className="mb-4">Billing History</h3>
          {invoices.length === 0 ? (
            <p className="text-gray">No invoices found.</p>
          ) : (
            <div className="grid grid-cols-1">
              {invoices.map(inv => (
                <div key={inv.id} className="card flex justify-between items-center" style={{ background: 'var(--bg-primary)' }}>
                  <div>
                    <h4 className="mb-2">Invoice #{inv.id} - {inv.customerName}</h4>
                    <p className="text-sm text-gray">{new Date(inv.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <strong className="text-gradient" style={{ fontSize: '1.25rem' }}>${inv.totalAmount.toFixed(2)}</strong>
                    <p className="text-sm text-gray">{inv.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
