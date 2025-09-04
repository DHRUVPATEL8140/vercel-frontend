import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";
import { Spinner } from "react-bootstrap";

export default function ProductGallery() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState({
    q: "",
    color: "all",
    size: "all",
    minPrice: 0,
    maxPrice: 0, // Will be set dynamically
    sort: "featured"
  });
  
  // Calculate unique colors with proper formatting
  const uniqueColors = [...new Set(products.map(product => 
    product.color ? product.color.charAt(0).toUpperCase() + product.color.slice(1).toLowerCase() : ""
  ))].filter(Boolean).sort();

  const uniqueSizes = [...new Set(products.map(product => product.size))].filter(Boolean).sort();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("products/");
        const productsData = response.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Calculate max price from products
        const maxPrice = productsData.length > 0 
          ? Math.ceil(Math.max(...productsData.map(p => p.price)) * 1.1) // Add 10% buffer
          : 10000;
        
        setFilters(prev => ({
          ...prev,
          maxPrice
        }));
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Apply search filter
    if (filters.q) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(filters.q.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.q.toLowerCase()) ||
        (product.density && product.density.toString().includes(filters.q)))
    }

    // Apply color filter
    if (filters.color !== "all") {
      result = result.filter(product =>
        product.color && product.color.toLowerCase() === filters.color.toLowerCase()
      );
    }

    // Apply size filter
    if (filters.size !== "all") {
      result = result.filter(product => product.size === filters.size);
    }

    // Apply price range filter
    result = result.filter(product =>
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply sorting
    switch(filters.sort) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "density-low":
        result = [...result].sort((a, b) => a.density - b.density);
        break;
      case "density-high":
        result = [...result].sort((a, b) => b.density - a.density);
        break;
      case "rating-high":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default sorting (featured) - no change
        break;
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    // Calculate max price from products for reset
    const maxPrice = products.length > 0 
      ? Math.ceil(Math.max(...products.map(p => p.price)) * 1.1)
      : 10000;
    
    setFilters({
      q: "",
      color: "all",
      size: "all",
      minPrice: 0,
      maxPrice,
      sort: "featured"
    });
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return (
    <div style={styles.loading}>
      <Spinner animation="border" role="status" />
      <p>Loading products...</p>
    </div>
  );

  if (error) return (
    <div style={styles.error}>
      <div className="alert alert-danger" role="alert">
        Error loading products: {error}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Premium Products Collection</h1>
        <p style={styles.subtitle}>Discover our range of comfortable, high-quality products</p>
      </div>

      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={handleFilterChange}
            placeholder="Search by name, description or density..."
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
            <label style={styles.filterLabel}>Price Range</label>
            <div style={styles.priceRange}>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                min="0"
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
              <option value="density-low">Density: Low to High</option>
              <option value="density-high">Density: High to Low</option>
              <option value="rating-high">Highest Rated</option>
            </select>
          </div>

          <button onClick={resetFilters} style={styles.resetButton}>
            <FaTimes /> Reset Filters
          </button>
        </motion.div>
      )}

      {filteredProducts.length > 0 ? (
        <motion.div 
          style={styles.gallery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard 
                product={product} 
                onClick={() => handleProductClick(product.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div style={styles.noResults}>
          <p>No products found matching your criteria.</p>
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
    color: "#4a5568",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px"
  }
};