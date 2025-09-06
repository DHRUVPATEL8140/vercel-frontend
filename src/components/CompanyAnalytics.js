// src/components/CompanyAnalytics.js
import React from "react";
import { 
  BiEnvelope, BiPhone, BiMap, BiTime, 
  BiLogoFacebook, BiLogoTwitter, BiLogoLinkedin, BiLogoInstagram 
} from "react-icons/bi";

export default function CompanyAnalytics() {
  const chartUrl = process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}company/analytics/chart/` 
    : `http://localhost:8000/api/company/analytics/chart/`;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Manufacturing & Sales Analytics</h1>
        <p style={styles.subtitle}>Comprehensive yearly performance overview</p>
      </header>
      
      <div style={styles.chartCard}>
        <div style={styles.chartHeader}>
          <span style={styles.chartTitle}>Annual Performance Metrics</span>
          <div style={styles.dataInfo}>
            <span style={styles.infoItem}>Updated: Today</span>
            <span style={styles.infoItem}>Source: Production Database</span>
          </div>
        </div>
        
        <div style={styles.chartContainer}>
          <img 
            src={chartUrl} 
            alt="Analytics Chart" 
            style={styles.chartImage} 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="300" viewBox="0 0 800 300"><rect width="100%" height="100%" fill="%23f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%236c757d">Chart Loading...</text></svg>'
            }}
          />
        </div>
        
        <div style={styles.chartFooter}>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>YTD Growth</span>
            <span style={styles.metricValue}>+12.4%</span>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Production Efficiency</span>
            <span style={styles.metricValue}>94.2%</span>
          </div>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Q4 Target</span>
            <span style={styles.metricValue}>$2.8M</span>
          </div>
        </div>
      </div>

      {/* Added Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerRow}>
            <div style={styles.footerColumn}>
              <h5 style={styles.footerHeading}>Infinite Pvt. Ltd.</h5>
              <p style={styles.footerParagraph}>
                Innovative foam solutions for packaging, insulation, and protection needs. 
                Quality manufacturing since 2022.
              </p>
              <div style={styles.socialIcons}>
                <a href="https://facebook.com" style={styles.socialIcon}><BiLogoFacebook /></a>
                <a href="https://twitter.com" style={styles.socialIcon}><BiLogoTwitter /></a>
                <a href="https://linkedin.com" style={styles.socialIcon}><BiLogoLinkedin /></a>
                <a href="https://instagram.com" style={styles.socialIcon}><BiLogoInstagram /></a>
              </div>
            </div>
            
            <div style={styles.footerColumn}>
              <h5 style={styles.footerHeading}>Quick Links</h5>
              <ul style={styles.footerList}>
                <li style={styles.listItem}><a href="/" style={styles.footerLink}>Home</a></li>
                <li style={styles.listItem}><a href="/about" style={styles.footerLink}>About Us</a></li>
                <li style={styles.listItem}><a href="/products" style={styles.footerLink}>Products</a></li>
                <li style={styles.listItem}><a href="/machinery" style={styles.footerLink}>Machinery</a></li>
                <li style={styles.listItem}><a href="/gallery" style={styles.footerLink}>Place Order</a></li>
              </ul>
            </div>
            
            <div style={styles.footerColumn}>
              <h5 style={styles.footerHeading}>Contact Us</h5>
              <div style={styles.contactInfo}>
                <p style={styles.contactItem}>
                  <BiMap style={styles.contactIcon} /> 
                  GIDC, Halol, Gujarat, India
                </p>
                <p style={styles.contactItem}>
                  <BiPhone style={styles.contactIcon} /> 
                  +91 9876543210
                </p>
                <p style={styles.contactItem}>
                  <BiEnvelope style={styles.contactIcon} /> 
                  info@epefoam.com
                </p>
                <p style={styles.contactItem}>
                  <BiTime style={styles.contactIcon} /> 
                  Mon-Sat: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>
          
          <hr style={styles.footerHr} />
          
          <div style={styles.footerRow}>
            <div style={styles.footerCopyright}>
              <p style={styles.copyrightText}>
                &copy; {new Date().getFullYear()} Infinite Pvt. Ltd. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "15px 15px",
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    display: "flex",
    flexDirection: "column",
    minHeight: "80vh",
  },
  header: {
    marginBottom: "32px",
    textAlign: "center",
    paddingBottom: "16px",
    borderBottom: "1px solid #eaeef5"
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: 600,
    color: "#1a2a3a",
    marginBottom: "4px",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    color: "#6c757d",
    fontSize: "1.1rem",
    fontWeight: 400,
    margin: 0
  },
  chartCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    border: "1px solid #f0f3f7",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    marginBottom: "32px",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #eaeef5"
  },
  chartTitle: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#2c3e50"
  },
  dataInfo: {
    display: "flex",
    gap: "24px"
  },
  infoItem: {
    fontSize: "0.85rem",
    color: "#6c757d",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  chartContainer: {
    padding: "20px 24px",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fcfdff"
  },
  chartImage: {
    width: "100%",
    height: "auto",
    maxHeight: "450px",
    objectFit: "contain",
    display: "block"
  },
  chartFooter: {
    display: "flex",
    justifyContent: "space-around",
    padding: "18px 24px",
    backgroundColor: "#f8f9fa",
    borderTop: "1px solid #eaeef5"
  },
  metric: {
    textAlign: "center"
  },
  metricLabel: {
    display: "block",
    fontSize: "0.9rem",
    color: "#6c757d",
    marginBottom: "6px"
  },
  metricValue: {
    display: "block",
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#2c3e50"
  },
  
  // Footer Styles
  footer: {
    backgroundColor: "#1a3a3a",
    background: "linear-gradient(135deg, #1a3a3a 0%, #0d1f1f 100%)",
    color: "#fff",
    padding: "20px 0 10px",
    marginTop: "auto",
  },
  footerContainer: {
    maxWidth: "1800px",
    margin: "0 auto",
    padding: "0 24px",
  },
  footerRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  footerColumn: {
    flex: "1",
    minWidth: "250px",
    marginBottom: "24px",
    padding: "0 15px",
  },
  footerHeading: {
    color: "#f8b400",
    fontSize: "1.25rem",
    marginBottom: "20px",
    fontWeight: 600,
  },
  footerParagraph: {
    color: "#e0e0e0",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: "12px",
  },
  footerLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "color 0.3s ease",
    display: "block",
    ":hover": {
      color: "#f8b400",
    }
  },
  contactInfo: {
    color: "#e0e0e0",
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "15px",
    fontSize: "0.95rem",
  },
  contactIcon: {
    marginRight: "10px",
    minWidth: "20px",
    color: "#4db6ac",
    fontSize: "1.2rem",
  },
  socialIcons: {
    display: "flex",
    gap: "15px",
    marginTop: "15px",
  },
  socialIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "1.3rem",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#f8b400",
      color: "#000",
      transform: "translateY(-3px)",
    }
  },
  footerHr: {
    borderColor: "rgba(255, 255, 255, 0.1)",
    margin: "20px 0",
  },
  footerCopyright: {
    textAlign: "center",
    width: "100%",
    padding: "10px 0",
  },
  copyrightText: {
    color: "#aaa",
    fontSize: "0.85rem",
    margin: 0,
  },
};