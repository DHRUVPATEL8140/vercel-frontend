import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import InvoiceGenerator from "./InvoiceGenerator";
import { FaArrowLeft, FaStar, FaChevronDown, FaChevronUp, FaShoppingCart, FaUser } from "react-icons/fa";
import { MdLocalShipping, MdAssignmentReturn } from "react-icons/md";
import { motion } from "framer-motion";

// Order Form Component
export function OrderForm({ pillow, onPlaceOrder, stock }) {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

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
    if (validateForm()) {
      const total_amount = Number(pillow.price) * quantity;
      onPlaceOrder({
        products: [pillow.id],
        total_amount,
        address,
        phone,
        quantity,
        product: pillow,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={orderFormStyles.form}>
      <div style={orderFormStyles.formGroup}>
        <label htmlFor="quantity" style={orderFormStyles.label}>Quantity:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button 
            type="button"
            style={orderFormStyles.quantityButton}
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={orderFormStyles.quantityInput}
          />
          <button 
            type="button"
            style={orderFormStyles.quantityButton}
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
        {errors.quantity && (
          <span style={orderFormStyles.error}>{errors.quantity}</span>
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
          ₹{Number(pillow.price) * quantity}
        </div>
      </div>

      <button 
        type="submit" 
        style={orderFormStyles.submitButton}
        disabled={stock <= 0}
      >
        <FaShoppingCart style={{ marginRight: "8px" }} />
        {stock > 0 ? "Place Order" : "Out of Stock"}
      </button>
    </form>
  );
}

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
    width: "100%",
    boxSizing: "border-box"
  },
  quantityButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold"
  },
  quantityInput: {
    width: "80px", 
    textAlign: "center",
    margin: "0 10px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem"
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
    width: "100%"
  }
};

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
  const [orderData, setOrderData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        setRelatedPillows(relatedResponse.data.results || relatedResponse.data);

        // Reviews - Fixed the API endpoint and error handling
        try {
          const reviewsResponse = await api.get(`reviews/?product_id=${id}`);
          setReviews(reviewsResponse.data.results || reviewsResponse.data || []);
        } catch (reviewErr) {
          console.error("Failed to fetch reviews:", reviewErr);
          setReviews([]);
        }
      } catch (err) {
        setError(err.message);
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
      
      // Update reviews list
      const updatedReview = {
        ...response.data,
        // Ensure user object has proper structure
        user: response.data.user || { username: 'You' },
        created_at: response.data.created_at || new Date().toISOString()
      };
      
      setReviews([updatedReview, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);

      // Update pillow rating information
      if (pillow) {
        const newReviewCount = (pillow.review_count || 0) + 1;
        const currentTotal = (pillow.average_rating || 0) * (pillow.review_count || 0);
        const newAverage = (currentTotal + newReview.rating) / newReviewCount;
        
        setPillow(prev => ({
          ...prev,
          review_count: newReviewCount,
          average_rating: newAverage
        }));
      }
    } catch (err) {
      console.error("Failed to add review:", err);
      alert("Failed to add review. Please try again.");
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

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        style={{
          fontSize: "16px",
          color: i < roundedRating ? "#ffc107" : "#ddd",
          marginRight: "2px"
        }}
      />
    ));
  };

  if (loading) return <div style={styles.loading}>Loading pillow details...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!pillow) return <div style={styles.notFound}>Pillow not found</div>;

  const isMobile = windowWidth < 768;
  const displayedRelated = showAllRelated ? relatedPillows : relatedPillows.slice(0, 4);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back to Pillows
      </button>

      <div style={isMobile ? styles.productContainerMobile : styles.productContainer}>
        <div style={isMobile ? styles.imageSectionMobile : styles.imageSection}>
          <motion.div
            style={isMobile ? styles.mainImageContainerMobile : styles.mainImageContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={mainImage}
              alt={pillow.name}
              style={isMobile ? styles.mainProductImageMobile : styles.mainProductImage}
              onError={e => { e.target.src = "/placeholder.png"; }}
            />
          </motion.div>
        </div>
        <div style={isMobile ? styles.detailsSectionMobile : styles.detailsSection}>
          <div style={styles.productHeader}>
            <h1 style={styles.productName}>{pillow.name}</h1>
            <div style={styles.ratingContainer}>
              {renderStars(pillow.average_rating || 0)}
              <span style={styles.reviewCount}>({pillow.review_count || 0} reviews)</span>
            </div>
          </div>
          <div style={styles.priceContainer}>
            <span style={styles.price}>₹{pillow.price}</span>
            <span style={styles.originalPrice}>₹{(pillow.price * 1.2).toFixed(2)}</span>
            <span style={styles.discountBadge}>20% OFF</span>
          </div>
          <div style={isMobile ? styles.metaInfoMobile : styles.metaInfo}>
            <div style={styles.metaItem}><strong>Color:</strong> {pillow.color}</div>
            <div style={styles.metaItem}><strong>Material:</strong> Premium foam</div>
            <div style={styles.metaItem}><strong>Size:</strong> Standard (20x20 inches)</div>
            <div style={styles.metaItem}>
              <strong>Availability:</strong>
              <span style={{
                color: pillow.stock > 0 ? "#38a169" : "#e53e3e",
                fontWeight: 500,
                marginLeft: 5
              }}>
                {pillow.stock > 0 ? "In Stock" : "Out of Stock"}
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
              pillow={pillow}
              onPlaceOrder={handlePlaceOrder}
              stock={pillow.stock}
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
            ...(activeTab === "specs" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("specs")}
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
            <h3 style={styles.tabHeading}>Pillow Description</h3>
            <p style={styles.descriptionText}>{pillow.description}</p>
          </div>
        )}
        {activeTab === "specs" && (
          <div>
            <h3 style={styles.tabHeading}>Technical Specifications</h3>
            <table style={styles.specsTable}>
              <tbody>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Material</td>
                  <td style={styles.specValue}>Premium memory foam</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Size</td>
                  <td style={styles.specValue}>Standard (20x20 inches)</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Color</td>
                  <td style={styles.specValue}>{pillow.color}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Weight</td>
                  <td style={styles.specValue}>2.5 lbs</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Dimensions</td>
                  <td style={styles.specValue}>20 x 20 x 5 inches</td>
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
            
            {/* Rating Summary */}
            <div style={styles.ratingSummary}>
              <div style={styles.overallRating}>
                <div style={styles.ratingNumber}>{(pillow.average_rating || 0).toFixed(1)}</div>
                <div style={styles.ratingStars}>
                  {renderStars(pillow.average_rating || 0)}
                </div>
                <div style={styles.totalReviews}>{pillow.review_count || 0} reviews</div>
              </div>
              
              <div style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (pillow.review_count || 0) > 0 ? (count / (pillow.review_count || 1)) * 100 : 0;
                  
                  return (
                    <div key={rating} style={styles.ratingBarContainer}>
                      <div style={styles.ratingLabel}>{rating} stars</div>
                      <div style={styles.ratingBar}>
                        <div 
                          style={{
                            ...styles.ratingFill,
                            width: `${percentage}%`
                          }}
                        ></div>
                      </div>
                      <div style={styles.ratingCount}>({count})</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {showReviewForm && (
              <div style={styles.reviewForm}>
                <h4>Write a Review</h4>
                <form onSubmit={handleAddReview}>
                  <div style={styles.ratingInput}>
                    <label>Rating:</label>
                    <div style={styles.starRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <React.Fragment key={star}>
                          <input
                            type="radio"
                            id={`star-${star}`}
                            name="rating"
                            value={star}
                            checked={newReview.rating === star}
                            onChange={() => setNewReview({ ...newReview, rating: star })}
                            style={styles.hiddenInput}
                          />
                          <label
                            htmlFor={`star-${star}`}
                            style={styles.starLabel}
                          >
                            <FaStar
                              style={{
                                fontSize: "24px",
                                color: star <= newReview.rating ? "#ffc107" : "#ddd",
                                cursor: "pointer"
                              }}
                            />
                          </label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={styles.commentInput}>
                    <label>Comment:</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this pillow..."
                      style={styles.textarea}
                      required
                      rows="5"
                    />
                  </div>
                  <div style={styles.formButtons}>
                    <button type="submit" style={styles.submitReviewButton}>Submit Review</button>
                  </div>
                </form>
              </div>
            )}
            
            <div style={styles.reviewsList}>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} style={styles.reviewCard}>
                    <div style={styles.reviewHeader}>
                      <div style={styles.reviewerInfo}>
                        <div style={styles.avatar}>
                          <FaUser />
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
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p style={styles.reviewText}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div style={styles.noReviews}>
                  <h4>No reviews yet</h4>
                  <p>Be the first to review this pillow!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {relatedPillows.length > 0 && (
        <div style={styles.relatedProducts}>
          <div style={styles.relatedHeader}>
            <h3 style={styles.relatedTitle}>You May Also Like</h3>
            {relatedPillows.length > 4 && (
              <button
                onClick={toggleShowAllRelated}
                style={styles.toggleRelatedButton}
              >
                {showAllRelated ? "Show Less" : "Show More"}
                {showAllRelated ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}
          </div>
          <div style={isMobile ? styles.relatedGridMobile : styles.relatedGrid}>
            {displayedRelated.map(pillow => (
              <motion.div
                key={pillow.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                style={styles.relatedCard}
                onClick={() => navigate(`/pillows/${pillow.id}`)}
              >
                <div style={styles.relatedPillowCard}>
                  <div style={styles.relatedImageContainer}>
                    <img 
                      src={pillow.image} 
                      alt={pillow.name} 
                      style={styles.relatedImage}
                    />
                  </div>
                  <div style={styles.relatedInfo}>
                    <h4 style={styles.relatedName}>{pillow.name}</h4>
                    <div style={styles.relatedPrice}>₹{pillow.price}</div>
                    <div style={pillow.stock > 0 ? styles.inStock : styles.outOfStock}>
                      {pillow.stock > 0 ? 'In Stock' : 'Out of Stock'}
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
    </div>
  );
}

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

const styles = {
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff"
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
    transition: "all 0.2s"
  },
  productContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    marginBottom: "40px"
  },
  productContainerMobile: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    marginBottom: "40px"
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  imageSectionMobile: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  mainImageContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  mainImageContainerMobile: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  mainProductImage: {
    maxWidth: "100%",
    maxHeight: "450px",
    objectFit: "contain",
    borderRadius: "8px"
  },
  mainProductImageMobile: {
    maxWidth: "100%",
    maxHeight: "350px",
    objectFit: "contain",
    borderRadius: "8px"
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  detailsSectionMobile: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  productHeader: {
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "15px"
  },
  productName: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "10px",
    fontWeight: 600
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
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    margin: "10px 0"
  },
  price: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    color: "#2d6a4f"
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
    margin: "15px 0"
  },
  metaInfoMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "15px",
    margin: "15px 0"
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
    fontSize: "1.3rem"
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
    flexWrap: "wrap",
    overflowX: "auto",
    whiteSpace: "nowrap"
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
    transition: "all 0.2s"
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
    fontWeight: 600
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
    overflow: "hidden"
  },
  specRow: {
    borderBottom: "1px solid #eee"
  },
  specName: {
    padding: "15px 20px",
    width: "30%",
    fontWeight: "500",
    color: "#333",
    backgroundColor: "#f1f5f9"
  },
  specValue: {
    padding: "15px 20px",
    color: "#555"
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
    transition: "all 0.2s"
  },
  ratingSummary: {
    display: "flex",
    gap: "40px",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px"
  },
  overallRating: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "120px"
  },
  ratingNumber: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333"
  },
  ratingStars: {
    display: "flex",
    gap: "2px",
    margin: "5px 0"
  },
  totalReviews: {
    fontSize: "0.9rem",
    color: "#666"
  },
  ratingBreakdown: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  ratingBarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  ratingLabel: {
    width: "70px",
    fontSize: "0.9rem",
    color: "#666"
  },
  ratingBar: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden"
  },
  ratingFill: {
    height: "100%",
    backgroundColor: "#ffc107",
    transition: "width 0.3s ease"
  },
  ratingCount: {
    width: "40px",
    fontSize: "0.9rem",
    color: "#666",
    textAlign: "right"
  },
  reviewForm: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  ratingInput: {
    marginBottom: "20px"
  },
  starRating: {
    display: "flex",
    gap: "5px",
    marginTop: "5px"
  },
  hiddenInput: {
    display: "none"
  },
  starLabel: {
    cursor: "pointer"
  },
  commentInput: {
    marginBottom: "20px"
  },
  textarea: {
    width: "100%",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minHeight: "120px",
    resize: "vertical",
    fontSize: "1rem",
    lineHeight: 1.5
  },
  formButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "15px"
  },
  submitReviewButton: {
    backgroundColor: "#40916c",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 500,
    transition: "all 0.2s"
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  reviewCard: {
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0"
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "10px"
  },
  reviewerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b"
  },
  reviewAuthor: {
    fontWeight: "600",
    color: "#333"
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
    fontSize: "1rem",
    margin: 0
  },
  noReviews: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#666",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px"
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
    fontWeight: 600
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
    transition: "all 0.2s"
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px"
  },
  relatedGridMobile: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px"
  },
  relatedCard: {
    transition: "all 0.3s"
  },
  relatedPillowCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s"
  },
  relatedImageContainer: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px"
  },
  relatedImage: {
    maxHeight: "160px",
    maxWidth: "100%",
    objectFit: "contain"
  },
  relatedInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 200px)"
  },
  relatedName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#2d3748"
  },
  relatedPrice: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "rgba(56, 139, 111, 0.85)",
    marginBottom: "8px"
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