import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

export default function EPESheetsGallery() {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSheets, setFilteredSheets] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState({
    q: "",
    size: "all",
    thickness: "all",
    color: "all",
    minPrice: 0,
    maxPrice: 5000,
    sort: "featured"
  });
  
  // Extract unique values for filters
  const uniqueSizes = [...new Set(sheets.map(sheet => sheet.size))].filter(Boolean).sort();
  const uniqueThickness = [...new Set(sheets.map(sheet => sheet.thickness))].filter(Boolean).sort();
  const uniqueColors = [...new Set(sheets.map(sheet => 
    sheet.color ? sheet.color.charAt(0).toUpperCase() + sheet.color.slice(1).toLowerCase() : ""
  ))].filter(Boolean).sort();

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const response = await api.get("epe-sheets/");
        setSheets(response.data);
        setFilteredSheets(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch EPE sheets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  useEffect(() => {
    let result = sheets;

    // Apply search filter
    if (filters.q) {
      result = result.filter(sheet =>
        sheet.name.toLowerCase().includes(filters.q.toLowerCase()) ||
        sheet.description.toLowerCase().includes(filters.q.toLowerCase())
      );
    }

    // Apply size filter
    if (filters.size !== "all") {
      result = result.filter(sheet => sheet.size === filters.size);
    }

    // Apply thickness filter
    if (filters.thickness !== "all") {
      result = result.filter(sheet => sheet.thickness === filters.thickness);
    }

    // Apply case-insensitive color filter
    if (filters.color !== "all") {
      result = result.filter(sheet => 
        sheet.color && sheet.color.toLowerCase() === filters.color.toLowerCase()
      );
    }

    // Apply price range filter
    result = result.filter(sheet =>
      sheet.price >= filters.minPrice && sheet.price <= filters.maxPrice
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

    setFilteredSheets(result);
  }, [sheets, filters]);

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
      size: "all",
      thickness: "all",
      color: "all",
      minPrice: 0,
      maxPrice: 5000,
      sort: "featured"
    });
  };

  if (loading) return (
    <div style={styles.loading}>
      <Spinner animation="border" role="status" />
      <p>Loading EPE sheets...</p>
    </div>
  );

  if (error) return (
    <div style={styles.error}>
      <div className="alert alert-danger" role="alert">
        Error loading EPE sheets: {error}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>EPE Sheets Collection</h1>
        <p style={styles.subtitle}>Discover our range of high-quality EPE foam sheets</p>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleFilterChange}
            placeholder="Search EPE sheets..."
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
            <label style={styles.filterLabel}>Size</label>
            <select
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Sizes</option>
              {uniqueSizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Thickness</label>
            <select
              name="thickness"
              value={filters.thickness}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="all">All Thickness</option>
              {uniqueThickness.map((thickness, index) => (
                <option key={index} value={thickness}>
                  {thickness}
                </option>
              ))}
            </select>
          </div>

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
                max="5000"
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
                max="5000"
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

      {filteredSheets.length > 0 ? (
        <motion.div 
          style={styles.gallery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredSheets.map(sheet => (
            <motion.div
              key={sheet.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={styles.sheetCard}
              onClick={() => navigate(`/epe-sheets/${sheet.id}`)}
            >
              <div style={styles.imageContainer}>
                <img
                  src={sheet.image}
                  alt={sheet.name}
                  style={styles.sheetImage}
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>
              <div style={styles.sheetInfo}>
                <h3 style={styles.sheetName}>{sheet.name}</h3>
                <p style={styles.sheetDescription}>
                  {sheet.description.length > 100
                    ? `${sheet.description.substring(0, 100)}...`
                    : sheet.description}
                </p>
                <div style={styles.sheetMeta}>
                  <div style={styles.priceStock}>
                    <span style={styles.sheetPrice}>₹{sheet.price}</span>
                    <span style={sheet.stock > 0 ? styles.inStock : styles.outOfStock}>
                      {sheet.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div style={styles.specs}>
                    <div style={styles.specItem}>
                      <strong>Size:</strong> {sheet.size || "N/A"}
                    </div>
                    <div style={styles.specItem}>
                      <strong>Thickness:</strong> {sheet.thickness || "N/A"}
                    </div>
                    {sheet.color && (
                      <div style={styles.specItem}>
                        <strong>Color:</strong> {sheet.color}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  style={styles.detailsButton}
                  onClick={() => navigate(`/epe-sheets/${sheet.id}`)}
                  disabled={sheet.stock <= 0}
                >
                  View Specifications
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div style={styles.noResults}>
          <p>No EPE sheets found matching your criteria.</p>
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
  sheetCard: {
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
  sheetImage: {
    maxHeight: "160px",
    maxWidth: "100%",
    objectFit: "contain"
  },
  sheetInfo: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    height: "calc(100% - 200px)"
  },
  sheetName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#2d3748"
  },
  sheetDescription: {
    color: "#718096",
    fontSize: "0.9rem",
    marginBottom: "15px",
    flexGrow: 1
  },
  sheetMeta: {
    marginBottom: "15px"
  },
  specs: {
    marginBottom: "10px"
  },
  specItem: {
    marginBottom: "5px",
    fontSize: "0.9rem",
    color: "#4a5568"
  },
  priceStock: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  sheetPrice: {
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