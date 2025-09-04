import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import InvoiceGenerator from "./InvoiceGenerator";  
import { FaArrowLeft, FaStar, FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";
import { MdLocalShipping, MdAssignmentReturn } from "react-icons/md";
import { motion } from "framer-motion";

// Order Form Component
export function OrderForm({ product, onPlaceOrder, stock }) {
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
      const total_amount = Number(product.price) * quantity;
      onPlaceOrder({
        products: [product.id],
        total_amount,
        address,
        phone,
        quantity,
        product: product,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={orderFormStyles.form}>
      <div style={orderFormStyles.formGroup}>
        <label htmlFor="quantity" style={orderFormStyles.label}>Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          max={stock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          style={orderFormStyles.input}
        />
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
          ₹{Number(product.price) * quantity}
        </div>
      </div>

      <button type="submit" style={orderFormStyles.submitButton}>
        Place Order
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
    transition: "all 0.2s"
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
    marginTop: "10px"
  }
};

// Main ProductDetails Component
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productResponse = await api.get(`products/${id}/`);
        const productData = productResponse.data;
        setProduct(productData);

        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0]);
        } else if (productData.image) {
          setMainImage(productData.image);
        }

        // Related products
        const relatedResponse = await api.get(`products/`, {
          params: {
            category: productData.category,
            exclude: id,
            limit: 8
          }
        });
        setRelatedProducts(relatedResponse.data);

        // Reviews
        const reviewsResponse = await api.get(`reviews/product_reviews/?product_id=${id}`);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch product data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
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

      setProduct(prev => ({
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
  const handleThumbnailClick = (img, index) => {
    setMainImage(img);
    setThumbnailIndex(index);
  };

  const closeModal = () => {
    setOrderSuccess(null);
    setOrderData(null);
  };

  if (loading) return <div style={styles.loading}>Loading product details...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (!product) return <div style={styles.notFound}>Product not found</div>;

  const displayedRelated = showAllRelated ? relatedProducts : relatedProducts.slice(0, 4);

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back to Products
      </button>

      <div style={{...styles.productContainer, 
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: isMobile ? "20px" : "40px"
      }}>
        <div style={styles.imageSection}>
          <motion.div
            style={styles.mainImageContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={mainImage}
              alt={product.name}
              style={{...styles.mainProductImage, 
                maxHeight: isMobile ? "300px" : "450px"
              }}
              onError={e => { e.target.src = "/placeholder.png"; }}
            />
          </motion.div>
          {product.images && product.images.length > 1 && (
            <div style={styles.thumbnailContainer}>
              {product.images.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    ...styles.thumbnail,
                    border: index === thumbnailIndex ? "2px solid #40916c" : "1px solid #e2e8f0"
                  }}
                  onClick={() => handleThumbnailClick(img, index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} style={styles.thumbnailImage} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.detailsSection}>
          <div style={styles.productHeader}>
            <h1 style={styles.productName}>{product.name}</h1>
            <div style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  style={{
                    ...styles.starIcon,
                    color: i < Math.round(product.average_rating) ? "#ffc107" : "#ddd"
                  }}
                />
              ))}
              <span style={styles.reviewCount}>({product.review_count} reviews)</span>
            </div>
          </div>
          <div style={styles.priceContainer}>
            <span style={styles.price}>₹{product.price}</span>
            {product.original_price && (
              <span style={styles.originalPrice}>₹{product.original_price}</span>
            )}
            {product.discount > 0 && (
              <span style={styles.discountBadge}>{product.discount}% OFF</span>
            )}
          </div>
          <div style={{...styles.metaInfo, 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)"
          }}>
            <div style={styles.metaItem}><strong>Category:</strong> {product.category}</div>
            <div style={styles.metaItem}><strong>Size:</strong> {product.size}</div>
            <div style={styles.metaItem}><strong>Color:</strong> {product.color}</div>
            <div style={styles.metaItem}>
              <strong>Availability:</strong>
              <span style={{
                color: product.stock > 0 ? "#38a169" : "#e53e3e",
                fontWeight: 500,
                marginLeft: 5
              }}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
          <div style={styles.shippingInfo}>
            <div style={styles.shippingItem}>
              <MdLocalShipping style={styles.shippingIcon} />
              <span>Free shipping on orders over ₹500</span>
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
              product={product}
              onPlaceOrder={handlePlaceOrder}
              stock={product.stock}
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
            <h3 style={styles.tabHeading}>Product Description</h3>
            <p style={styles.descriptionText}>{product.description}</p>
          </div>
        )}
        {activeTab === "specs" && (
          <div>
            <h3 style={styles.tabHeading}>Technical Specifications</h3>
            <table style={styles.specsTable}>
              <tbody>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Material</td>
                  <td style={styles.specValue}>{product.material || 'N/A'}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Size</td>
                  <td style={styles.specValue}>{product.size}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Color</td>
                  <td style={styles.specValue}>{product.color}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Weight</td>
                  <td style={styles.specValue}>{product.weight || 'N/A'}</td>
                </tr>
                <tr style={styles.specRow}>
                  <td style={styles.specName}>Dimensions</td>
                  <td style={styles.specValue}>{product.dimensions || 'N/A'}</td>
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
                <h4 style={styles.reviewFormTitle}>Write a Review</h4>
                <form onSubmit={handleAddReview}>
                  <div style={styles.ratingInput}>
                    <label style={styles.formLabel}>Rating:</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      style={styles.select}
                    >
                      <option value="5">5 stars</option>
                      <option value="4">4 stars</option>
                      <option value="3">3 stars</option>
                      <option value="2">2 stars</option>
                      <option value="1">1 star</option>
                    </select>
                  </div>
                  <div style={styles.commentInput}>
                    <label style={styles.formLabel}>Comment:</label>
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
            
            <div style={styles.reviewStats}>
              <div style={styles.overallRating}>
                <span style={styles.ratingNumber}>{product.average_rating.toFixed(1)}</span>
                <div style={styles.ratingStars}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{
                        ...styles.starIcon,
                        color: i < Math.round(product.average_rating) ? "#ffc107" : "#ddd",
                        fontSize: "1.2rem"
                      }}
                    />
                  ))}
                </div>
                <span style={styles.totalReviews}>{product.review_count} reviews</span>
              </div>
              
              <div style={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => Math.round(r.rating) === rating).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  
                  return (
                    <div key={rating} style={styles.ratingBar}>
                      <span style={styles.ratingLabel}>{rating} stars</span>
                      <div style={styles.barContainer}>
                        <div 
                          style={{
                            ...styles.barFill,
                            width: `${percentage}%`
                          }} 
                        />
                      </div>
                      <span style={styles.ratingCount}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {reviews.length > 0 ? (
              <div style={styles.reviewsList}>
                {reviews.map((review) => (
                  <motion.div 
                    key={review.id} 
                    style={styles.reviewCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={styles.reviewHeader}>
                      <div style={styles.userInfo}>
                        <div style={styles.avatar}>
                          <FaUser style={styles.avatarIcon} />
                        </div>
                        <div>
                          <span style={styles.reviewAuthor}>{review.user?.username || 'Anonymous'}</span>
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
                      </div>
                      <span style={styles.reviewDate}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={styles.reviewText}>{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={styles.noReviews}>
                <h4 style={styles.noReviewsTitle}>No reviews yet</h4>
                <p style={styles.noReviewsText}>Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
      {relatedProducts.length > 0 && (
        <div style={styles.relatedProducts}>
          <div style={styles.relatedHeader}>
            <h3 style={styles.relatedTitle}>You May Also Like</h3>
            {relatedProducts.length > 4 && (
              <button
                onClick={toggleShowAllRelated}
                style={styles.toggleRelatedButton}
              >
                {showAllRelated ? "Show Less" : "Show More"}
                {showAllRelated ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}
          </div>
          <div style={{
            ...styles.relatedGrid,
            gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(150px, 1fr))" : "repeat(auto-fill, minmax(250px, 1fr))"
          }}>
            {displayedRelated.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                style={styles.relatedCard}
              >
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/products/${product.id}`)}
                />
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
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#f1f5f9"
    }
  },
  productContainer: {
    display: "grid",
    marginBottom: "40px"
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  mainProductImage: {
    maxWidth: "100%",
    objectFit: "contain",
    borderRadius: "8px"
  },
  thumbnailContainer: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    padding: "10px 0"
  },
  thumbnail: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    flexShrink: 0,
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "all 0.2s"
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
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
  successMessage: {
    backgroundColor: "#f0fff4",
    color: "#2d6a4f",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #c6f6d5"
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
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#2d6a4f"
    }
  },
  reviewForm: {
    backgroundColor: "#f8f9fa",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    overflow: "hidden"
  },
  reviewFormTitle: {
    marginBottom: "20px",
    color: "#333"
  },
  ratingInput: {
    marginBottom: "20px"
  },
  commentInput: {
    marginBottom: "20px"
  },
  formLabel: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#333"
  },
  select: {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    minWidth: "150px",
    backgroundColor: "white"
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
    fontFamily: "inherit"
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
  reviewStats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px"
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
    margin: "8px 0"
  },
  totalReviews: {
    fontSize: "0.9rem",
    color: "#666"
  },
  ratingBars: {
    flex: 1,
    minWidth: "250px"
  },
  ratingBar: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    gap: "10px"
  },
  ratingLabel: {
    width: "60px",
    fontSize: "0.9rem",
    color: "#666"
  },
  barContainer: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    backgroundColor: "#40916c",
    borderRadius: "4px",
    transition: "width 0.5s ease"
  },
  ratingCount: {
    width: "30px",
    fontSize: "0.9rem",
    color: "#666",
    textAlign: "right"
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#40916c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white"
  },
  avatarIcon: {
    fontSize: "1rem"
  },
  reviewAuthor: {
    fontWeight: "600",
    color: "#333",
    display: "block",
    marginBottom: "4px"
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
  reviewDate: {
    fontSize: "0.85rem",
    color: "#888",
    whiteSpace: "nowrap"
  },
  noReviews: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px"
  },
  noReviewsTitle: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "10px"
  },
  noReviewsText: {
    color: "#888",
    fontSize: "1rem"
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
    transition: "all 0.2s",
    "&:hover": {
      backgroundColor: "#f1f5f9"
    }
  },
  relatedGrid: {
    display: "grid",
    gap: "25px"
  },
  relatedCard: {
    transition: "all 0.3s"
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