// // src/components/ProductCard.js
// import React from "react";
// import { Link } from "react-router-dom";

// export default function ProductCard({ product }) {
//   return (
//     <div className="product-card">
//       <img src={product.image ? product.image : "/placeholder.png"} alt={product.name} />
//       <h3>{product.name}</h3>
//       <p>Density: {product.density}</p>
//       <p>{product.size} • {product.color}</p>
//       <p>₹{product.price}</p>
//       <Link to={`/product/${product.id}`}>View</Link>
//     </div>
//   );
// }
// src/components/ProductCard.js
import React,{ useState }  from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaEye, FaStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.imageContainer}>
        <img 
          src={product.image || "/placeholder.png"} 
          alt={product.name} 
          style={styles.image}
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
        {isHovered && (
          <div style={styles.actionButtons}>
            <button style={styles.cartButton} onClick={() => {
              const token = localStorage.getItem('access_token');
              if(!token){
                window.location.href = '/login';
                return;
              }
              window.location.href = `/product/${product.id}`;
            }}>
              <FaShoppingCart />
            </button>
            <Link 
              to={`/product/${product.id}`} 
              style={styles.viewButton}
            >
              <FaEye />
            </Link>
          </div>
        )}
      </div>

      <div style={styles.badge}>
        {product.isNew && <span style={styles.newBadge}>New</span>}
        {product.discount > 0 && (
          <span style={styles.discountBadge}>-{product.discount}%</span>
        )}
      </div>

      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        
        <div style={styles.meta}>
          <span style={styles.metaItem}>
            <FaStar style={styles.starIcon} />
            {product.rating || '4.5'}
          </span>
          <span style={styles.metaItem}>Density: {product.density}</span>
        </div>

        <p style={styles.details}>
          {product.size} • {product.color}
        </p>

        <div style={styles.priceContainer}>
          {product.discount > 0 ? (
            <>
              <span style={styles.originalPrice}>₹{product.price}</span>
              <span style={styles.discountedPrice}>
                ₹{Math.round(product.price * (1 - product.discount/100))}
              </span>
            </>
          ) : (
            <span style={styles.price}>₹{product.price}</span>
          )}
        </div>

        <Link 
          to={`/product/${product.id}`} 
          style={styles.viewLink}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

// Styles
const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    position: 'relative',
    width: '100%',
    maxWidth: '300px',
    margin: '0 auto',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '100%', // Square aspect ratio
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  actionButtons: {
    position: 'absolute',
    bottom: '15px',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  cartButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2d6a4f',
      transform: 'scale(1.1)',
    },
  },
  viewButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: '#000',
      transform: 'scale(1.1)',
    },
  },
  badge: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    gap: '5px',
  },
  newBadge: {
    backgroundColor: '#40916c',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  discountBadge: {
    backgroundColor: '#e63946',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  content: {
    padding: '15px',
  },
  name: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '8px',
    fontSize: '0.8rem',
    color: '#666',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  starIcon: {
    color: '#ffc107',
    fontSize: '0.9rem',
  },
  details: {
    margin: '0 0 12px 0',
    fontSize: '0.9rem',
    color: '#666',
  },
  priceContainer: {
    marginBottom: '15px',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#40916c',
  },
  originalPrice: {
    fontSize: '0.9rem',
    color: '#999',
    textDecoration: 'line-through',
    marginRight: '8px',
  },
  discountedPrice: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#e63946',
  },
  viewLink: {
    display: 'block',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#40916c',
    padding: '8px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#40916c',
      color: 'white',
    },
  },
};