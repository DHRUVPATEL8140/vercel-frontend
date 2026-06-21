import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useUser } from './UserContext';
import InvoiceGenerator from "./InvoiceGenerator";
import { FaArrowLeft, FaStar, FaChevronDown, FaChevronUp, FaShoppingCart } from "react-icons/fa";
import { MdLocalShipping, MdAssignmentReturn } from "react-icons/md";
import { motion } from "framer-motion";

const PILLOW_DETAILS_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

/* ---------------------------------------------------------
   Design tokens — scoped to the page so nothing leaks
--------------------------------------------------------- */
.pd-page {
  --ink: #2B2E29;
  --ink-soft: #686F66;
  --ink-faint: #9AA096;
  --canvas: #FAF7F2;
  --surface: #FFFFFF;
  --line: #E8E2D5;
  --line-soft: #F1ECE2;

  --moss-900: #1E4231;
  --moss-700: #2D6A4F;
  --moss-500: #40916C;
  --moss-200: #BFE0CE;
  --moss-100: #E7F2EC;

  --clay-600: #BD5734;
  --clay-100: #F7E6DC;

  --gold: #D6A24A;
  --danger: #C0463A;
  --danger-bg: #FBEAE7;

  --r-pillow: 30px;   /* the signature plush radius */
  --r-md: 16px;
  --r-sm: 10px;
  --r-pill: 999px;

  --shadow-plush: 0 28px 50px -22px rgba(30, 38, 31, 0.22);
  --shadow-low: 0 10px 24px -14px rgba(30, 38, 31, 0.16);
  --shadow-inset: inset 0 1px 0 rgba(255,255,255,0.6);

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  background: var(--canvas);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

.pd-page * { box-sizing: border-box; }

.pd-page :focus-visible {
  outline: 2px solid var(--moss-700);
  outline-offset: 3px;
  border-radius: var(--r-sm);
}

@media (prefers-reduced-motion: reduce) {
  .pd-page *, .pd-page *::before, .pd-page *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}

/* ---------------------------------------------------------
   Loading / error / not-found states
--------------------------------------------------------- */
.pd-status {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  font-family: var(--font-body);
  color: var(--ink-soft);
  font-size: 1.05rem;
  padding: 40px;
}

.pd-status--error {
  color: var(--danger);
  background: var(--danger-bg);
  border-radius: var(--r-pillow);
  margin: 30px auto;
  max-width: 560px;
}

.pd-spinner {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid var(--moss-200);
  border-top-color: var(--moss-700);
  animation: pd-spin 0.8s linear infinite;
}

@keyframes pd-spin { to { transform: rotate(360deg); } }

/* ---------------------------------------------------------
   Shell
--------------------------------------------------------- */
.pd-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 80px;
}

.pd-back {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: transparent;
  border: none;
  color: var(--moss-700);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 9px 6px;
  margin-bottom: 22px;
  transition: gap 0.2s ease, color 0.2s ease;
}
.pd-back:hover { gap: 13px; color: var(--moss-900); }

/* ---------------------------------------------------------
   Hero — image + details
--------------------------------------------------------- */
.pd-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}

@media (max-width: 880px) {
  .pd-hero { grid-template-columns: 1fr; gap: 32px; }
}

/* signature: a soft blurred halo behind the product photo,
   echoing the softness of the pillow itself */
.pd-image-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  isolation: isolate;
}

.pd-image-wrap::before {
  content: "";
  position: absolute;
  inset: 6%;
  background: radial-gradient(circle at 35% 30%, var(--moss-100), transparent 70%);
  filter: blur(6px);
  border-radius: 50%;
  z-index: -1;
}

.pd-image-card {
  width: 100%;
  height: 100%;
  background: var(--surface);
  border-radius: var(--r-pillow);
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  box-shadow: var(--shadow-plush);
  border: 1px solid var(--line-soft);
}

.pd-image {
  max-width: 100%;
  max-height: 420px;
  object-fit: contain;
  border-radius: var(--r-md);
}

/* details column */
.pd-details { display: flex; flex-direction: column; gap: 22px; }

.pd-header {
  border-bottom: 1px solid var(--line);
  padding-bottom: 18px;
}

.pd-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.7rem, 2.6vw, 2.3rem);
  line-height: 1.15;
  margin: 0 0 12px;
  color: var(--ink);
}

.pd-rating { display: flex; align-items: center; gap: 8px; }
.pd-star { font-size: 1rem; }
.pd-review-count { font-size: 0.88rem; color: var(--ink-soft); }

.pd-price-row {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 4px 0;
}
.pd-price {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 600;
  color: var(--moss-900);
}
.pd-price-original {
  font-size: 1.05rem;
  color: var(--ink-faint);
  text-decoration: line-through;
}
.pd-badge-discount {
  background: var(--clay-100);
  color: var(--clay-600);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 5px 12px;
  border-radius: var(--r-pill);
}

.pd-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 18px;
}
.pd-meta-item {
  font-size: 0.92rem;
  color: var(--ink-soft);
}
.pd-meta-item strong { color: var(--ink); font-weight: 600; }

.pd-stock--in { color: var(--moss-700); font-weight: 600; margin-left: 5px; }
.pd-stock--out { color: var(--danger); font-weight: 600; margin-left: 5px; }

.pd-shipping {
  background: var(--moss-100);
  border-radius: var(--r-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.pd-shipping-item {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 0.92rem;
  color: var(--moss-900);
}
.pd-shipping-icon { font-size: 1.25rem; color: var(--moss-700); flex-shrink: 0; }

/* ---------------------------------------------------------
   Order card
--------------------------------------------------------- */
.pd-order-card {
  background: var(--surface);
  border-radius: var(--r-pillow);
  padding: 28px;
  box-shadow: var(--shadow-low);
  border: 1px solid var(--line-soft);
}
.pd-order-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 18px;
}

.pd-alert {
  font-size: 0.9rem;
  padding: 12px 16px;
  border-radius: var(--r-sm);
  margin-bottom: 18px;
}
.pd-alert--error { background: var(--danger-bg); color: var(--danger); }

.pd-form { display: flex; flex-direction: column; gap: 18px; }
.pd-field { display: flex; flex-direction: column; gap: 7px; }
.pd-label { font-size: 0.88rem; font-weight: 600; color: var(--ink); }

.pd-input,
.pd-textarea {
  font-family: var(--font-body);
  padding: 12px 14px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--canvas);
  font-size: 0.96rem;
  color: var(--ink);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.pd-input:focus,
.pd-textarea:focus {
  border-color: var(--moss-500);
  box-shadow: 0 0 0 3px var(--moss-100);
  outline: none;
}
.pd-textarea { min-height: 86px; resize: vertical; }

.pd-qty-row { display: flex; align-items: center; gap: 12px; }
.pd-qty-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--moss-700);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s ease, transform 0.1s ease;
}
.pd-qty-btn:hover:not(:disabled) { background: var(--moss-100); }
.pd-qty-btn:active:not(:disabled) { transform: scale(0.93); }
.pd-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pd-qty-input { width: 64px; text-align: center; }

.pd-error-text { color: var(--danger); font-size: 0.82rem; }

.pd-total-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-top: 4px;
}
.pd-total-amount { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--moss-900); }

.pd-btn-primary {
  font-family: var(--font-body);
  background: var(--moss-700);
  color: #fff;
  border: none;
  padding: 15px 20px;
  border-radius: var(--r-pill);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  box-shadow: var(--shadow-low);
  transition: background 0.18s ease, transform 0.12s ease;
}
.pd-btn-primary:hover:not(:disabled) { background: var(--moss-900); transform: translateY(-1px); }
.pd-btn-primary:active:not(:disabled) { transform: translateY(0); }
.pd-btn-primary:disabled { background: var(--ink-faint); cursor: not-allowed; box-shadow: none; }

/* ---------------------------------------------------------
   Tabs
--------------------------------------------------------- */
.pd-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.pd-tab {
  position: relative;
  padding: 14px 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--ink-soft);
  transition: color 0.18s ease;
}
.pd-tab:hover { color: var(--moss-700); }
.pd-tab::after {
  content: "";
  position: absolute;
  left: 22px; right: 22px; bottom: -1px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: transparent;
  transition: background 0.2s ease;
}
.pd-tab--active { color: var(--moss-900); }
.pd-tab--active::after { background: var(--moss-700); }

.pd-tab-heading {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 18px;
}
.pd-description { line-height: 1.75; color: var(--ink-soft); font-size: 1.04rem; max-width: 68ch; }

.pd-specs {
  width: 100%;
  border-collapse: collapse;
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-low);
}
.pd-specs tr { border-bottom: 1px solid var(--line-soft); }
.pd-specs tr:last-child { border-bottom: none; }
.pd-specs td { padding: 15px 20px; }
.pd-specs td:first-child { width: 32%; font-weight: 600; background: var(--moss-100); color: var(--moss-900); }
.pd-specs td:last-child { color: var(--ink-soft); background: var(--surface); }

/* reviews */
.pd-reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
}
.pd-btn-outline {
  background: transparent;
  border: 1.5px solid var(--moss-700);
  color: var(--moss-700);
  padding: 9px 18px;
  border-radius: var(--r-pill);
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}
.pd-btn-outline:hover { background: var(--moss-700); color: #fff; }

.pd-review-form {
  background: var(--surface);
  border: 1px solid var(--line-soft);
  padding: 26px;
  border-radius: var(--r-pillow);
  margin-bottom: 30px;
  box-shadow: var(--shadow-low);
}
.pd-review-form h4 { font-family: var(--font-display); margin: 0 0 18px; font-size: 1.1rem; }
.pd-select {
  padding: 10px 14px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  margin-left: 10px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  background: var(--canvas);
}
.pd-form-buttons { display: flex; justify-content: flex-end; margin-top: 14px; }
.pd-btn-submit {
  background: var(--moss-700);
  color: #fff;
  border: none;
  padding: 11px 24px;
  border-radius: var(--r-pill);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease;
}
.pd-btn-submit:hover { background: var(--moss-900); }

.pd-review {
  border-bottom: 1px solid var(--line-soft);
  padding: 22px 4px;
  display: flex;
  gap: 16px;
}
.pd-review:last-child { border-bottom: none; }
.pd-avatar {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--moss-100);
  color: var(--moss-900);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
}
.pd-review-body { flex: 1; min-width: 0; }
.pd-review-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.pd-review-author { font-weight: 600; color: var(--ink); }
.pd-review-text { color: var(--ink-soft); line-height: 1.65; margin: 4px 0 8px; }
.pd-review-date { font-size: 0.8rem; color: var(--ink-faint); }

.pd-empty {
  text-align: center;
  color: var(--ink-soft);
  font-style: italic;
  padding: 30px;
  background: var(--moss-100);
  border-radius: var(--r-pillow);
}

/* ---------------------------------------------------------
   Related products
--------------------------------------------------------- */
.pd-related { margin-top: 56px; padding-top: 36px; border-top: 1px solid var(--line); }
.pd-related-head {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 14px; margin-bottom: 26px;
}
.pd-related-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; margin: 0; }

.pd-related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 22px;
}
.pd-related-card {
  background: var(--surface);
  border-radius: var(--r-pillow);
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--line-soft);
  box-shadow: var(--shadow-low);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.pd-related-card:hover { box-shadow: var(--shadow-plush); transform: translateY(-3px); }
.pd-related-img-wrap {
  background: var(--canvas);
  height: 180px;
  display: flex; align-items: center; justify-content: center;
  padding: 18px;
}
.pd-related-img { max-height: 145px; max-width: 100%; object-fit: contain; }
.pd-related-info { padding: 18px; }
.pd-related-name {
  font-family: var(--font-display);
  font-size: 1.04rem; font-weight: 600;
  margin: 0 0 8px; color: var(--ink);
}
.pd-related-price { font-size: 1.12rem; font-weight: 700; color: var(--moss-700); margin-bottom: 10px; }
.pd-chip {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--r-pill);
}
.pd-chip--in { background: var(--moss-100); color: var(--moss-900); }
.pd-chip--out { background: var(--danger-bg); color: var(--danger); }

/* ---------------------------------------------------------
   Modal
--------------------------------------------------------- */
.pd-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(30, 38, 31, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.pd-modal {
  background: var(--surface);
  padding: 36px 30px 26px;
  border-radius: var(--r-pillow);
  box-shadow: var(--shadow-plush);
  min-width: 340px;
  max-width: 480px;
  width: 100%;
  text-align: center;
}
.pd-modal-title {
  font-family: var(--font-display);
  color: var(--moss-900);
  font-size: 1.4rem;
  margin: 0 0 10px;
}
.pd-modal-text { color: var(--ink-soft); margin-bottom: 8px; }
.pd-modal-close {
  margin-top: 20px;
  background: var(--moss-700);
  color: #fff;
  border: none;
  border-radius: var(--r-pill);
  padding: 11px 28px;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease;
}
.pd-modal-close:hover { background: var(--moss-900); }

`;

// Order Form Component
export function OrderForm({ pillow, onPlaceOrder, stock }) {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user } = useUser();

  const validateForm = () => {
    const newErrors = {};
    if (quantity < 1 || quantity > stock) {
      newErrors.quantity = `Quantity must be between 1 and ${stock}`;
    }
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      const redirectPath = `${window.location.pathname}${window.location.search}`;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (validateForm()) {
      const total_amount = Number(pillow.price) * quantity;
      onPlaceOrder({
        products: [pillow.id],
        total_amount,
        address,
        phone,
        quantity,
        product: pillow, // Pass pillow object for InvoiceGenerator
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pd-form">
      <div className="pd-field">
        <label htmlFor="quantity" className="pd-label">Quantity</label>
        <div className="pd-qty-row">
          <button
            type="button"
            className="pd-qty-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="pd-input pd-qty-input"
          />
          <button
            type="button"
            className="pd-qty-btn"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {errors.quantity && <span className="pd-error-text">{errors.quantity}</span>}
      </div>

      <div className="pd-field">
        <label htmlFor="address" className="pd-label">Shipping address</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="pd-textarea"
          required
        />
        {errors.address && <span className="pd-error-text">{errors.address}</span>}
      </div>

      <div className="pd-field">
        <label htmlFor="phone" className="pd-label">Phone number</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="pd-input"
          required
        />
        {errors.phone && <span className="pd-error-text">{errors.phone}</span>}
      </div>

      <div className="pd-total-row">
        <span className="pd-label">Total amount</span>
        <span className="pd-total-amount">${(Number(pillow.price) * quantity).toFixed(2)}</span>
      </div>

      <button type="submit" className="pd-btn-primary" disabled={stock <= 0}>
        <FaShoppingCart />
        {stock > 0 ? "Place order" : "Out of stock"}
      </button>
    </form>
  );
}

// Main PillowDetails Component
export default function PillowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pillow, setPillow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedPillows, setRelatedPillows] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orderData, setOrderData] = useState(null); // for InvoiceGenerator

  useEffect(() => {
    const fetchPillowData = async () => {
      try {
        setLoading(true);
        const pillowResponse = await api.get(`pillows/${id}/`);
        const pillowData = pillowResponse.data;
        setPillow(pillowData);

        if (pillowData.image) {
          setMainImage(pillowData.image);
        }

        // Related pillows
        const relatedResponse = await api.get(`pillows/`, {
          params: {
            exclude: id,
            limit: 8
          }
        });
        setRelatedPillows(relatedResponse.data);

        // Reviews (best-effort): don't block page if reviews endpoint requires auth
        try {
          const reviewsResponse = await api.get(`reviews/product_reviews/?product_id=${id}`);
          setReviews(reviewsResponse.data);
        } catch (revErr) {
          console.warn('Could not load pillow reviews', id, revErr);
          setReviews([]);
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 404) {
          setPillow(null);
        } else if (status === 401) {
          setError("Unable to load pillow details.");
        } else {
          setError(err.message || "Failed to fetch pillow data");
        }
        console.error("Failed to fetch pillow data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPillowData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("reviews/", {
        product: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);

      setPillow(prev => ({
        ...prev,
        review_count: prev.review_count + 1,
        average_rating: (
          (prev.average_rating * prev.review_count + response.data.rating) /
          (prev.review_count + 1)
        )
      }));
    } catch (err) {
      console.error("Failed to add review:", err);
    }
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      setOrderError(null);
      const response = await api.post("orders/", {
        products: orderData.products,
        total_amount: orderData.total_amount,
        address: orderData.address,
        phone: orderData.phone
      });
      setOrderSuccess(`Order placed successfully! Order ID: ${response.data.id}`);
      setOrderData({ ...orderData, orderId: response.data.id }); // Save order details for InvoiceGenerator
    } catch (err) {
      setOrderError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Failed to place order. Please try again."
      );
      console.error("Failed to place order:", err);
    }
  };

  const toggleShowAllRelated = () => setShowAllRelated(!showAllRelated);

  const closeModal = () => {
    setOrderSuccess(null);
    setOrderData(null);
  };

  if (loading) {
    return (
      <div className="pd-page">
      <style>{PILLOW_DETAILS_STYLES}</style>
        <div className="pd-status">
          <div className="pd-spinner" />
          Loading pillow details…
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="pd-page">
      <style>{PILLOW_DETAILS_STYLES}</style>
        <div className="pd-status pd-status--error">Error: {error}</div>
      </div>
    );
  }
  if (!pillow) {
    return (
      <div className="pd-page">
      <style>{PILLOW_DETAILS_STYLES}</style>
        <div className="pd-status">Pillow not found</div>
      </div>
    );
  }

  const displayedRelated = showAllRelated ? relatedPillows : relatedPillows.slice(0, 4);

  return (
    <div className="pd-page">
      <style>{PILLOW_DETAILS_STYLES}</style>
      <div className="pd-container">
        <button onClick={() => navigate(-1)} className="pd-back">
          <FaArrowLeft /> Back to pillows
        </button>

        <div className="pd-hero">
          <div className="pd-image-wrap">
            <motion.div
              className="pd-image-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={mainImage}
                alt={pillow.name}
                className="pd-image"
                onError={e => { e.target.src = "/placeholder.png"; }}
              />
            </motion.div>
          </div>

          <div className="pd-details">
            <div className="pd-header">
              <h1 className="pd-title">{pillow.name}</h1>
              <div className="pd-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="pd-star"
                    style={{ color: i < Math.round(pillow.average_rating) ? "#D6A24A" : "#E8E2D5" }}
                  />
                ))}
                <span className="pd-review-count">({pillow.review_count} reviews)</span>
              </div>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">${Number(pillow.price).toFixed(2)}</span>
              <span className="pd-price-original">${(Number(pillow.price) * 1.2).toFixed(2)}</span>
              <span className="pd-badge-discount">20% OFF</span>
            </div>

            <div className="pd-meta-grid">
              <div className="pd-meta-item"><strong>Color:</strong> {pillow.color}</div>
              <div className="pd-meta-item"><strong>Material:</strong> Premium foam</div>
              <div className="pd-meta-item"><strong>Size:</strong> Standard (20×20 in)</div>
              <div className="pd-meta-item">
                <strong>Availability:</strong>
                <span className={pillow.stock > 0 ? "pd-stock--in" : "pd-stock--out"}>
                  {pillow.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="pd-shipping">
              <div className="pd-shipping-item">
                <MdLocalShipping className="pd-shipping-icon" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="pd-shipping-item">
                <MdAssignmentReturn className="pd-shipping-icon" />
                <span>30-day return policy</span>
              </div>
            </div>

            <div className="pd-order-card">
              <h3 className="pd-order-title">Order details</h3>
              {orderError && <div className="pd-alert pd-alert--error">{orderError}</div>}
              <OrderForm pillow={pillow} onPlaceOrder={handlePlaceOrder} stock={pillow.stock} />
            </div>
          </div>
        </div>

        <div className="pd-tabs">
          {["description", "specs", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`pd-tab ${activeTab === tab ? "pd-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description" && "Description"}
              {tab === "specs" && "Specifications"}
              {tab === "reviews" && `Reviews (${reviews.length})`}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "description" && (
            <div>
              <h3 className="pd-tab-heading">Pillow description</h3>
              <p className="pd-description">{pillow.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              <h3 className="pd-tab-heading">Technical specifications</h3>
              <table className="pd-specs">
                <tbody>
                  <tr><td>Material</td><td>Premium memory foam</td></tr>
                  <tr><td>Size</td><td>Standard (20×20 inches)</td></tr>
                  <tr><td>Color</td><td>{pillow.color}</td></tr>
                  <tr><td>Weight</td><td>2.5 lbs</td></tr>
                  <tr><td>Dimensions</td><td>20 × 20 × 5 inches</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="pd-reviews-header">
                <h3 className="pd-tab-heading" style={{ margin: 0 }}>Customer reviews</h3>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="pd-btn-outline">
                  {showReviewForm ? "Cancel review" : "Add review"}
                </button>
              </div>

              {showReviewForm && (
                <div className="pd-review-form">
                  <h4>Write a review</h4>
                  <form onSubmit={handleAddReview}>
                    <div className="pd-field" style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                      <label className="pd-label">Rating:</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        className="pd-select"
                      >
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                      </select>
                    </div>
                    <div className="pd-field" style={{ marginBottom: 18 }}>
                      <label className="pd-label">Comment:</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Share your experience with this pillow…"
                        className="pd-textarea"
                        required
                      />
                    </div>
                    <div className="pd-form-buttons">
                      <button type="submit" className="pd-btn-submit">Submit review</button>
                    </div>
                  </form>
                </div>
              )}

              {reviews.length > 0 ? (
                reviews.map((review) => {
                  const author = review.user?.username || "Anonymous";
                  return (
                    <div key={review.id} className="pd-review">
                      <div className="pd-avatar">{author.charAt(0).toUpperCase()}</div>
                      <div className="pd-review-body">
                        <div className="pd-review-head">
                          <span className="pd-review-author">{author}</span>
                          <div className="pd-rating">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className="pd-star"
                                style={{ color: i < review.rating ? "#D6A24A" : "#E8E2D5" }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="pd-review-text">{review.comment}</p>
                        <span className="pd-review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="pd-empty">No reviews yet. Be the first to review this pillow!</p>
              )}
            </div>
          )}
        </div>

        {relatedPillows.length > 0 && (
          <div className="pd-related">
            <div className="pd-related-head">
              <h3 className="pd-related-title">You may also like</h3>
              {relatedPillows.length > 4 && (
                <button onClick={toggleShowAllRelated} className="pd-btn-outline">
                  {showAllRelated ? "Show less" : "Show more"}
                  {showAllRelated ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              )}
            </div>
            <div className="pd-related-grid">
              {displayedRelated.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="pd-related-card"
                  onClick={() => navigate(`/pillows/${related.id}`)}
                >
                  <div className="pd-related-img-wrap">
                    <img src={related.image} alt={related.name} className="pd-related-img" />
                  </div>
                  <div className="pd-related-info">
                    <h4 className="pd-related-name">{related.name}</h4>
                    <div className="pd-related-price">${Number(related.price).toFixed(2)}</div>
                    <span className={related.stock > 0 ? "pd-chip pd-chip--in" : "pd-chip pd-chip--out"}>
                      {related.stock > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {orderSuccess && orderData && (
          <div className="pd-modal-overlay">
            <div className="pd-modal">
              <h2 className="pd-modal-title">Order successful!</h2>
              <p className="pd-modal-text">{orderSuccess}</p>
              <InvoiceGenerator order={orderData} />
              <button className="pd-modal-close" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 