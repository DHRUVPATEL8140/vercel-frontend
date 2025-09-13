










import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaArrowLeft, FaStar, FaChevronDown, FaChevronUp, FaShoppingCart, FaTimes } from "react-icons/fa";
import { MdLocalShipping, MdAssignmentReturn } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import InvoiceGenerator from "./InvoiceGenerator";

// Order Form Component for EPE Sheets
export function OrderForm({ sheet, onPlaceOrder, stock }) {
  const [quantity, setQuantity] = useState(stock >= 100 ? 100 : Math.max(1, stock));
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (quantity < 100 || quantity > stock) {
      newErrors.quantity = `Quantity must be between 100 and ${stock}`;
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
    if (validateForm()) {
      // Instead of placing order, open mail client and show phone number
      const subject = encodeURIComponent(`EPE Sheet Inquiry: ${sheet.name}`);
      const body = encodeURIComponent(
        `Hello,\n\nI would like to inquire about the following EPE Sheet:\n\nSheet: ${sheet.name}\nQuantity: ${quantity}\nShipping Address: ${address}\nPhone: ${phone}\n\nPlease contact me at ${phone}.\n\nThank you!`
      );
      window.location.href = `mailto:pateldhruv20065@gmail.com?subject=${subject}&body=${body}`;
      alert("For quick response, you can also call: 8140463137");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={orderFormStyles.form}>
      <div style={orderFormStyles.formGroup}>
        <label htmlFor="quantity" style={orderFormStyles.label}>
          Quantity (Min 100):
        </label>
        <div className="d-flex align-items-center">
          <button 
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            style={{ width: "40px", height: "40px" }}
            onClick={() => setQuantity(Math.max(100, quantity - 1))}
            disabled={quantity <= 100 || stock < 100}
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            min="100"
            max={stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 100;
              setQuantity(Math.min(stock, Math.max(100, val)));
            }}
            style={{ 
              ...orderFormStyles.input, 
              width: "80px", 
              textAlign: "center",
              margin: "0 10px"
            }}
          />
          <button 
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            style={{ width: "40px", height: "40px" }}
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
        {errors.quantity && (
          <span style={orderFormStyles.error}>{errors.quantity}</span>
        )}
        {stock < 100 && (
          <span style={orderFormStyles.error}>
            Minimum order of 100 not available. Only {stock} in stock.
          </span>
        )}
      </div>

      <div style={orderFormStyles.formGroup}>
        <label htmlFor="address" style={orderFormStyles.label}>Shipping Address:</label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ ...orderFormStyles.input, minHeight: "80px" }}
          required
        />
        {errors.address && (
          <span style={orderFormStyles.error}>{errors.address}</span>
        )}
      </div>

      <div style={orderFormStyles.formGroup}>
        <label htmlFor="phone" style={orderFormStyles.label}>Phone Number:</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={orderFormStyles.input}
          required
        />
        {errors.phone && (
          <span style={orderFormStyles.error}>{errors.phone}</span>
        )}
      </div>

      <div style={orderFormStyles.formGroup}>
        <label style={orderFormStyles.label}>Total Amount:</label>
        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          ₹{(Number(sheet.price) * quantity).toFixed(2)}
        </div>
      </div>

      <button 
        type="submit" 
        style={orderFormStyles.submitButton}
        disabled={stock < 100}
      >
        <FaShoppingCart className="me-2" />
        {stock >= 100 
          ? "Place Order" 
          : `Minimum order not available (${stock} in stock)`
        }
      </button>
    </form>
  );
}

// Main EPE Sheet Details Component
export default function EPESheetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedSheets, setRelatedSheets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        setLoading(true);
        const sheetResponse = await api.get(`epe-sheets/${id}/`);
        const sheetData = sheetResponse.data;
        setSheet(sheetData);

        // Related sheets (same category or similar)
        const relatedResponse = await api.get(`epe-sheets/`, {
          params: {
            exclude: id,
            limit: 8,
            category: sheetData.category
          }
        });
        setRelatedSheets(relatedResponse.data);

        // Reviews
        const reviewsResponse = await api.get(`reviews/product_reviews/?product_id=${id}&product_type=epe_sheet`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch EPE sheet data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSheetData();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("reviews/", {
        product: id,
        product_type: "epe_sheet",
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);

      setSheet(prev => ({
        ...prev,
        review_count: prev.review_count + 1,
        average_rating: (
          (prev.average_rating * prev.review_count + response.data.rating) /
          (prev.review_count + 1)
      )}));
    } catch (err) {
      console.error("Failed to add review:", err);
    }
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      setOrderError(null);
      const response = await api.post("orders/", {
        products: orderData.products,
        product_type: "epe_sheet",
        total_amount: orderData.total_amount,
        address: orderData.address,
        phone: orderData.phone
      });
      setOrderSuccess(`Order placed successfully! Order ID: ${response.data.id}`);
      setOrderData({ ...orderData, orderId: response.data.id });
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

  if (loading) return <div style={styles.loading}>Loading EPE sheet details...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!sheet) return <div style={styles.notFound}>EPE sheet not found</div>;

  const displayedRelated = showAllRelated ? relatedSheets : relatedSheets.slice(0, 4);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back to Gallery
      </button>

      <div style={styles.productContainer}>
        <div style={styles.imageSection}>
          <motion.div
            style={styles.mainImageContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setImageModalOpen(true)}
          >
            <img
              src={sheet.image}
              alt={sheet.name}
              style={styles.mainProductImage}
              onError={e => { e.target.src = "/placeholder.png"; }}
            />
          </motion.div>
        </div>
        <div style={styles.detailsSection}>
          <div style={styles.productHeader}>
            <h1 style={styles.productName}>{sheet.name}</h1>
            <div style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  style={{
                    ...styles.starIcon,
                    color: i < Math.round(sheet.average_rating) ? "#ffc107" : "#ddd"
                  }}
                />
              ))}
              <span style={styles.reviewCount}>({sheet.review_count} reviews)</span>
            </div>
          </div>
          <div style={styles.priceContainer}>
            <span style={styles.price}>₹{sheet.price}</span>
            {sheet.original_price && (
              <>
                <span style={styles.originalPrice}>₹{sheet.original_price}</span>
                <span style={styles.discountBadge}>
                  {Math.round((1 - sheet.price / sheet.original_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <div style={styles.metaInfo}>
            <div style={styles.metaItem}><strong>Size:</strong> {sheet.size || "N/A"}</div>
            <div style={styles.metaItem}><strong>Thickness:</strong> {sheet.thickness || "N/A"}</div>
            <div style={styles.metaItem}><strong>Color:</strong> {sheet.color || "N/A"}</div>
            <div style={styles.metaItem}>
              <strong>Availability:</strong>
              <span style={{
                color: sheet.stock > 0 ? "#38a169" : "#e53e3e",
                fontWeight: 500,
                marginLeft: 5
              }}>
                {sheet.stock > 0 ? `${sheet.stock} units in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>
          <div style={styles.shippingInfo}>
            <div style={styles.shippingItem}>
              <MdLocalShipping style={styles.shippingIcon} />
              <span>Free shipping on orders over ₹50</span>
            </div>
            <div style={styles.shippingItem}>
              <MdAssignmentReturn style={styles.shippingIcon} />
              <span>30-day return policy</span>
            </div>
          </div>
          <div style={styles.orderFormContainer}>
            <h3 style={styles.orderFormTitle}>Order Details</h3>
            {orderError && <div style={styles.errorMessage}>{orderError}</div>}
            <OrderForm
              sheet={sheet}
              onPlaceOrder={handlePlaceOrder}
              stock={sheet.stock}
            />
          </div>
        </div>
      </div>
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "description" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "specifications" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("specifications")}
        >
          Specifications
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "reviews" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </button>
      </div>
      <div style={styles.tabContent}>
        {activeTab === "description" && (
          <div>
            <h3 style={styles.tabHeading}>Product Description</h3>
            <p style={styles.descriptionText}>{sheet.description}</p>
          </div>
        )}
        {activeTab === "specifications" && (
          <div>
            <h3 style={styles.tabHeading}>Technical Specifications</h3>
            <table style={styles.specsTable}>
              <tbody>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Material</td>
                  <td style={styles.specValue}>Expanded Polyethylene (EPE)</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Size</td>
                  <td style={styles.specValue}>{sheet.size || "N/A"}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Thickness</td>
                  <td style={styles.specValue}>{sheet.thickness || "N/A"}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Color</td>
                  <td style={styles.specValue}>{sheet.color || "N/A"}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Density</td>
                  <td style={styles.specValue}>{sheet.density || "N/A"}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Tensile Strength</td>
                  <td style={styles.specValue}>{sheet.tensile_strength || "N/A"}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Compression Strength</td>
                  <td style={styles.specValue}>{sheet.compression_strength || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "reviews" && (
          <div>
            <div style={styles.reviewsHeader}>
              <h3 style={styles.tabHeading}>Customer Reviews</h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={styles.addReviewButton}
              >
                {showReviewForm ? "Cancel Review" : "Add Review"}
              </button>
            </div>
            {showReviewForm && (
              <motion.div 
                style={styles.reviewForm}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <h4>Write a Review</h4>
                <form onSubmit={handleAddReview}>
                  <div style={styles.ratingInput}>
                    <label>Rating:</label>
                    <div style={styles.starRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          style={{
                            cursor: "pointer",
                            fontSize: "1.5rem",
                            color: star <= newReview.rating ? "#ffc107" : "#ddd",
                            transition: "color 0.2s"
                          }}
                        >
                          <FaStar />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={styles.commentInput}>
                    <label>Comment:</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      style={styles.textarea}
                      required
                    />
                  </div>
                  <div style={styles.formButtons}>
                    <button type="submit" style={styles.submitButton}>Submit Review</button>
                  </div>
                </form>
              </motion.div>
            )}
            {reviews.length > 0 ? (
              <div style={styles.reviewsContainer}>
                {reviews.map((review) => (
                  <motion.div 
                    key={review.id} 
                    style={styles.reviewCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={styles.reviewHeader}>
                      <div style={styles.reviewerInfo}>
                        <div style={styles.avatar}>
                          {review.user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                          <div style={styles.reviewAuthor}>{review.user?.username || 'Anonymous'}</div>
                          <div style={styles.reviewDate}>
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            style={{
                              ...styles.starIcon,
                              color: i < review.rating ? "#ffc107" : "#ddd",
                              fontSize: "0.9rem"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p style={styles.reviewText}>{review.comment}</p>
                    <div style={styles.reviewFooter}>
                      <span style={styles.helpfulText}>Was this review helpful?</span>
                      <button style={styles.helpfulButton}>Yes</button>
                      <button style={styles.helpfulButton}>No</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={styles.noReviews}>
                <div style={styles.noReviewsIcon}>
                  <FaStar style={{ color: "#ddd", fontSize: "2.5rem" }} />
                </div>
                <h4>No reviews yet</h4>
                <p>Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
      {relatedSheets.length > 0 && (
        <div style={styles.relatedProducts}>
          <div style={styles.relatedHeader}>
            <h3 style={styles.relatedTitle}>Related EPE Sheets</h3>
            {relatedSheets.length > 4 && (
              <button
                onClick={toggleShowAllRelated}
                style={styles.toggleRelatedButton}
              >
                {showAllRelated ? "Show Less" : "Show More"}
                {showAllRelated ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}
          </div>
          <div style={styles.relatedGrid}>
            {displayedRelated.map(sheet => (
              <motion.div
                key={sheet.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                style={styles.relatedCard}
                onClick={() => navigate(`/epe-sheets/${sheet.id}`)}
              >
                <div style={styles.relatedSheetCard}>
                  <div style={styles.relatedImageContainer}>
                    <img 
                      src={sheet.image} 
                      alt={sheet.name} 
                      style={styles.relatedImage}
                      onError={e => { e.target.src = "/placeholder.png"; }}
                    />
                  </div>
                  <div style={styles.relatedInfo}>
                    <h4 style={styles.relatedName}>{sheet.name}</h4>
                    <div style={styles.relatedPrice}>₹{sheet.price}</div>
                    <div style={styles.specsSummary}>
                      {sheet.size && <span>{sheet.size}</span>}
                      {sheet.thickness && <span>{sheet.thickness}mm</span>}
                      {sheet.color && <span>{sheet.color}</span>}
                    </div>
                    <div style={sheet.stock > 0 ? styles.inStock : styles.outOfStock}>
                      {sheet.stock > 0 ? `${sheet.stock} units in stock` : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Order Success Modal */}
      {orderSuccess && orderData && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2 style={{ color: "#40916c" }}>Order Successful!</h2>
            <p>{orderSuccess}</p>
            <InvoiceGenerator order={orderData} />
            <button style={modalStyles.button} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      <AnimatePresence>
        {imageModalOpen && (
          <motion.div
            style={imageModalStyles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImageModalOpen(false)}
          >
            <motion.div
              style={imageModalStyles.content}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={imageModalStyles.closeButton}
                onClick={() => setImageModalOpen(false)}
              >
                <FaTimes />
              </button>
              <img
                src={sheet.image}
                alt={sheet.name}
                style={imageModalStyles.image}
                onError={e => { e.target.src = "/placeholder.png"; }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Image Modal styles
const imageModalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  content: {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 1001,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "90vh",
    objectFit: "contain",
  },
};

// Modal styles
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    background: "#fff",
    padding: "30px 25px 20px 25px",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    minWidth: "340px",
    maxWidth: "95vw",
    textAlign: "center"
  },
  button: {
    marginTop: "18px",
    background: "#40916c",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 24px",
    fontSize: "1rem",
    cursor: "pointer"
  }
};

// Order Form Styles
const orderFormStyles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: "500",
    fontSize: "0.95rem",
    color: "#333"
  },
  input: {
    padding: "12px 15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    transition: "all 0.2s",
    "&:focus": {
      borderColor: "#40916c",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(64, 145, 108, 0.2)"
    }
  },
  error: {
    color: "#e53e3e",
    fontSize: "0.85rem",
    marginTop: "4px"
  },
  submitButton: {
    backgroundColor: "#40916c",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:disabled": {
      backgroundColor: "#718096",
      cursor: "not-allowed"
    },
    "&:hover:not(:disabled)": {
      backgroundColor: "#2d6a4f",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }
  }
};

// Main Styles
const styles = {
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh"
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    border: "none",
    color: "#40916c",
    cursor: "pointer",
    fontSize: "1rem",
    marginBottom: "20px",
    padding: "8px 16px",
    borderRadius: "4px",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#edf2f7"
    }
  },
  productContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    marginBottom: "40px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gap: "20px"
    }
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  mainImageContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      minHeight: "300px",
      padding: "15px"
    }
  },
  mainProductImage: {
    maxWidth: "100%",
    maxHeight: "450px",
    objectFit: "contain",
    borderRadius: "8px",
    "@media (max-width: 768px)": {
      maxHeight: "300px",
      width: "100%",
      height: "auto"
    }
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  productHeader: {
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "15px"
  },
  productName: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "10px",
    fontWeight: 600,
    "@media (max-width: 768px)": {
      fontSize: "1.5rem"
    }
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "5px"
  },
  reviewCount: {
    fontSize: "0.9rem",
    color: "#666"
  },
  starIcon: {
    fontSize: "1rem"
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    margin: "10px 0"
  },
  price: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#2d6a4f",
    "@media (maxWidth: 768px)": {
      fontSize: "1.4rem"
    }
  },
  originalPrice: {
    fontSize: "1.1rem",
    color: "#999",
    textDecoration: "line-through"
  },
  discountBadge: {
    backgroundColor: "#e63946",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "bold"
  },
  metaInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
    margin: "15px 0",
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr"
    }
  },
  metaItem: {
    fontSize: "0.95rem",
    color: "#555",
    display: "flex",
    alignItems: "center"
  },
  shippingInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    padding: "20px",
    margin: "10px 0"
  },
  shippingItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    fontSize: "0.95rem",
    color: "#555"
  },
  shippingIcon: {
    color: "#40916c",
    fontSize: "1.3rem",
    minWidth: "24px"
  },
  orderFormContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0"
  },
  orderFormTitle: {
    fontSize: "1.3rem",
    marginBottom: "20px",
    color: "#333",
    fontWeight: 600
  },
  errorMessage: {
    backgroundColor: "#fff5f5",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #fed7d7"
  },
  tabsContainer: {
    display: "flex",
    borderBottom: "1px solid #ddd",
    marginBottom: "25px",
    flexWrap: "wrap"
  },
  tabButton: {
    padding: "15px 25px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#666",
    borderBottom: "3px solid transparent",
    transition: "all 0.2s",
    "&:hover": {
      color: "#40916c"
    },
    "@media (max-width: 480px)": {
      padding: "12px 15px",
      fontSize: "0.9rem"
    }
  },
  activeTab: {
    color: "#40916c",
    borderBottom: "3px solid #40916c"
  },
  tabContent: {
    marginBottom: "50px"
  },
  tabHeading: {
    fontSize: "1.4rem",
    color: "#333",
    marginBottom: "20px",
    fontWeight: 600,
    "@media (max-width: 480px)": {
      fontSize: "1.2rem"
    }
  },
  descriptionText: {
    lineHeight: "1.7",
    color: "#555",
    fontSize: "1.05rem"
  },
  specsTable: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden",
    "@media (max-width: 480px)": {
      fontSize: "0.9rem"
    }
  },
  specRow: {
    borderBottom: "1px solid #eee",
    "&:last-child": {
      borderBottom: "none"
    }
  },
  specName: {
    padding: "15px 20px",
    width: "30%",
    fontWeight: "500",
    color: "#333",
    backgroundColor: "#f1f5f9",
    "@media (max-width: 480px)": {
      padding: "12px 15px",
      width: "40%"
    }
  },
  specValue: {
    padding: "15px 20px",
    color: "#555",
    "@media (max-width: 480px)": {
      padding: "12px 15px"
    }
  },
  reviewsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px"
  },
  addReviewButton: {
    backgroundColor: "#40916c",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#2d6a4f"
    },
    "@media (max-width: 480px)": {
      padding: "8px 15px",
      fontSize: "0.9rem"
    }
  },
  reviewForm: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflow: "hidden",
    "@media (max-width: 480px)": {
      padding: "15px"
    }
  },
  ratingInput: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  starRating: {
    display: "flex",
    gap: "5px",
    marginTop: "5px"
  },
  commentInput: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  textarea: {
    width: "100%",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minHeight: "120px",
    resize: "vertical",
    fontSize: "1rem",
    lineHeight: 1.5,
    "&:focus": {
      borderColor: "#40916c",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(64, 145, 108, 0.2)"
    }
  },
  formButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "15px"
  },
  submitButton: {
    backgroundColor: "#40916c",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 500,
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#2d6a4f"
    }
  },
  reviewsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
    "@media (max-width: 480px)": {
      padding: "15px"
    }
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "15px"
  },
  reviewerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#40916c",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1rem"
  },
  reviewAuthor: {
    fontWeight: "600",
    color: "#333",
    marginBottom: "4px"
  },
  reviewDate: {
    fontSize: "0.85rem",
    color: "#888"
  },
  reviewRating: {
    display: "flex",
    gap: "3px"
  },
  reviewText: {
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "15px",
    fontSize: "1rem"
  },
  reviewFooter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem"
  },
  helpfulText: {
    color: "#666"
  },
  helpfulButton: {
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
    color: "#666",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  noReviews: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    color: "#666"
  },
  noReviewsIcon: {
    marginBottom: "15px"
  },
  relatedProducts: {
    marginTop: "50px",
    paddingTop: "30px",
    borderTop: "1px solid #e2e8f0"
  },
  relatedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "15px"
  },
  relatedTitle: {
    fontSize: "1.5rem",
    color: "#333",
    fontWeight: 600,
    "@media (max-width: 480px)": {
      fontSize: "1.3rem"
    }
  },
  toggleRelatedButton: {
    backgroundColor: "transparent",
    color: "#40916c",
    border: "1px solid #40916c",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#edf2f7"
    },
    "@media (max-width: 480px)": {
      padding: "6px 12px",
      fontSize: "0.9rem"
    }
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
      gap: "15px"
    }
  },
  relatedCard: {
    transition: "all 0.3s"
  },
  relatedSheetCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
    }
  },
  relatedImageContainer: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    "@media (max-width: 768px)": {
      height: "180px",
      padding: "15px"
    },
    "@media (max-width: 480px)": {
      height: "160px"
    }
  },
  relatedImage: {
    maxHeight: "160px",
    maxWidth: "100%",
    objectFit: "contain",
    "@media (max-width: 768px)": {
      maxHeight: "150px"
    },
    "@media (max-width: 480px)": {
      maxHeight: "140px"
    }
  },
  relatedInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 200px)",
    "@media (max-width: 768px)": {
      padding: "15px"
    }
  },
  relatedName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#2d3748",
    "@media (max-width: 768px)": {
      fontSize: "1rem"
    }
  },
  relatedPrice: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "rgba(56, 139, 111, 0.85)",
    marginBottom: "8px",
    "@media (max-width: 768px)": {
      fontSize: "1.1rem"
    }
  },
  specsSummary: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "10px",
    fontSize: "0.9rem",
    color: "#666",
    "> span": {
      backgroundColor: "#edf2f7",
      padding: "4px 8px",
      borderRadius: "4px"
    }
  },
  inStock: {
    backgroundColor: "#38a169",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    width: "fit-content"
  },
  outOfStock: {
    backgroundColor: "#e53e3e",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    width: "fit-content"
  },
  loading: {
    padding: "50px",
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  error: {
    padding: "50px",
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#e53e3e",
    backgroundColor: "#fff5f5",
    borderRadius: "12px",
    margin: "30px",
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "20px"
  },
  notFound: {
    padding: "50px",
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
    minHeight: "50vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};