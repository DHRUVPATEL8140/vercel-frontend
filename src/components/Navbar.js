import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../logo.svg';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("username"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Prevent scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsAboutDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen(!isAboutDropdownOpen);
  };

  const getNavbarPadding = () => {
    if (windowWidth < 480) return '0.6rem 1rem';
    if (windowWidth < 768) return '0.8rem 1.2rem';
    return '0.8rem 1.5rem';
  };

  const navbarStyle = {
    ...styles.navbar,
    padding: getNavbarPadding(),
    ...(isScrolled ? styles.navbarScrolled : {}),
  };

  return (
    <div style={styles.navbarContainer}>
      <nav style={navbarStyle}>
        <div style={styles.navContent}>
          <Link to="/" style={styles.brand}>
            <img
              src={logo}
              alt="Company Logo"
              style={{
                ...styles.logo,
                ...(isScrolled ? styles.logoScrolled : {}),
                height: windowWidth < 480 ? '25px' : isScrolled ? '30px' : '35px'
              }}
            />
            <span style={styles.brandText}>Infinite Pvt Ltd</span>
          </Link>

          {/* Only show hamburger when menu is closed */}
          {windowWidth <= 768 && !isMobileMenuOpen && (
            <button
              style={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div style={styles.menuIcon}>
                <span style={styles.menuIconLine}></span>
                <span style={styles.menuIconLine}></span>
                <span style={styles.menuIconLine}></span>
              </div>
            </button>
          )}

          {windowWidth > 768 && (
            <div style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>
                <span style={styles.navLinkText}>Home</span>
              </Link>

              <div
                style={styles.dropdown}
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
              >
                <button
                  style={styles.dropdownToggle}
                  onClick={toggleProductsDropdown}
                  aria-haspopup="true"
                  aria-expanded={isProductsDropdownOpen}
                >
                  <span style={styles.navLinkText}>Products</span>
                  <span style={{
                    ...styles.dropdownArrow,
                    transform: isProductsDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}>▾</span>
                </button>
                <div
                  style={{
                    ...styles.dropdownMenu,
                    opacity: isProductsDropdownOpen ? 1 : 0,
                    visibility: isProductsDropdownOpen ? 'visible' : 'hidden',
                    transform: isProductsDropdownOpen ? 'translateY(0)' : 'translateY(-10px)'
                  }}
                  aria-hidden={!isProductsDropdownOpen}
                >
                  <Link
                    to="/gallery"
                    style={styles.dropdownItem}
                    onClick={() => setIsProductsDropdownOpen(false)}
                    tabIndex={isProductsDropdownOpen ? 0 : -1}
                  >
                    <span style={styles.dropdownItemText}>Mattress</span>
                  </Link>
                  <Link
                    to="/pillow-gallery"
                    style={styles.dropdownItem}
                    onClick={() => setIsProductsDropdownOpen(false)}
                    tabIndex={isProductsDropdownOpen ? 0 : -1}
                  >
                    <span style={styles.dropdownItemText}>Pillows</span>
                  </Link>
                  <Link
                    to="/epe-sheets"
                    style={styles.dropdownItem}
                    onClick={() => setIsProductsDropdownOpen(false)}
                    tabIndex={isProductsDropdownOpen ? 0 : -1}
                  >
                    <span style={styles.dropdownItemText}>EPE Sheets</span>
                  </Link>
                </div>
              </div>

              <div
                style={styles.dropdown}
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                <button
                  style={styles.dropdownToggle}
                  onClick={toggleAboutDropdown}
                  aria-haspopup="true"
                  aria-expanded={isAboutDropdownOpen}
                >
                  <span style={styles.navLinkText}>About</span>
                  <span style={{
                    ...styles.dropdownArrow,
                    transform: isAboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}>▾</span>
                </button>
                <div
                  style={{
                    ...styles.dropdownMenu,
                    opacity: isAboutDropdownOpen ? 1 : 0,
                    visibility: isAboutDropdownOpen ? 'visible' : 'hidden',
                    transform: isAboutDropdownOpen ? 'translateY(0)' : 'translateY(-10px)'
                  }}
                  aria-hidden={!isAboutDropdownOpen}
                >
                  <Link
                    to="/about"
                    style={styles.dropdownItem}
                    onClick={() => setIsAboutDropdownOpen(false)}
                    tabIndex={isAboutDropdownOpen ? 0 : -1}
                  >
                    <span style={styles.dropdownItemText}>Company Details</span>
                  </Link>
                  <Link
                    to="/analytics"
                    style={styles.dropdownItem}
                    onClick={() => setIsAboutDropdownOpen(false)}
                    tabIndex={isAboutDropdownOpen ? 0 : -1}
                  >
                    <span style={styles.dropdownItemText}>Manufacturing & Sales Graph</span>
                  </Link>
                  <Link
                    to="/admin"
                    style={styles.dropdownItem}
                    onClick={() => setIsAboutDropdownOpen(false)}
                    tabIndex={isAboutDropdownOpen ? 0 : -1}
                  >
                    <span style={styles.dropdownItemText}>Dashboard</span>
                  </Link>
                </div>
              </div>

              {user ? (
                <div style={styles.userSection}>
                  <span style={styles.greeting}>Hi, {user}</span>
                  <button
                    onClick={logout}
                    style={styles.logoutButton}
                    aria-label="Logout"
                  >
                    <span style={styles.buttonText}>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={styles.loginLink}
                  aria-label="Login"
                >
                  <span style={styles.buttonText}>Login</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {windowWidth <= 768 && (
          <div style={{
            ...styles.mobileMenuOverlay,
            opacity: isMobileMenuOpen ? 1 : 0,
            visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          }} onClick={toggleMobileMenu} />
        )}

        {/* Mobile Menu Sidebar */}
        {windowWidth <= 768 && (
          <div
            style={{
              ...styles.mobileMenuSidebar,
              transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <div style={styles.mobileMenuHeader}>
              <div style={styles.mobileBrand}>
                <img
                  src={logo}
                  alt="Company Logo"
                  style={styles.mobileLogo}
                />
                <span style={styles.mobileBrandText}>Infinite Pvt Ltd</span>
              </div>
              <button
                style={styles.mobileCloseButton}
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            <div style={styles.mobileMenuContent}>
              <Link
                to="/"
                style={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={styles.mobileNavIcon}>🏠</span> Home
              </Link>

              <div style={styles.mobileDropdownGroup}>
                <div 
                  style={styles.mobileDropdownHeader}
                  onClick={toggleProductsDropdown}
                >
                  <span style={styles.mobileDropdownLabel}>
                    <span style={styles.mobileNavIcon}>📦</span> Products
                  </span>
                  <span style={{
                    ...styles.mobileDropdownArrow,
                    transform: isProductsDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}>▾</span>
                </div>
                <div style={{
                  ...styles.mobileDropdownItems,
                  maxHeight: isProductsDropdownOpen ? '200px' : '0',
                }}>
                  <Link
                    to="/gallery"
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mattress
                  </Link>
                  <Link
                    to="/pillow-gallery"
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pillows
                  </Link>
                  <Link
                    to="/epe-sheets"
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    EPE Sheets
                  </Link>
                </div>
              </div>

              <div style={styles.mobileDropdownGroup}>
                <div 
                  style={styles.mobileDropdownHeader}
                  onClick={toggleAboutDropdown}
                >
                  <span style={styles.mobileDropdownLabel}>
                    <span style={styles.mobileNavIcon}>ℹ️</span> About
                  </span>
                  <span style={{
                    ...styles.mobileDropdownArrow,
                    transform: isAboutDropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                  }}>▾</span>
                </div>
                <div style={{
                  ...styles.mobileDropdownItems,
                  maxHeight: isAboutDropdownOpen ? '250px' : '0',
                }}>
                  <Link
                    to="/about"
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Company Details
                  </Link>
                  <Link
                    to="/analytics"
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manufacturing & Sales Graph
                  </Link>
                  <Link
                    to="/admin"
                    style={styles.mobileDropdownItem}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>

              {user ? (
                <div style={styles.mobileUserSection}>
                  <div style={styles.mobileUserInfo}>
                    <span style={styles.mobileNavIcon}>👤</span>
                    <div>
                      <div style={styles.mobileUsername}>{user}</div>
                      <div style={styles.mobileStatus}>Online</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    style={styles.mobileLogoutButton}
                  >
                    <span style={styles.mobileNavIcon}>🚪</span> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  style={styles.mobileLoginLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span style={styles.mobileNavIcon}>🔑</span> Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

const styles = {
  navbarContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
  },
  navbar: {
    backgroundColor: '#40916c',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    padding: '0.8rem 1.5rem',
  },
  navbarScrolled: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    flexWrap: 'wrap',
  },
  brand: {
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'transform 0.3s ease',
    padding: '0.3rem 0',
  },
  logo: {
    width: 'auto',
    transition: 'all 0.3s ease',
  },
  logoScrolled: {},
  brandText: {
    fontSize: 'clamp(1rem, 2vw, 1.3rem)',
    whiteSpace: 'nowrap',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownToggle: {
    background: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0.3rem 0',
    transition: 'all 0.2s ease',
  },
  dropdownArrow: {
    transition: 'transform 0.3s ease',
    display: 'inline-block',
    fontSize: '0.7em',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    minWidth: '200px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 6px 18px rgba(0,0,0,.12)',
    padding: '6px 0',
    zIndex: 10,
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-8px)',
  },
  dropdownItem: {
    display: 'block',
    padding: '8px 14px',
    color: '#2d3748',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.3rem 0',
    transition: 'all 0.2s ease',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  greeting: {
    color: 'white',
    fontSize: '0.8rem',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '3px',
    padding: '0.3rem 0.6rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
  },
  loginLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: '#2d6a4f',
    padding: '0.4rem 0.8rem',
    borderRadius: '3px',
    transition: 'all 0.3s ease',
  },
  mobileMenuButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  menuIcon: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    width: '26px',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  menuIconLine: {
    height: '3px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
    transformOrigin: 'center',
  },
  
  // Mobile menu styles
  mobileMenuOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 998,
    transition: 'all 0.3s ease',
  },
  mobileMenuSidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '85%',
    maxWidth: '320px',
    backgroundColor: '#2d6a4f',
    zIndex: 999,
    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
    borderTopLeftRadius: '16px',
    borderBottomLeftRadius: '16px',
  },
  mobileMenuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  mobileBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  mobileLogo: {
    height: '35px',
    width: 'auto',
    filter: 'brightness(0) invert(1)',
  },
  mobileBrandText: {
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  mobileCloseButton: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.3rem 0.75rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  mobileMenuContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.9rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: '4px',
  },
  mobileNavIcon: {
    marginRight: '12px',
    fontSize: '1.2rem',
    width: '24px',
    textAlign: 'center',
  },
  mobileDropdownGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  mobileDropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 1rem',
    cursor: 'pointer',
  },
  mobileDropdownLabel: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
  },
  mobileDropdownArrow: {
    color: 'white',
    fontSize: '1.2rem',
    transition: 'transform 0.3s ease',
  },
  mobileDropdownItems: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    maxHeight: 0,
    transition: 'max-height 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
  },
  mobileDropdownItem: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.8rem 1rem 0.8rem 2.8rem',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  mobileUserSection: {
    marginTop: 'auto',
    padding: '1rem 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1rem',
    padding: '0.8rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
  },
  mobileUsername: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  mobileStatus: {
    color: '#a8dadc',
    fontSize: '0.8rem',
  },
  mobileLogoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.8rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },
  mobileLoginLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '0.9rem',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    marginTop: 'auto',
  },
};