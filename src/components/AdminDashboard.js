import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    inquiries: 0,
    pillows: 0,
    epeSheets: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [pillows, setPillows] = useState([]);
  const [epeSheets, setEpeSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [brokenImages, setBrokenImages] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    // Fields for different product types
    density: '',
    size: '',
    color: '',
  });
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (user && !user.is_staff) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setErrors({});
        
        // Fetch stats for overview
        const [productsRes, ordersRes, inquiriesRes, pillowsRes, epeSheetsRes] = await Promise.all([
          api.get('products/'),
          api.get('orders/'),
          api.get('inquiries/'),
          api.get('pillows/'),
          api.get('epe-sheets/')
        ]);
        
        setStats({
          products: productsRes.data.count || productsRes.data.length,
          orders: ordersRes.data.count || ordersRes.data.length,
          inquiries: inquiriesRes.data.count || inquiriesRes.data.length,
          pillows: pillowsRes.data.count || pillowsRes.data.length,
          epeSheets: epeSheetsRes.data.count || epeSheetsRes.data.length
        });

        // Fetch detailed data for tabs
        const detailedResults = await Promise.allSettled([
          api.get("orders/"),
          api.get("products/"),
          api.get("pillows/"),
          api.get("epe-sheets/")
        ]);

        if (detailedResults[0].status === "fulfilled") {
          setOrders(detailedResults[0].value.data);
        } else {
          setErrors(prev => ({...prev, orders: "Failed to load orders"}));
          console.error("Orders error:", detailedResults[0].reason);
        }

        if (detailedResults[1].status === "fulfilled") {
          setProducts(detailedResults[1].value.data);
        } else {
          setErrors(prev => ({...prev, products: "Failed to load products"}));
          console.error("Products error:", detailedResults[1].reason);
        }

        if (detailedResults[2].status === "fulfilled") {
          setPillows(detailedResults[2].value.data);
        } else {
          setErrors(prev => ({...prev, pillows: "Failed to load pillows"}));
          console.error("Pillows error:", detailedResults[2].reason);
        }

        if (detailedResults[3].status === "fulfilled") {
          setEpeSheets(detailedResults[3].value.data);
        } else {
          setErrors(prev => ({...prev, epeSheets: "Failed to load EPE sheets"}));
          console.error("EPE Sheets error:", detailedResults[3].reason);
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.is_staff) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Handle image loading errors
  const handleImageError = (id) => {
    setBrokenImages(prev => ({ ...prev, [id]: true }));
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`orders/${orderId}/`, { status: newStatus });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Function to handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setItemForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to save item changes
  const saveItemChanges = async () => {
    try {
      let endpoint = '';
      let data = { ...itemForm };
      
      // Determine endpoint and data based on item type
      if (itemType === 'product') {
        endpoint = `products/${editingItem.id}/`;
      } else if (itemType === 'pillow') {
        endpoint = `pillows/${editingItem.id}/`;
        // Remove fields not in Pillow model
        delete data.density;
        delete data.size;
      } else if (itemType === 'epeSheet') {
        endpoint = `epe-sheets/${editingItem.id}/`;
        // Remove fields not in EPESheet model
        delete data.density;
        delete data.color;
      }
      
      // Update existing item
      await api.put(endpoint, data);
      alert('Item updated successfully!');
      
      // Refresh data based on active tab
      if (activeTab === 'products') {
        const productsRes = await api.get('products/');
        setProducts(productsRes.data);
      } else if (activeTab === 'pillows') {
        const pillowsRes = await api.get('pillows/');
        setPillows(pillowsRes.data);
      } else if (activeTab === 'epeSheets') {
        const epeSheetsRes = await api.get('epe-sheets/');
        setEpeSheets(epeSheetsRes.data);
      }
      
      // Reset form and editing state
      setEditingItem(null);
      setItemType(null);
      setItemForm({
        name: '',
        price: '',
        stock: '',
        description: '',
        density: '',
        size: '',
        color: '',
      });
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  // Function to edit an item
  const editItem = (item, type) => {
    setEditingItem(item);
    setItemType(type);
    
    // Set form values based on item type
    const formData = {
      name: item.name || '',
      price: item.price || '',
      stock: item.stock || 0,
      description: item.description || '',
    };
    
    // Add type-specific fields
    if (type === 'product') {
      formData.density = item.density || '';
      formData.size = item.size || '';
      formData.color = item.color || '';
    } else if (type === 'pillow') {
      formData.color = item.color || '';
    } else if (type === 'epeSheet') {
      formData.size = item.size || '';
    }
    
    setItemForm(formData);
  };

  // Function to delete an item
  const deleteItem = async (itemId, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        let endpoint = '';
        
        if (type === 'product') {
          endpoint = `products/${itemId}/`;
        } else if (type === 'pillow') {
          endpoint = `pillows/${itemId}/`;
        } else if (type === 'epeSheet') {
          endpoint = `epe-sheets/${itemId}/`;
        }
        
        await api.delete(endpoint);
        alert('Item deleted successfully!');
        
        // Refresh data based on active tab
        if (activeTab === 'products') {
          const productsRes = await api.get('products/');
          setProducts(productsRes.data);
        } else if (activeTab === 'pillows') {
          const pillowsRes = await api.get('pillows/');
          setPillows(pillowsRes.data);
        } else if (activeTab === 'epeSheets') {
          const epeSheetsRes = await api.get('epe-sheets/');
          setEpeSheets(epeSheetsRes.data);
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  // Function to render product cards in a grid
  const renderProductGrid = (items, errorKey, sectionName, type) => {
    if (errors[errorKey]) {
      return (
        <div style={styles.errorCard}>
          <p>Error loading {sectionName}: {errors[errorKey]}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }
    
    return (
      <div style={styles.productGrid}>
        {items.length === 0 ? (
          <p style={styles.emptyMessage}>No {sectionName} found</p>
        ) : (
          items.map(item => (
            <div key={item.id} style={styles.productCard}>
              <div style={styles.productImagePlaceholder}>
                {item.image && !brokenImages[item.id] ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={styles.productImage}
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div style={styles.imagePlaceholder}>No Image</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <h4 style={styles.productName}>{item.name}</h4>
                <p style={styles.productPrice}>{formatCurrency(item.price)}</p>
                
                {/* Special fields for different product types */}
                {item.density && (
                  <p style={styles.productDetail}>Density: {item.density}</p>
                )}
                {item.size && (
                  <p style={styles.productDetail}>Size: {item.size}</p>
                )}
                {item.color && (
                  <p style={styles.productDetail}>Color: {item.color}</p>
                )}
                
                <p style={styles.productStock}>
                  Stock: {item.stock || 0}
                </p>
                
                <div style={styles.productActions}>
                  <button 
                    style={styles.editButton}
                    onClick={() => editItem(item, type)}
                  >
                    Edit
                  </button>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => deleteItem(item.id, type)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return <div style={styles.loading}>Loading dashboard data...</div>;
  }

  // Show access denied if not admin
  if (!user || !user.is_staff) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need administrator privileges to access this page.</p>
        <button 
          style={styles.actionButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.header}>Admin Dashboard</h1>
        <button 
          style={styles.homeButton}
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
      
      
      
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "overview" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "orders" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "products" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "pillows" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("pillows")}
        >
          Pillows
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "epeSheets" ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab("epeSheets")}
        >
          EPE Sheets
        </button>
      </div>

      {activeTab === "overview" ? (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Dashboard Overview</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h2>Products</h2>
              <p style={styles.statNumber}>{stats.products}</p>
            </div>
            
            <div style={styles.statCard}>
              <h2>Orders</h2>
              <p style={styles.statNumber}>{stats.orders}</p>
            </div>
            
            <div style={styles.statCard}>
              <h2>Inquiries</h2>
              <p style={styles.statNumber}>{stats.inquiries}</p>
            </div>
            
            <div style={styles.statCard}>
              <h2>Pillows</h2>
              <p style={styles.statNumber}>{stats.pillows}</p>
            </div>
            
            <div style={styles.statCard}>
              <h2>EPE Sheets</h2>
              <p style={styles.statNumber}>{stats.epeSheets}</p>
            </div>
          </div>
        </div>
      ) : activeTab === "orders" ? (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Recent Orders</h3>
          {errors.orders ? (
            <div style={styles.errorCard}>
              <p>Error loading orders: {errors.orders}</p>
              <button 
                style={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <p style={styles.emptyMessage}>No orders found</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeader}>Order ID</th>
                    <th style={styles.tableHeader}>Customer</th>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Amount</th>
                    <th style={styles.tableHeader}>Status</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={styles.tableRow}>
                      <td style={styles.tableCell}>#{order.id}</td>
                      <td style={styles.tableCell}>{order.user?.username || 'Guest'}</td>
                      <td style={styles.tableCell}>{formatDate(order.created_at)}</td>
                      <td style={styles.tableCell}>{formatCurrency(order.total_amount)}</td>
                      <td style={styles.tableCell}>
                        <span style={getStatusStyle(order.status)}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td style={styles.tableCell}>
                        <select 
                          value={order.status || ''} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === "products" ? (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Products Management</h3>
          
          {editingItem && itemType === 'product' && (
            <div style={styles.productForm}>
              <h4>Edit Product</h4>
              <div style={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={itemForm.name}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={itemForm.price}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formRow}>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity"
                  value={itemForm.stock}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="text"
                  name="density"
                  placeholder="Density"
                  value={itemForm.density}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formRow}>
                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={itemForm.size}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={itemForm.color}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <textarea
                name="description"
                placeholder="Product Description"
                value={itemForm.description}
                onChange={handleFormChange}
                style={styles.formTextarea}
              />
              <div style={styles.formActions}>
                <button 
                  style={styles.saveButton}
                  onClick={saveItemChanges}
                >
                  Update Product
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditingItem(null);
                    setItemType(null);
                    setItemForm({
                      name: '',
                      price: '',
                      stock: '',
                      description: '',
                      density: '',
                      size: '',
                      color: '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h4 style={styles.subHeader}>Existing Products</h4>
          {renderProductGrid(products, "products", "products", "product")}
        </div>
      ) : activeTab === "pillows" ? (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Pillows Management</h3>
          
          {editingItem && itemType === 'pillow' && (
            <div style={styles.productForm}>
              <h4>Edit Pillow</h4>
              <div style={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="Pillow Name"
                  value={itemForm.name}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={itemForm.price}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formRow}>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity"
                  value={itemForm.stock}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={itemForm.color}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <textarea
                name="description"
                placeholder="Pillow Description"
                value={itemForm.description}
                onChange={handleFormChange}
                style={styles.formTextarea}
              />
              <div style={styles.formActions}>
                <button 
                  style={styles.saveButton}
                  onClick={saveItemChanges}
                >
                  Update Pillow
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditingItem(null);
                    setItemType(null);
                    setItemForm({
                      name: '',
                      price: '',
                      stock: '',
                      description: '',
                      density: '',
                      size: '',
                      color: '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h4 style={styles.subHeader}>Existing Pillows</h4>
          {renderProductGrid(pillows, "pillows", "pillows", "pillow")}
        </div>
      ) : (
        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>EPE Sheets Management</h3>
          
          {editingItem && itemType === 'epeSheet' && (
            <div style={styles.productForm}>
              <h4>Edit EPE Sheet</h4>
              <div style={styles.formRow}>
                <input
                  type="text"
                  name="name"
                  placeholder="EPE Sheet Name"
                  value={itemForm.name}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={itemForm.price}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <div style={styles.formRow}>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock Quantity"
                  value={itemForm.stock}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={itemForm.size}
                  onChange={handleFormChange}
                  style={styles.formInput}
                />
              </div>
              <textarea
                name="description"
                placeholder="EPE Sheet Description"
                value={itemForm.description}
                onChange={handleFormChange}
                style={styles.formTextarea}
              />
              <div style={styles.formActions}>
                <button 
                  style={styles.saveButton}
                  onClick={saveItemChanges}
                >
                  Update EPE Sheet
                </button>
                <button 
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditingItem(null);
                    setItemType(null);
                    setItemForm({
                      name: '',
                      price: '',
                      stock: '',
                      description: '',
                      density: '',
                      size: '',
                      color: '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <h4 style={styles.subHeader}>Existing EPE Sheets</h4>
          {renderProductGrid(epeSheets, "epeSheets", "EPE sheets", "epeSheet")}
        </div>
      )}
    </div>
  );
};

// Helper function for status styling
function getStatusStyle(status) {
  const baseStyle = {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
    textTransform: 'capitalize'
  };

  switch (status?.toLowerCase()) {
    case 'delivered':
      return {
        ...baseStyle,
        backgroundColor: '#e6f7e6',
        color: '#2e7d32'
      };
    case 'shipped':
      return {
        ...baseStyle,
        backgroundColor: '#e3f2fd',
        color: '#1565c0'
      };
    case 'cancelled':
      return {
        ...baseStyle,
        backgroundColor: '#ffebee',
        color: '#c62828'
      };
    case 'confirmed':
      return {
        ...baseStyle,
        backgroundColor: '#fff3e0',
        color: '#e65100'
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#f5f5f5',
        color: '#757575'
      };
  }
}

// Styles remain the same as in your original code
const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1600px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7f9',
    minHeight: '100vh'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  header: {
    color: '#2d3748',
    margin: 0,
    borderBottom: '2px solid #40916c',
    paddingBottom: '0.5rem'
  },
  homeButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-start',
    marginBottom: '2rem',
  },
  actionButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  },
  tabs: {
    display: 'flex',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  tabButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#4a5568',
    transition: 'all 0.2s',
    borderBottom: '3px solid transparent'
  },
  activeTab: {
    color: '#40916c',
    borderBottom: '3px solid #40916c',
    backgroundColor: '#f0fff4'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  },
  sectionHeader: {
    color: '#2d3748',
    marginBottom: '1.5rem',
    fontSize: '1.25rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0.5rem'
  },
  subHeader: {
    color: '#2d3748',
    margin: '2rem 0 1rem 0',
    fontSize: '1.1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    margin: '2rem 0',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    borderLeft: '4px solid #40916c',
    transition: 'transform 0.2s'
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#40916c',
    margin: '0.5rem 0 0 0',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  tableHeaderRow: {
    backgroundColor: '#f7fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  tableHeader: {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#4a5568',
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s'
  },
  tableCell: {
    padding: '12px 16px',
    color: '#4a5568',
    fontSize: '0.875rem',
    verticalAlign: 'middle'
  },
  statusSelect: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    fontSize: '0.875rem'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  productCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s',
    backgroundColor: 'white'
  },
  productImagePlaceholder: {
    height: '160px',
    backgroundColor: '#f7fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #e2e8f0'
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    color: '#a0aec0',
    fontSize: '0.875rem'
  },
  productInfo: {
    padding: '1rem'
  },
  productName: {
    margin: '0 0 0.5rem 0',
    color: '#2d3748',
    fontSize: '1rem',
    fontWeight: '600'
  },
  productPrice: {
    margin: '0 0 0.25rem 0',
    color: '#40916c',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  productDetail: {
    margin: '0 0 0.25rem 0',
    color: '#4a5568',
    fontSize: '0.9rem'
  },
  productStock: {
    margin: '0.5rem 0 0 0',
    color: '#718096',
    fontSize: '0.875rem'
  },
  productActions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  editButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  deleteButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  productForm: {
    backgroundColor: '#f7fafc',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0'
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  },
  formInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  formTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e0',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    marginBottom: '1rem',
    resize: 'vertical'
  },
  formActions: {
    display: 'flex',
    gap: '1rem'
  },
  saveButton: {
    backgroundColor: '#40916c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#a0aec0',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600'
  },
  emptyMessage: {
    color: '#718096',
    textAlign: 'center',
    padding: '2rem'
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#4a5568'
  },
  errorCard: {
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '1rem 0',
    border: '1px solid #fc8181'
  },
  retryButton: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s'
  }
};

export default AdminDashboard;