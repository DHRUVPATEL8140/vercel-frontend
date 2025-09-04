// src/components/OrderForm.js
import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function OrderForm({ product, onOrderCreated }) {
  const [qty, setQty] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleQtyChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQty(value);
  };

  const placeOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const payload = {
      products: [{ 
        product_id: product.id, 
        name: product.name, 
        qty: qty, 
        price: product.price 
      }],
      total_amount: (qty * parseFloat(product.price)).toFixed(2),
      address,
      phone
    };

    try {
      const res = await api.post("orders/", payload);
      onOrderCreated(res.data);
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error placing order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3 style={styles.title}>Order Details</h3>
      
      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span>Product:</span>
          <span>{product.name}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Unit Price:</span>
          <span>${product.price}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Total:</span>
          <span style={styles.totalAmount}>${(qty * parseFloat(product.price)).toFixed(2)}</span>
        </div>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>Quantity</label>
        <input 
          style={styles.input} 
          type="number" 
          min="1" 
          value={qty} 
          onChange={handleQtyChange}
        />
      </div>
      
      <div style={styles.row}>
        <label style={styles.label}>Shipping Address</label>
        <textarea 
          style={{...styles.input, ...styles.textarea}} 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full address"
        />
      </div>
      
      <div style={styles.row}>
        <label style={styles.label}>Phone Number</label>
        <input 
          style={styles.input} 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          type="tel"
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button 
        style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button} 
        onClick={placeOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}

const styles = {
  formContainer: {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxWidth: '500px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #edf2f7',
  },
  summary: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '0.95rem',
    color: '#4a5568',
  },
  totalAmount: {
    fontWeight: '600',
    color: '#2b6cb0',
    fontSize: '1.1rem',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  label: {
    marginBottom: '8px',
    color: '#4a5568',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  input: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 14px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    outline: 'none',
    color: '#2d3748',
    backgroundColor: '#fff',
  },
  textarea: {
    height: '100px',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    width: '100%',
    transition: 'all 0.2s',
    marginTop: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.9rem',
    marginBottom: '12px',
    padding: '8px 12px',
    backgroundColor: '#fff5f5',
    borderRadius: '6px',
    borderLeft: '3px solid #e53e3e',
  }
};