import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from './UserContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout: logoutFn } = useUser();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'products' | 'about' | null
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const dropdownTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
      if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logoutFn();
    navigate("/login");
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (menu) => {
    if (windowWidth <= 992) return;
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (windowWidth <= 992) return;
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const isPageActive = (path) => location.pathname === path;

  return (
    <div style={styles.navbarWrapper}>
      {/* Main Global Navigation Header */}
      <nav style={{
        ...styles.navbar,
        ...(isScrolled ? styles.navbarScrolled : styles.navbarDefault)
      }}>
        <div style={styles.navContainer}>
          {/* Brand/Corporate Identity */}
          <Link to="/" style={styles.brand} onClick={() => setIsMobileMenuOpen(false)}>
            <div style={styles.logoWrapper}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#ffffff" />
                <path d="M2 16L16 23L30 16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 23L16 30L30 23" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={styles.brandText}>Infinite <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.85)' }}>Pvt Ltd</span></span>
          </Link>

          {/* Desktop Core Links Layout */}
          {windowWidth > 992 && (
            <div style={styles.desktopMenu}>
              <Link to="/" style={isPageActive('/') ? styles.navLinkActive : styles.navLink}>Home</Link>
              
              {/* Dropdown: Products */}
              <div style={styles.dropdownContainer} onMouseEnter={() => handleMouseEnter('products')} onMouseLeave={handleMouseLeave}>
                <button style={{ ...styles.dropdownToggle, ...(activeDropdown === 'products' ? styles.dropdownToggleActive : {}) }} onClick={() => toggleDropdown('products')}>
                  Products
                  <span style={{ ...styles.arrowIcon, transform: activeDropdown === 'products' ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                </button>
                <div style={{ ...styles.dropdownMenu, opacity: activeDropdown === 'products' ? 1 : 0, visibility: activeDropdown === 'products' ? 'visible' : 'hidden', transform: activeDropdown === 'products' ? 'translateY(0)' : 'translateY(8px)' }}>
                  <Link to="/gallery" style={styles.dropdownItem}>Mattresses</Link>
                  <Link to="/pillow-gallery" style={styles.dropdownItem}>Premium Pillows</Link>
                  <Link to="/epe-sheets" style={styles.dropdownItem}>EPE Industrial Sheets</Link>
                </div>
              </div>

              {/* Dropdown: Corporate Metadata */}
              <div style={styles.dropdownContainer} onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                <button style={{ ...styles.dropdownToggle, ...(activeDropdown === 'about' ? styles.dropdownToggleActive : {}) }} onClick={() => toggleDropdown('about')}>
                  About
                  <span style={{ ...styles.arrowIcon, transform: activeDropdown === 'about' ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                </button>
                <div style={{ ...styles.dropdownMenu, opacity: activeDropdown === 'about' ? 1 : 0, visibility: activeDropdown === 'about' ? 'visible' : 'hidden', transform: activeDropdown === 'about' ? 'translateY(0)' : 'translateY(8px)' }}>
                  <Link to="/about" style={styles.dropdownItem}>Company Details</Link>
                  <Link to="/analytics" style={styles.dropdownItem}>Manufacturing & Sales Graph</Link>
                  <Link to="/admin" style={styles.dropdownItem}>Admin Dashboard</Link>
                </div>
              </div>

              <Link to="/recommend" style={isPageActive('/recommend') ? styles.navLinkActive : styles.navLink}>Recommendations</Link>
              <Link to="/visualizer" style={isPageActive('/visualizer') ? styles.navLinkActive : styles.navLink}>Visualizer</Link>
              <Link to="/size-finder" style={isPageActive('/size-finder') ? styles.navLinkActive : styles.navLink}>Size Finder</Link>
              <Link to="/delivery" style={isPageActive('/delivery') ? styles.navLinkActive : styles.navLink}>Delivery</Link>
            </div>
          )}

          {/* Action Account Utilities */}
          <div style={styles.accountActionsSection}>
            {windowWidth > 992 && (
              user ? (
                <div style={styles.userBadgeRow}>
                  <div style={styles.avatarMini}>{user?.username?.charAt(0).toUpperCase() || "U"}</div>
                  <span style={styles.userNameDisplay}>Hi, {user?.username || "User"}</span>
                  <button onClick={handleLogout} style={styles.desktopLogoutBtn}>Logout</button>
                </div>
              ) : (
                <Link to="/login" style={styles.desktopLoginBtn}>Sign In</Link>
              )
            )}

            {/* Mobile Sidebar Hamburger Trigger */}
            {windowWidth <= 992 && (
              <button style={styles.hamburgerButton} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Navigation">
                <div style={isMobileMenuOpen ? styles.hamburgerActiveLine1 : styles.hamburgerLine}></div>
                <div style={isMobileMenuOpen ? { opacity: 0 } : styles.hamburgerLine}></div>
                <div style={isMobileMenuOpen ? styles.hamburgerActiveLine2 : styles.hamburgerLine}></div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation overlay */}
      {windowWidth <= 992 && (
        <>
          <div style={{ ...styles.sidebarOverlay, opacity: isMobileMenuOpen ? 1 : 0, visibility: isMobileMenuOpen ? 'visible' : 'hidden' }} onClick={() => setIsMobileMenuOpen(false)} />
          <div style={{ ...styles.mobileSidebar, transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
            <div style={styles.sidebarContent}>
              <div style={styles.sidebarGroupTitle}>Main Navigation</div>
              <Link to="/" style={isPageActive('/') ? styles.sidebarLinkActive : styles.sidebarLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/recommend" style={isPageActive('/recommend') ? styles.sidebarLinkActive : styles.sidebarLink} onClick={() => setIsMobileMenuOpen(false)}>Recommendations</Link>
              <Link to="/visualizer" style={isPageActive('/visualizer') ? styles.sidebarLinkActive : styles.sidebarLink} onClick={() => setIsMobileMenuOpen(false)}>Visualizer</Link>
              <Link to="/size-finder" style={isPageActive('/size-finder') ? styles.sidebarLinkActive : styles.sidebarLink} onClick={() => setIsMobileMenuOpen(false)}>Size Finder</Link>
              <Link to="/delivery" style={isPageActive('/delivery') ? styles.sidebarLinkActive : styles.sidebarLink} onClick={() => setIsMobileMenuOpen(false)}>Delivery</Link>
              
              <div style={styles.sidebarGroupTitle}>Our Offerings</div>
              <Link to="/gallery" style={styles.sidebarSubLink} onClick={() => setIsMobileMenuOpen(false)}>Mattresses</Link>
              <Link to="/pillow-gallery" style={styles.sidebarSubLink} onClick={() => setIsMobileMenuOpen(false)}>Premium Pillows</Link>
              <Link to="/epe-sheets" style={styles.sidebarSubLink} onClick={() => setIsMobileMenuOpen(false)}>EPE Industrial Sheets</Link>

              <div style={styles.sidebarGroupTitle}>Company Info</div>
              <Link to="/about" style={styles.sidebarSubLink} onClick={() => setIsMobileMenuOpen(false)}>Company Details</Link>
              <Link to="/analytics" style={styles.sidebarSubLink} onClick={() => setIsMobileMenuOpen(false)}>Manufacturing & Sales Graph</Link>
              <Link to="/admin" style={styles.sidebarSubLink} onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>

              {/* Mobile Profile Account Footer Box */}
              <div style={styles.sidebarAccountFooter}>
                {user ? (
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Authenticated as: {user?.username}</div>
                    <button onClick={handleLogout} style={styles.mobileActionBtnDanger}>Terminate Session</button>
                  </div>
                ) : (
                  <Link to="/login" style={styles.mobileActionBtnPrimary} onClick={() => setIsMobileMenuOpen(false)}>Sign In to Account</Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick-Action Mobile Bottom Dock Utility */}
          <div style={styles.bottomTabDock}>
            <Link to="/" style={{ ...styles.dockItem, ...(isPageActive('/') ? styles.dockItemActive : {}) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              <span>Home</span>
            </Link>
            <Link to="/gallery" style={{ ...styles.dockItem, ...(isPageActive('/gallery') ? styles.dockItemActive : {}) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
              <span>Products</span>
            </Link>
            <Link to="/recommend" style={{ ...styles.dockItem, ...(isPageActive('/recommend') ? styles.dockItemActive : {}) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 7v5l3 3"/></svg>
              <span>Match</span>
            </Link>
            <Link to="/about" style={{ ...styles.dockItem, ...(isPageActive('/about') ? styles.dockItemActive : {}) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <span>About</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// Enterprise UI Architecture Token Layout System
const styles = {
  navbarWrapper: {
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  navbarDefault: {
    backgroundColor: '#1a5f4a',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    padding: '18px 32px',
  },
  navbarScrolled: {
    backgroundColor: '#154034',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    padding: '12px 32px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#f8fafc',
    letterSpacing: '-0.02em',
  },
  desktopMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  navLink: {
    color: '#f1f5f9',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.08)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    padding: '8px 14px',
    borderRadius: '6px',
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownToggle: {
    background: 'none',
    border: 'none',
    color: '#f1f5f9',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.15s ease',
  },
  dropdownToggleActive: {
    color: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  arrowIcon: {
    fontSize: '11px',
    color: '#d1d5db',
    transition: 'transform 0.2s ease',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: '220px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
    padding: '6px',
    marginTop: '4px',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  dropdownItem: {
    display: 'block',
    padding: '10px 12px',
    color: '#334155',
    textDecoration: 'none',
    fontSize: '13.5px',
    fontWeight: 500,
    borderRadius: '6px',
    transition: 'background 0.1s ease',
  },
  accountActionsSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatarMini: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
  userNameDisplay: {
    fontSize: '13.5px',
    fontWeight: 500,
    color: '#f8fafc',
  },
  desktopLoginBtn: {
    padding: '8px 16px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '13.5px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  desktopLogoutBtn: {
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    color: '#ef4444',
    border: '1px solid #fee2e2',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  hamburgerButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5px',
    width: '24px',
    height: '24px',
    padding: 0,
  },
  hamburgerLine: {
    width: '100%',
    height: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    transition: 'all 0.2s ease',
  },
  hamburgerActiveLine1: {
    width: '100%',
    height: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    transform: 'translateY(3.5px) rotate(45deg)',
    transition: 'all 0.2s ease',
  },
  hamburgerActiveLine2: {
    width: '100%',
    height: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '2px',
    transform: 'translateY(-3.5px) rotate(-45deg)',
    transition: 'all 0.2s ease',
  },
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    backdropFilter: 'blur(4px)',
    zIndex: 1001,
    transition: 'opacity 0.3s ease',
  },
  mobileSidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    maxWidth: '300px',
    backgroundColor: '#ffffff',
    zIndex: 1002,
    boxShadow: '-10px 0 30px -5px rgba(15, 23, 42, 0.1)',
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    overflowY: 'auto',
  },
  sidebarContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sidebarGroupTitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#94a3b8',
    letterSpacing: '0.05em',
    marginTop: '16px',
    marginBottom: '8px',
    paddingLeft: '8px',
  },
  sidebarLink: {
    display: 'block',
    padding: '10px 12px',
    color: '#334155',
    fontSize: '15px',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: '8px',
  },
  sidebarLinkActive: {
    display: 'block',
    padding: '10px 12px',
    color: '#2d6a4f',
    backgroundColor: '#effaf3',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '8px',
  },
  sidebarSubLink: {
    display: 'block',
    padding: '8px 12px 8px 20px',
    color: '#475569',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: '6px',
  },
  sidebarAccountFooter: {
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  mobileActionBtnPrimary: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    borderRadius: '8px',
    boxSizing: 'border-box',
  },
  mobileActionBtnDanger: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#fff1f2',
    color: '#e11d48',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  bottomTabDock: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    zIndex: 1000,
    boxShadow: '0 -4px 16px rgba(0,0,0,0.04)',
  },
  dockItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '10px',
    fontWeight: 500,
    width: '60px',
    transition: 'color 0.15s ease',
  },
  dockItemActive: {
    color: '#2d6a4f',
    fontWeight: 600,
  }
};