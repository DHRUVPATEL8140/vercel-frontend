// src/components/CompanyInfoPage.js
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Container, Row, Col, Card, Accordion, 
  Badge, Spinner, Alert 
} from "react-bootstrap";
import { 
  FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCalendarAlt, FaShieldAlt, FaFileContract, 
  FaTruck, FaUsers, FaFlag, FaGlobeAmericas,
  FaIndustry, FaChartLine, FaHandshake, FaAward
} from "react-icons/fa";
// Removed date-fns import - using native JavaScript date formatting
import { 
  BiLogoFacebook, BiLogoTwitter, BiLogoLinkedin, BiLogoInstagram 
} from "react-icons/bi";

export default function CompanyInfoPage() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await api.get("company/single/");
        setCompanyData(res.data);
      } catch (err) {
        setError(err.message || "Failed to load company information");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  if (loading) return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5 min-vh-50">
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3 text-muted">Loading company profile...</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger" className="shadow-sm">
        <Alert.Heading>Data Loading Error</Alert.Heading>
        <p>We encountered an issue loading company information: <strong>{error}</strong></p>
        <p className="mb-0">Please try refreshing the page or contact support.</p>
      </Alert>
    </Container>
  );

  if (!companyData) return (
    <Container className="py-5 text-center">
      <Alert variant="warning" className="shadow-sm">
        <FaBuilding className="me-2" />
        Company profile not found or unavailable
      </Alert>
    </Container>
  );

  // Destructure data for cleaner access
  const {
    name,
    founded_year,
    description,
    mission,
    contact_email,
    contact_phone,
    address,
    employee_count,
    updated_at,
    privacy_policy,
    terms_of_service,
    return_policy,
    industry,
    certifications,
    values = []
  } = companyData;

  return (
    <div className="company-info-page">
      <Container className="py-5" style={{ maxWidth: "1600px" }}>
        {/* Company Header with Badges */}
        <Row className="mb-4 align-items-end">
          <Col md={8}>
            <div className="d-flex align-items-center mb-2">
              <FaBuilding className="text-primary me-2" size={28} />
              <h1 className="display-5 fw-bold text-dark mb-0">{name}</h1>
            </div>
            
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Badge pill bg="light" text="dark" className="border">
                <FaIndustry className="me-1" />
                {industry || "Manufacturing"}
              </Badge>
              {founded_year && (
                <Badge pill bg="light" text="dark" className="border">
                  <FaCalendarAlt className="me-1" />
                  Est. {founded_year}
                </Badge>
              )}
              {employee_count && (
                <Badge pill bg="light" text="dark" className="border">
                  <FaUsers className="me-1" />
                  {employee_count}+ Employees
                </Badge>
              )}
              {certifications?.length > 0 && (
                <Badge pill bg="light" text="dark" className="border">
                  <FaAward className="me-1" />
                  {certifications.length} Certifications
                </Badge>
              )}
            </div>
          </Col>
          <Col md={4} className="text-md-end">
            <p className="text-muted mb-0">
              Last updated: {updated_at ? new Date(updated_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </p>
          </Col>
        </Row>

        {/* Mission & Description Section */}
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaFlag className="text-primary me-2 fs-4" />
                  <h3 className="h4 mb-0 text-dark">Our Mission</h3>
                </div>
                <p className="lead mb-0 text-dark" style={{ lineHeight: 1.7 }}>
                  {mission || "To deliver premium foam solutions through innovation, quality craftsmanship, and exceptional customer service."}
                </p>
              </Card.Body>
            </Card>

            {description && (
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="h4 mb-3 text-dark">About Us</h3>
                  <p className="text-dark" style={{ lineHeight: 1.8 }}>
                    {description}
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
          
          {/* Core Values */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaHandshake className="text-primary me-2 fs-4" />
                  <h3 className="h4 mb-0 text-dark">Core Values</h3>
                </div>
                
                <ul className="list-unstyled mb-0">
                  {(values.length > 0 ? values : [
                    "Quality Excellence",
                    "Customer Centricity",
                    "Innovation & Creativity",
                    "Environmental Responsibility",
                    "Team Collaboration"
                  ]).map((value, index) => (
                    <li key={index} className="d-flex mb-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill me-2">
                        {index + 1}
                      </span>
                      <span className="text-dark">{value}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats & Contact Section */}
        <Row className="mb-5 g-4">
          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FaCalendarAlt className="text-primary fs-2" />
                </div>
                <h3 className="h5 mb-1 text-dark">Years of Experience</h3>
                <p className="display-6 fw-bold mb-0 text-primary">
                  {founded_year ? new Date().getFullYear() - founded_year : '5+'}
                </p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <FaChartLine className="text-primary fs-2" />
                </div>
                <h3 className="h5 mb-1 text-dark">Annual Production</h3>
                <p className="display-6 fw-bold mb-0 text-primary">
                  {employee_count ? (employee_count * 250).toLocaleString() : '1,00,000+'}
                </p>
                <p className="mb-0 text-muted">Foam Units</p>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={12} lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-primary me-2 fs-4" />
                  <h3 className="h4 mb-0 text-dark">Contact Information</h3>
                </div>
                
                <Row>
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <FaMapMarkerAlt className="text-primary mt-1 me-2" />
                      <div>
                        <h4 className="h6 mb-1 text-dark">Headquarters</h4>
                        <p className="mb-0 text-dark">
                          {address || "123 Industrial Park, Manufacturing City, MC 12345"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-start mb-3">
                      <FaPhone className="text-primary mt-1 me-2" />
                      <div>
                        <h4 className="h6 mb-1 text-dark">Phone</h4>
                        <p className="mb-0 text-dark">
                          {contact_phone || "+1 (800) 123-4567"}
                        </p>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-3">
                      <FaEnvelope className="text-primary mt-1 me-2" />
                      <div>
                        <h4 className="h6 mb-1 text-dark">Email</h4>
                        <p className="mb-0">
                          <a href={`mailto:${contact_email || 'info@company.com'}`} className="text-decoration-none text-primary">
                            {contact_email || "info@company.com"}
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-start">
                      <FaGlobeAmericas className="text-primary mt-1 me-2" />
                      <div>
                        <h4 className="h6 mb-1 text-dark">Business Hours</h4>
                        <p className="mb-0 text-dark">
                          Mon-Fri: 8:00 AM - 6:00 PM<br />
                          Sat: 9:00 AM - 1:00 PM<br />
                          Sun: Closed
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Policies Section */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex align-items-center mb-4">
              <FaShieldAlt className="text-primary me-2 fs-3" />
              <h3 className="h2 mb-0 text-dark">Company Policies</h3>
            </div>
            
            <Accordion flush>
              <Accordion.Item eventKey="0" className="mb-3 border-0 shadow-sm">
                <Accordion.Header className="p-3 bg-light">
                  <FaFileContract className="text-primary me-3" />
                  <span className="fw-medium">Terms of Service</span>
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <div className="prose">
                    {terms_of_service || (
                      <p className="text-dark">
                        By accessing and using our services, you agree to comply with our terms. 
                        All intellectual property rights remain with {name}. We reserve the right to modify 
                        these terms at any time. Orders are subject to product availability. 
                        Prices are subject to change without notice.
                      </p>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="1" className="mb-3 border-0 shadow-sm">
                <Accordion.Header className="p-3 bg-light">
                  <FaShieldAlt className="text-primary me-3" />
                  <span className="fw-medium">Privacy Policy</span>
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <div className="prose">
                    {privacy_policy || (
                      <p className="text-dark">
                        We are committed to protecting your personal information. 
                        We collect data to process orders, improve services, and communicate with you. 
                        We implement security measures to protect your data and never sell it to third parties. 
                        You may request access to or deletion of your personal data at any time.
                      </p>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              
              <Accordion.Item eventKey="2" className="border-0 shadow-sm">
                <Accordion.Header className="p-3 bg-light">
                  <FaTruck className="text-primary me-3" />
                  <span className="fw-medium">Shipping & Returns</span>
                </Accordion.Header>
                <Accordion.Body className="p-4">
                  <div className="prose">
                    {return_policy || (
                      <>
                        <p className="text-dark">
                          <strong>Shipping:</strong> Orders ship within 1-3 business days. 
                          Delivery times vary by location. Custom products may require additional 
                          production time.
                        </p>
                        <p className="text-dark mb-0">
                          <strong>Returns:</strong> We accept returns within 30 days of delivery. 
                          Products must be in original condition. Custom or special-order items 
                          are non-returnable. Contact us for a return authorization.
                        </p>
                      </>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>

        {/* Location Map */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm overflow-hidden">
              <Card.Body className="p-0">
                <Row className="g-0">
                  <Col lg={6} className="order-lg-1">
                    <div className="p-4 h-100">
                      <div className="d-flex align-items-center mb-3">
                        <FaMapMarkerAlt className="text-primary me-2 fs-3" />
                        <h3 className="h2 mb-0 text-dark">Our Facility</h3>
                      </div>
                      <p className="text-dark mb-4">
                        Visit our state-of-the-art manufacturing facility to see our 
                        production process firsthand. Schedule a tour to meet our team 
                        and discuss your custom foam requirements.
                      </p>
                      
                      <div className="bg-light p-3 rounded">
                        <h4 className="h5 text-dark mb-3">Facility Features</h4>
                        <ul className="text-dark">
                          <li>50,000 sq ft manufacturing space</li>
                          <li>Eco-friendly production processes</li>
                          <li>Quality control laboratory</li>
                          <li>Custom design consultation area</li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                  <Col lg={6} className="order-lg-0">
                    <div className="ratio ratio-16x9 h-100">
                      <iframe 
                        title="Company Location Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235882.89293769634!2d73.4699867!3d22.5165537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e2b11b7e033c1%3A0x6ddca936fb14f350!2sInfinite%20foam%20pvt%20ltd!5e0!3m2!1sen!2sin!4v1755423772493!5m2!1sen!2sin" 
                        style={{ border: 0, filter: "grayscale(20%) contrast(110%)" }} 
                        allowFullScreen
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col lg={4} className="mb-4 mb-lg-0">
              <h5 className="text-warning mb-3">Infinite Pvt. Ltd.</h5>
              <p className="mb-3 fs-6">
                Innovative foam solutions for packaging, insulation, and protection needs. 
                Quality manufacturing since 2022.
              </p>
              <div className="social-icons mt-3">
                <a href="https://facebook.com" className="text-white me-3"><i className="bi bi-facebook"><BiLogoFacebook /></i></a>
                <a href="https://twitter.com" className="text-white me-3"><i className="bi bi-twitter"><BiLogoTwitter /></i></a>
                <a href="https://linkedin.com" className="text-white me-3"><i className="bi bi-linkedin"><BiLogoLinkedin /></i></a>
                <a href="https://instagram.com" className="text-white"><i className="bi bi-instagram"><BiLogoInstagram /> </i></a>
              </div>
            </Col>
            <Col lg={4} className="mb-4 mb-lg-0 ps-lg-4">
              <h5 className="text-warning mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/" className="text-white">Home</a></li>
                <li className="mb-2"><a href="/about" className="text-white">About Us</a></li>
                <li className="mb-2"><a href="/products" className="text-white">Products</a></li>
                <li className="mb-2"><a href="/machinery" className="text-white">Machinery</a></li>
                <li><a href="/gallery" className="text-white">Place Order</a></li>
              </ul>
            </Col>
            <Col lg={4} className="ps-lg-4">
              <h5 className="text-warning mb-3">Contact Us</h5>
              <address>
                <p className="mb-2 fs-6"><i className="bi bi-geo-alt-fill me-2 text-primary"></i> GIDC, Halol, Gujarat, India</p>
                <p className="mb-2 fs-6"><i className="bi bi-telephone-fill me-2 text-primary"></i> +91 9876543210</p>
                <p className="mb-2 fs-6"><i className="bi bi-envelope-fill me-2 text-primary"></i> info@epefoam.com</p>
                <p className="fs-6"><i className="bi bi-clock-fill me-2 text-primary"></i> Mon-Sat: 9:00 AM - 6:00 PM</p>
              </address>
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>
            <Col className="text-center">
              <p className="mb-0 fs-6">&copy; {new Date().getFullYear()} Infinite Pvt. Ltd. All Rights Reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>

      <style jsx>{`
        .company-info-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .section-title {
          position: relative;
          display: inline-block;
          margin-bottom: 3rem;
          color: #388b6f;
          font-size: 2.5rem;
          font-weight: 600;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: #f8b400;
          border-radius: 2px;
        }
        
        .stat-item {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.3s ease;
        }
        
        .stat-item:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.15);
        }
        
        footer {
          background: linear-gradient(135deg, #1a3a3a 0%, #0d1f1f 100%);
          margin-top: auto;
        }
        
        footer a {
          color: #fff;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        footer a:hover {
          color: #f8b400;
        }
        
        .social-icons a {
          display: inline-block;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .social-icons a:hover {
          background: #f8b400;
          color: #000 !important;
          transform: translateY(-3px);
        }
        
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .accordion-button:not(.collapsed) {
          background-color: #f8f9fa;
          color: #388b6f;
        }
        
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .display-5 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}