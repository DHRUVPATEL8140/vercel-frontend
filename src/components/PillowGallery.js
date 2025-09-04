import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

export default function PillowGallery() {
  const navigate = useNavigate();
  const [pillows, setPillows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPillows, setFilteredPillows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState({  
    q: "",
    color: "all",
    minPrice: 0,
    maxPrice: 10000,
    sort: "featured"
  });
  
  const uniqueColors = [...new Set(pillows.map(pillow => 
    pillow.color.charAt(0).toUpperCase() + pillow.color.slice(1).toLowerCase()
  ))].sort();

  useEffect(() => {
    const fetchPillows = async () => {
      try {
        setLoading(true);
        const response = await api.get("pillows/");
        setPillows(response.data);
        setFilteredPillows(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch pillows:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPillows();
  }, []);

  useEffect(() => {
    let result = pillows;

    // Apply search filter
    if (filters.q) {
      result = result.filter(pillow =>
        pillow.name.toLowerCase().includes(filters.q.toLowerCase()) ||
        pillow.description.toLowerCase().includes(filters.q.toLowerCase())
      );
    }

    // Apply case-insensitive color filter
    if (filters.color !== "all") {
      result = result.filter(pillow =>
        pillow.color.toLowerCase() === filters.color.toLowerCase()
      );
    }

    // Apply price range filter
    result = result.filter(pillow =>
      pillow.price >= filters.minPrice && pillow.price <= filters.maxPrice
    );

    // Apply sorting
    switch(filters.sort) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      default:
        // Default sorting (featured) - no change
        break;
    }

    setFilteredPillows(result);
  }, [pillows, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      q: "",
      color: "all",
      minPrice: 0,
      maxPrice: 500,
      sort: "featured"
    });
  };

  if (loading) return (
    <div style={styles.loading}>
      <Spinner animation="border" role="status" />
      <p>Loading pillows...</p>
    </div>
  );

  if (error) return (
    <div style={styles.error}>
      <div className="alert alert-danger" role="alert">
        Error loading pillows: {error}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Premium Pillows Collection</h1>
        <p style={styles.subtitle}>Discover our range of comfortable, high-quality pillows</p>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleFilterChange}
            placeholder="Search pillows..."
            style={styles.searchInput}
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          style={styles.filterButton}
        >
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {showFilters && (
        <motion.div
          style={styles.filterPanel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Color</label>
            <select
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Colors</option>
              {uniqueColors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Price Range</label>
            <div style={styles.priceRange}>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                min="0"
                max="500"
                style={styles.priceInput}
              />
              <span style={styles.rangeSeparator}>-</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                min="0"
                max="500"
                style={styles.priceInput}
              />
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          <button onClick={resetFilters} style={styles.resetButton}>
            <FaTimes /> Reset Filters
          </button>
        </motion.div>
      )}

      {filteredPillows.length > 0 ? (
        <motion.div 
          style={styles.gallery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredPillows.map(pillow => (
            <motion.div
              key={pillow.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={styles.pillowCard}
              onClick={() => navigate(`/pillows/${pillow.id}`)}
            >
              <div style={styles.imageContainer}>
                <img
                  src={pillow.image}
                  alt={pillow.name}
                  style={styles.pillowImage}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div style={styles.pillowInfo}>
                <h3 style={styles.pillowName}>{pillow.name}</h3>
                <p style={styles.pillowDescription}>
                  {pillow.description.length > 100
                    ? `${pillow.description.substring(0, 100)}...`
                    : pillow.description}
                </p>
                <div style={styles.pillowMeta}>
                  <div style={styles.priceStock}>
                    <span style={styles.pillowPrice}>₹{pillow.price}</span>
                    <span style={pillow.stock > 0 ? styles.inStock : styles.outOfStock}>
                      {pillow.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div style={styles.pillowColor}>
                    <strong>Color:</strong> {pillow.color}
                  </div>
                </div>
                <button
                  style={styles.detailsButton}
                  onClick={() => navigate(`/pillows/${pillow.id}`)}
                  disabled={pillow.stock <= 0}
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div style={styles.noResults}>
          <p>No pillows found matching your criteria.</p>
          <button onClick={resetFilters} style={styles.resetButton}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "80vh"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px"
  },
  title: {
    fontSize: "2rem",
    color: "#2d3748",
    marginBottom: "10px"
  },
  subtitle: {
    fontSize: "1rem",
    color: "#718096"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "15px",
    flexWrap: "wrap"
  },
  searchBox: {
    flex: 1,
    position: "relative",
    minWidth: "250px"
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "12px",
    color: "#718096"
  },
  searchInput: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "1rem",
    transition: "all 0.2s",
    ":focus": {
      outline: "none",
      borderColor: "#40916c",
      boxShadow: "0 0 0 3px rgba(64, 145, 108, 0.2)"
    }
  },
  filterButton: {
    backgroundColor: "#f8f9fa",
    color: "#2d3748",
    border: "1px solid #e2e8f0",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    ":hover": {
      backgroundColor: "#e2e8f0"
    }
  },
  filterPanel: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
    overflow: "hidden"
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  filterLabel: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#4a5568"
  },
  priceRange: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  priceInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "0.9rem",
    ":focus": {
      outline: "none",
      borderColor: "#40916c"
    }
  },
  rangeSeparator: {
    color: "#718096"
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "0.9rem",
    backgroundColor: "white",
    ":focus": {
      outline: "none",
      borderColor: "#40916c"
    }
  },
  resetButton: {
    backgroundColor: "transparent",
    color: "#e53e3e",
    border: "1px solid #e53e3e",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.9rem",
    transition: "all 0.2s",
    alignSelf: "flex-end",
    ":hover": {
      backgroundColor: "#fff5f5"
    }
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "25px"
  },
  pillowCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
    ":hover": {
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
    }
  },
  imageContainer: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px"
  },
  pillowImage: {
    maxHeight: "160px",
    maxWidth: "100%",
    objectFit: "contain"
  },
  pillowInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 200px)"
  },
  pillowName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#2d3748"
  },
  pillowDescription: {
    color: "#718096",
    fontSize: "0.9rem",
    marginBottom: "15px",
    flexGrow: 1
  },
  pillowMeta: {
    marginBottom: "15px"
  },
  priceStock: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  pillowPrice: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "rgba(56, 139, 111, 0.85)"
  },
  inStock: {
    backgroundColor: "#38a169",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem"
  },
  outOfStock: {
    backgroundColor: "#e53e3e",
    color: "white",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem"
  },
  pillowColor: {
    color: "#718096",
    fontSize: "0.9rem"
  },
  detailsButton: {
    backgroundColor: "transparent",
    color: "#3182ce",
    border: "1px solid #3182ce",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s",
    width: "100%",
    ":hover": {
      backgroundColor: "#ebf8ff"
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed"
    }
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#4a5568"
  },
  error: {
    padding: "20px",
    backgroundColor: "#fff5f5",
    color: "#e53e3e",
    borderRadius: "8px",
    textAlign: "center",
    margin: "20px 0"
  },
  noResults: {
    padding: "40px",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    color: "#4a5568"
  }
};

// Media queries
const styleElement = document.createElement("style");
styleElement.textContent = `
  @media (max-width: 768px) {
    .filter-panel {
      grid-template-columns: 1fr;
    }
    .gallery {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
  
  @media (max-width: 480px) {
    .search-container {
      flex-direction: column;
    }
    .search-box {
      width: 100%;
    }
    .gallery {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(styleElement);