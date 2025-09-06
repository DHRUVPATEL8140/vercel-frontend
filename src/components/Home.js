import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { 
  BiEnvelope, BiPhone, BiMap, BiTime, 
  BiLogoFacebook, BiLogoTwitter, BiLogoLinkedin, BiLogoInstagram,
  BiChevronRight, BiAward, BiCog, BiGroup
} from "react-icons/bi";

const Home = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMachineryModal, setShowMachineryModal] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };
  
  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const openMaterialDetails = (material) => {
    setSelectedMaterial(material);
    setShowMaterialModal(true);
  };
  
  const closeMaterialModal = () => {
    setShowMaterialModal(false);
    setSelectedMaterial(null);
  };

  const openMachineryDetails = (machinery) => {
    setSelectedMachinery(machinery);
    setShowMachineryModal(true);
  };
  
  const closeMachineryModal = () => {
    setShowMachineryModal(false);
    setSelectedMachinery(null);
  };

  const handlePlaceOrder = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    window.location.href = '/epe-sheets';
  };

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Enhanced Banner section with responsive design
  const Banner = () => (
    <div 
      className="banner text-white text-center d-flex align-items-center" 
      id="home"
      style={{
        background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://engineeringcivil.org/wp-content/uploads/2023/08/pexels-photo-236709.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: isMobile ? "70vh" : "60vh",
        padding: isMobile ? "60px 0" : "80px 0",
        marginTop: isMobile ? "0" : "25px",
      }}
    >
      <Container>
        <div 
          className="banner-content"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: isMobile ? "10px" : "20px",
          }}
        >
          <div className="banner-badge mb-4">
            <span 
              className="badge bg-warning text-dark px-3 py-2"
              style={{ fontSize: isMobile ? "0.8rem" : "0.9rem" }}
            >
              WELCOME TO OUR SITE
            </span>
          </div>
          <h3 
            className="fw-bold mb-4 text-shadow"
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              lineHeight: "1.2",
            }}
          >
            INFINITE PRIVATE LIMITED COMPANY
          </h3>
          <p 
            className="lead mb-5 text-shadow"
            style={{
              fontSize: isMobile ? "1rem" : "1.25rem",
              lineHeight: "1.6",
            }}
          >
            Innovative Foam Solutions for Packaging, Insulation, and Protection
          </p>
          <div className="banner-stats mb-5">
            <Row className="justify-content-center g-3">
              {[
                { value: "5000+", label: "Tons Annual Capacity" },
                { value: "95%", label: "Client Retention" },
                { value: "20K+", label: "Sq.Ft Facility" },
                { value: "ISO", label: "9001:2015 Certified" }
              ].map((stat, index) => (
                <Col md={3} sm={6} xs={6} key={index}>
                  <div 
                    className="stat-item p-3"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "all 0.3s ease",
                      marginBottom: isMobile ? "10px" : "0"
                    }}
                  >
                    <h3 
                      className="text-warning mb-1"
                      style={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                    >
                      {stat.value}
                    </h3>
                    <p 
                      className="mb-0"
                      style={{ 
                        fontSize: isMobile ? "0.75rem" : "0.9rem",
                        lineHeight: "1.2"
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className={`banner-buttons ${isMobile ? 'd-grid gap-2' : ''}`}>
            <Button 
              variant="warning" 
              size={isMobile ? "md" : "lg"}
              href="#products" 
              className={isMobile ? "" : "me-3 fw-bold"}
              style={{
                padding: isMobile ? "8px 16px" : "10px 20px",
                fontSize: isMobile ? "0.9rem" : "1rem",
                width: isMobile ? "100%" : "auto"
              }}
            >
              Explore Products
            </Button>
            
            <Button 
              variant="outline-light" 
              size={isMobile ? "md" : "lg"}
              onClick={handlePlaceOrder} 
              className={`fw-bold ${isMobile ? "mt-2" : ""}`}
              style={{
                padding: isMobile ? "8px 16px" : "10px 20px",
                fontSize: isMobile ? "0.9rem" : "1rem",
                width: isMobile ? "100%" : "auto"
              }}
            >
              Place Order
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
  
  // Enhanced About section with responsive design
  const AboutSection = () => (
    <section className={isMobile ? "py-4" : "py-6"} id="about">
      <Container>
        <h2 className="section-title text-center mb-4">About EPE</h2>
        <Row className="align-items-center mb-5">
          <Col md={6} className="mb-4 mb-md-0 pe-md-4">
            <div className="about-img-container position-relative rounded-3 overflow-hidden">
              <img 
                src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
                alt="EPE Foam Production" 
                className="img-fluid w-100"
                style={{ height: isMobile ? '200px' : '300px', objectFit: 'cover' }}
              />
              <div className="overlay-content p-3">
                <h5 className="text-white mb-0" style={{fontSize: isMobile ? '1rem' : '1.25rem'}}>Quality Manufacturing</h5>
                <p className="text-white mb-0" style={{fontSize: isMobile ? '0.8rem' : '1rem'}}>Since 2022</p>
              </div>
            </div>
          </Col>
          <Col md={6} className={isMobile ? "" : "ps-md-4"}>
            <div className="about-content">
              <h3 className="text-primary mb-3" style={{fontSize: isMobile ? '1.5rem' : '1.75rem'}}>About EPE Foam</h3>
              <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                EPE foam (Expanded Polyethylene) is a lightweight, flexible plastic foam that offers excellent
                impact resistance, thermal insulation, and water resistance. At Infinity EPE Foam, we specialize
                in manufacturing high-quality EPE foam products tailored to meet diverse industrial needs.
              </p>
              <p className="mb-0" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                Our state-of-the-art manufacturing facility in Halol, Gujarat, spans over 20,000 sq.ft and houses
                the latest German extrusion technology. With an annual production capacity of 5,000 tons, we
                serve clients across automotive, electronics, healthcare, and consumer goods industries.
              </p>
            </div>
          </Col>
        </Row>
        
        <Row className="align-items-center mt-5">
          <Col md={6} className="order-md-2 mb-4 mb-md-0 ps-md-4">
            <div className="about-img-container position-relative rounded-3 overflow-hidden">
              <img 
                src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
                alt="EPE Foam Manufacturing Process" 
                className="img-fluid w-100"
                style={{ height: isMobile ? '200px' : '300px', objectFit: 'cover'}}
              />
              <div className="overlay-content p-3">
                <h5 className="text-white mb-0" style={{fontSize: isMobile ? '1rem' : '1.25rem'}}>Advanced Technology</h5>
                <p className="text-white mb-0" style={{fontSize: isMobile ? '0.8rem' : '1rem'}}>German Extrusion</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="order-md-1 pe-md-4">
            <div className="about-content">
              <h4 className="mb-3" style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>Why Choose Our EPE Foam?</h4>
              <ul className="features-list mb-3">
                <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Superior cushioning and protective properties</li>
                <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>100% recyclable and environmentally friendly</li>
                <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Excellent resistance to chemicals, water, and moisture</li>
                <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Customizable density, thickness, and dimensions</li>
                <li style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Cost-effective packaging solution</li>
              </ul>
              <p className="mt-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                Our commitment to quality is reflected in our ISO 9001:2015 certification and client retention
                rate of over 95%. We continuously invest in R&D to develop innovative foam solutions that meet
                evolving market demands while reducing environmental impact.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  // Template Photo Sections with responsive design
  const TemplateSection1 = () => (
    <section className={isMobile ? "py-4 bg-light" : "py-5 bg-light"}>
      <Container>
        <h2 className="section-title text-center mb-4">EPE Foam Applications</h2>
        <Row className="g-3">
          <Col md={4} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img 
                variant="top" 
                src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
                style={{ height: isMobile ? '180px' : '250px', objectFit: 'cover' }}
              />
              <Card.Body className="p-3">
                <Card.Title style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Packaging Solutions</Card.Title>
                <Card.Text style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                  High-quality EPE foam for protecting fragile items during shipping and handling.
                </Card.Text>
                <Button 
                  variant="primary" 
                  size={isMobile ? "sm" : "md"}
                  onClick={() => openProductDetails({
                    title: "Packaging Solutions",
                    img: "https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg",
                    desc: "High-quality EPE foam for protecting fragile items during shipping and handling.",
                    price: "Custom Pricing",
                    specs: "Various thicknesses and densities available",
                    applications: "Electronics, glassware, medical equipment"
                  })}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img 
                variant="top" 
                src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
                style={{ height: isMobile ? '180px' : '250px', objectFit: 'cover' }}
              />
              <Card.Body className="p-3">
                <Card.Title style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Insulation Materials</Card.Title>
                <Card.Text style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                  Thermal and acoustic insulation for pipes, HVAC systems, and building applications.
                </Card.Text>
                <Button 
                  variant="primary" 
                  size={isMobile ? "sm" : "md"}
                  onClick={() => openProductDetails({
                    title: "Insulation Materials",
                    img: "https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg",
                    desc: "Thermal and acoustic insulation for pipes, HVAC systems, and building applications.",
                    price: "₹200 - ₹1000 per meter",
                    specs: "Temperature range: -50°C to 110°C",
                    applications: "Construction, industrial piping, refrigeration"
                  })}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img 
                variant="top" 
                src="https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg" 
                style={{ height: isMobile ? '180px' : '250px', objectFit: 'cover' }}
              />
              <Card.Body className="p-3">
                <Card.Title style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Custom Die-Cut Foam</Card.Title>
                <Card.Text style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                  Precision-cut foam shapes tailored to your specific product requirements.
                </Card.Text>
                <Button 
                  variant="primary" 
                  size={isMobile ? "sm" : "md"}
                  onClick={() => openProductDetails({
                    title: "Custom Die-Cut Foam",
                    img: "https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg",
                    desc: "Precision-cut foam shapes tailored to your specific product requirements.",
                    price: "Custom Pricing",
                    specs: "Various densities and colors available",
                    applications: "Product-specific packaging, medical devices"
                  })}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const TemplateSection2 = () => (
    <section className={isMobile ? "py-4" : "py-5"}>
      <Container>
        <h2 className="section-title text-center mb-4">Our Manufacturing Process</h2>
        <Row className="align-items-center g-3">
          <Col md={6}>
            <div className="process-step mb-4">
              <div className="step-number">1</div>
              <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Material Preparation</h4>
              <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                High-quality polyethylene resin is mixed with additives and colorants to create the perfect foam formulation.
              </p>
            </div>
            <div className="process-step mb-4">
              <div className="step-number">2</div>
              <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Extrusion</h4>
              <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                The material is melted and expanded through our German-engineered extrusion lines to create consistent foam sheets.
              </p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Quality Control</h4>
              <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                Every batch undergoes rigorous testing for density, thickness, and performance characteristics.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <img 
              src="https://lzjinlida.com/images/hero-bg.jpg" 
              alt="Manufacturing Process" 
              className="img-fluid rounded shadow"
              style={{ 
                height: isMobile ? '250px' : '400px', 
                width: '100%', 
                objectFit: 'cover',
                marginTop: isMobile ? '20px' : '0'
              }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );

  const TemplateSection3 = () => (
    <section className={isMobile ? "py-4 bg-light" : "py-5 bg-light"}>
      <Container>
        <h2 className="section-title text-center mb-4">Why Choose Us</h2>
        <Row className="g-3">
          <Col md={4} className="mb-3">
            <div className="feature-card p-3 text-center h-100">
              <div className="feature-icon mb-3">
                <BiAward className="fs-1 text-primary" />
              </div>
              <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Quality Assurance</h4>
              <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                ISO 9001:2015 certified manufacturing with strict quality control at every stage.
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="feature-card p-3 text-center h-100">
              <div className="feature-icon mb-3">
                <BiCog className="fs-1 text-primary" />
              </div>
              <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Advanced Technology</h4>
              <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                State-of-the-art German machinery for consistent, high-performance foam products.
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="feature-card p-3 text-center h-100">
              <div className="feature-icon mb-3">
                <BiGroup className="fs-1 text-primary" />
              </div>
              <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Expert Team</h4>
              <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                Experienced professionals with deep knowledge of foam manufacturing and applications.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
  
  // Enhanced Products section with responsive design
  const ProductsSection = () => (
    <section className={isMobile ? "py-4 bg-light" : "py-6 bg-light"} id="products">
      <Container>
        <h2 className="section-title text-center mb-4">Our Raw Materials</h2>
        <Row className="g-3 justify-content-center mb-5">
          {[
            {
              img: "https://themanufacturer-cdn-1.s3.eu-west-2.amazonaws.com/wp-content/uploads/2019/01/14113757/Untitled-5-1024x713.jpg",
              title: "Polyethylene Resin",
              desc: "High-grade virgin LDPE for premium foam quality",
              details: "Our premium polyethylene resin is sourced from leading suppliers and undergoes rigorous quality control. This virgin LDPE (Low-Density Polyethylene) provides excellent foam properties including superior cushioning, thermal insulation, and chemical resistance. We use resin with specific melt flow rates optimized for our extrusion process.",
              specifications: "Melt Flow Rate: 2-4 g/10min, Density: 0.910-0.925 g/cm³, Molecular Weight: 50,000-250,000"
            },
            {
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROhpXc8sO4vXdCeBC6F1cGrgsFgCtqn13wbT31zWytrGmVWGIIBL3iYzuOHUTbKC9N3xk&usqp=CAU",
              title: "Color Masterbatch",
              desc: "Custom colors for brand-specific solutions",
              details: "Our color masterbatch system allows for precise color matching to meet your brand requirements. We offer a wide range of standard colors and can create custom formulations. Our masterbatch is highly concentrated and provides excellent color dispersion and consistency throughout the foam.",
              specifications: "Concentration: 20-50%, Carrier: LDPE, Particle Size: <50 microns, Heat Stability: 200°C"
            },
            {
              img: "https://www.kiyorndlab.com/wp-content/uploads/2023/07/plastic-raw.jpg",
              title: "Specialty Additives",
              desc: "Fire retardants, UV stabilizers, anti-static agents",
              details: "We incorporate various specialty additives to enhance foam performance. Our additive package includes fire retardants for safety compliance, UV stabilizers for outdoor applications, and anti-static agents for electronic packaging. Each additive is carefully selected and tested for compatibility.",
              specifications: "Fire Retardant: Halogen-free, UV Stabilizer: HALS type, Anti-static: Quaternary ammonium"
            },
            {
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKkqdHUCYFJgcCEhwx3KTmE7uhiJps7BF5IdoQQJI4aSZ_GL-0_JxqQSLGbNBtVWAxeoc&usqp=CAU",
              title: "Recycled Materials",
              desc: "Post-industrial recycled content for eco-friendly products",
              details: "Our recycled material program supports sustainability goals while maintaining quality standards. We use post-industrial recycled polyethylene that has been cleaned, processed, and tested for consistency. This reduces environmental impact and can lower costs while maintaining performance.",
              specifications: "Recycled Content: Up to 30%, Contamination: <0.1%, Melt Flow: Compatible with virgin resin"
            }
          ].map((item, index) => (
            <Col lg={3} md={6} key={index} className="mb-3">
              <Card className="h-100 material-card border-0 shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={item.img} style={{ height: isMobile ? '150px' : '200px', objectFit: 'cover' }} />
                  <div className="overlay-content d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-light" 
                      size={isMobile ? "sm" : "md"}
                      className="rounded-pill px-3"
                      onClick={() => openMaterialDetails(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="p-3">
                  <Card.Title className="mb-2" style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>{item.title}</Card.Title>
                  <Card.Text className="text-muted" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>{item.desc}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Button 
                    variant="link" 
                    className="text-primary p-0 fw-bold"
                    style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}
                    onClick={() => openMaterialDetails(item)}
                  >
                    Learn More <BiChevronRight />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        
        <h2 className="section-title text-center my-4">Our Products</h2>
        <Row className="g-3 justify-content-center">
          {[
            {
              id: 1,
              img: "https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg",
              title: "EPE Foam Sheets",
              desc: "Available in various thicknesses from 1mm to 100mm",
              price: "₹150 - ₹800 per sheet",
              specs: "Thickness: 1-100mm | Density: 20-45 kg/m³",
              applications: "Packaging, insulation, cushioning"
            },
            {
              id: 2,
              img: "https://5.imimg.com/data5/SELLER/Default/2024/5/416707878/ZH/IW/JU/189342/white-epe-foam-1000x1000.png",
              title: "EPE Foam Rolls",
              desc: "Continuous rolls for packaging lines",
              price: "₹120 - ₹600 per meter",
              specs: "Thickness: 2-50mm | Width: 1-2m",
              applications: "Industrial packaging, void fill"
            },
            {
              id: 3,
              img: "https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg",
              title: "Custom Die-Cut Shapes",
              desc: "Precision-cut for product-specific protection",
              price: "Custom Pricing",
              specs: "Custom shapes and sizes",
              applications: "Product-specific packaging"
            },
            {
              id: 4,
              img: "https://c8.alamy.com/comp/2EPM50M/quality-mattress-materials-variety-for-comfort-and-durability-cutting-edge-technology-inner-layers-3d-scheme-vector-illustration-2EPM50M.jpg",
              title: "Pipe Insulation",
              desc: "Thermal and acoustic insulation for pipes",
              price: "₹250 - ₹1200 per meter",
              specs: "Diameter: 1/2\" to 12\" | Temp range: -50°C to 110°C",
              applications: "HVAC systems, plumbing"
            }
          ].map((item, index) => (
            <Col lg={3} md={6} key={index} className="mb-3">
              <Card className="h-100 product-card border-0 shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={item.img} style={{ height: isMobile ? '150px' : '200px', objectFit: 'cover' }} />
                  <div className="overlay-content d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-light" 
                      size={isMobile ? "sm" : "md"}
                      className="rounded-pill px-3"
                      onClick={() => openProductDetails(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="p-3 d-flex flex-column">
                  <Card.Title className="mb-2" style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>{item.title}</Card.Title>
                  <Card.Text className="mb-2 text-muted" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>{item.desc}</Card.Text>
                  <Card.Text className="fw-bold text-primary mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{item.price}</Card.Text>
                  <Button 
                    variant="outline-primary" 
                    size={isMobile ? "sm" : "md"}
                    className="mt-auto rounded-pill px-3"
                    style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
  
  // Enhanced Machinery section with responsive design
  const MachinerySection = () => (
    <section className={isMobile ? "py-4" : "py-6"} id="machinery">
      <Container>
        <h2 className="section-title text-center mb-4">Our Machinery</h2>
        <Row className="g-3 justify-content-center">
          {[
            {
              img: "https://lzjinlida.com/images/hero-bg.jpg",
              title: "High-Speed EPE Foam Extruder",
              desc: "German technology with 5,000 tons annual capacity",
              details: "Our state-of-the-art EPE foam extruder features advanced German engineering with precise temperature control, automated thickness monitoring, and high-speed production capabilities. The machine operates at speeds up to 200 meters per minute with thickness accuracy of ±0.1mm.",
              specifications: "Speed: 200 m/min, Thickness Range: 1-100mm, Width: 1-2m, Temperature Control: ±2°C",
              features: [
                "Automated thickness adjustment",
                "Energy-efficient operation",
                "Real-time quality monitoring",
                "Low maintenance design"
              ]
            },
            {
              img: "https://www.yuanhanequip.com/uploads/image/weixintupian_20200821104705-1abji5r2egv.jpg",
              title: "CNC Foam Cutting Machine",
              desc: "Precision cutting with ±0.5mm tolerance",
              details: "Our CNC cutting system provides precise cutting for complex shapes and patterns. The machine uses advanced CAD/CAM software for design and features automatic tool changing, dust extraction, and real-time monitoring. Perfect for custom die-cutting applications.",
              specifications: "Cutting Accuracy: ±0.5mm, Max Thickness: 100mm, Table Size: 2.5m x 1.5m, Tool Speed: 0-5000 RPM",
              features: [
                "3D cutting capability",
                "Automatic nesting software",
                "Dust collection system",
                "Multi-tool configuration"
              ]
            },
            {
              img: "https://3.imimg.com/data3/DE/MW/MY-1033284/foam-lamination-machines-500x500.png",
              title: "Multi-layer Lamination System",
              desc: "Creates custom laminated foam products",
              details: "Our lamination system can bond multiple layers of foam with different materials including films, fabrics, and adhesives. The system features precise pressure control, temperature monitoring, and automatic feeding for consistent quality.",
              specifications: "Max Layers: 5, Temperature: 50-200°C, Pressure: 0-50 bar, Speed: 0-50 m/min",
              features: [
                "Adjustable pressure zones",
                "Precision temperature control",
                "Automatic alignment system",
                "Quality inspection cameras"
              ]
            },
            {
              img: "https://www.foampacific.co.kr/wp-content/uploads/2014/06/Non-Crosslinked-PE-Foam-Sheet-Extrusion-Line.jpg",
              title: "Automated Quality Control Station",
              desc: "Ensures consistent product quality",
              details: "Our quality control station features automated testing equipment for density, thickness, compression resistance, and thermal properties. The system includes real-time data logging, statistical process control, and automatic rejection of non-conforming products.",
              specifications: "Testing Speed: 100 samples/hour, Accuracy: ±1%, Data Logging: Real-time, Rejection Rate: <0.1%",
              features: [
                "Non-contact measurement",
                "Automatic sample handling",
                "Cloud-based data storage",
                "Predictive quality analytics"
              ]
            }
          ].map((item, index) => (
            <Col lg={3} md={6} key={index} className="mb-3">
              <Card className="h-100 machinery-card border-0 shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={item.img} style={{ height: isMobile ? '150px' : '200px', objectFit: 'cover' }} />
                  <div className="overlay-content d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-light" 
                      size={isMobile ? "sm" : "md"}
                      className="rounded-pill px-3"
                      onClick={() => openMachineryDetails(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="p-3">
                  <Card.Title className="mb-2" style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>{item.title}</Card.Title>
                  <Card.Text className="text-muted" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>{item.desc}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Button 
                    variant="link" 
                    className="text-primary p-0 fw-bold"
                    style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}
                    onClick={() => openMachineryDetails(item)}
                  >
                    Learn More <BiChevronRight />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  // Compact Footer with responsive design
  const Footer = () => (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <h5 className="text-warning mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Infinite Pvt. Ltd.</h5>
            <p className="mb-3" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>
              Innovative foam solutions for packaging, insulation, and protection needs. 
              Quality manufacturing since 2022.
            </p>
            <div className="social-icons mt-3">
              <a href="https://facebook.com" className="text-white me-2 p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
                <BiLogoFacebook />
              </a>
              <a href="https://twitter.com" className="text-white me-2 p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
                <BiLogoTwitter />
              </a>
              <a href="https://linkedin.com" className="text-white me-2 p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
                <BiLogoLinkedin />
              </a>
              <a href="https://instagram.com" className="text-white p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
                <BiLogoInstagram />
              </a>
            </div>
          </Col>
          <Col lg={4} className="mb-4 mb-lg-0 ps-lg-4">
            <h5 className="text-warning mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#home" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Home</a></li>
              <li className="mb-2"><a href="#about" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>About Us</a></li>
              <li className="mb-2"><a href="#products" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Products</a></li>
              <li className="mb-2"><a href="#machinery" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Machinery</a></li>
              <li><a href="/gallery" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Place Order</a></li>
            </ul>
          </Col>
          <Col lg={4} className="ps-lg-4">
            <h5 className="text-warning mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Contact Us</h5>
            <address style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>
              <p className="mb-2"><BiMap className="me-2 text-primary" /> GIDC, Halol, Gujarat, India</p>
              <p className="mb-2"><BiPhone className="me-2 text-primary" /> +91 9876543210</p>
              <p className="mb-2"><BiEnvelope className="me-2 text-primary" /> info@epefoam.com</p>
              <p><BiTime className="me-2 text-primary" /> Mon-Sat: 9:00 AM - 6:00 PM</p>
            </address>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <p className="mb-0" style={{fontSize: isMobile ? '0.8rem' : '0.9rem'}}>
              &copy; {new Date().getFullYear()} Infinite Pvt. Ltd. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
  
  // Product Details Modal with responsive design
  const ProductDetailsModal = () => (
    <Modal show={showProductModal} onHide={closeProductModal} size="lg" centered>
      {selectedProduct && (
        <>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>{selectedProduct.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <Row>
              <Col md={6}>
                <div className="mb-3 rounded-3 overflow-hidden">
                  <img 
                    src={selectedProduct.img} 
                    alt={selectedProduct.title} 
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="text-primary mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedProduct.title}</h4>
                <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedProduct.desc}</p>
                <div className="mb-3">
                  <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Specifications</h5>
                  <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedProduct.specs}</p>
                </div>
                <div className="mb-3">
                  <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Applications</h5>
                  <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedProduct.applications}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <h4 className="text-primary mb-0" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedProduct.price}</h4>
                  <Button 
                    variant="primary" 
                    size={isMobile ? "sm" : "md"}
                    className="px-3 rounded-pill"
                    onClick={() => {
                      closeProductModal();
                      handlePlaceOrder();
                    }}
                  >
                    Place Order
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={closeProductModal} className="rounded-pill px-3" size={isMobile ? "sm" : "md"}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );

  // Material Details Modal with responsive design
  const MaterialDetailsModal = () => (
    <Modal show={showMaterialModal} onHide={closeMaterialModal} size="lg" centered>
      {selectedMaterial && (
        <>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>{selectedMaterial.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <Row>
              <Col md={6}>
                <div className="mb-3 rounded-3 overflow-hidden">
                  <img 
                    src={selectedMaterial.img} 
                    alt={selectedMaterial.title} 
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="text-primary mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedMaterial.title}</h4>
                <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMaterial.details}</p>
                <div className="mb-3">
                  <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Specifications</h5>
                  <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMaterial.specifications}</p>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={closeMaterialModal} className="rounded-pill px-3" size={isMobile ? "sm" : "md"}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );

  // Machinery Details Modal with responsive design
  const MachineryDetailsModal = () => (
    <Modal show={showMachineryModal} onHide={closeMachineryModal} size="lg" centered>
      {selectedMachinery && (
        <>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>{selectedMachinery.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <Row>
              <Col md={6}>
                <div className="mb-3 rounded-3 overflow-hidden">
                  <img 
                    src={selectedMachinery.img} 
                    alt={selectedMachinery.title} 
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="text-primary mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedMachinery.title}</h4>
                <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMachinery.details}</p>
                <div className="mb-3">
                  <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Specifications</h5>
                  <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMachinery.specifications}</p>
                </div>
                <div className="mb-3">
                  <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Key Features</h5>
                  <ul className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                    {selectedMachinery.features.map((feature, index) => (
                      <li key={index} className="mb-1">{feature}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={closeMachineryModal} className="rounded-pill px-3" size={isMobile ? "sm" : "md"}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
  
  return (
    <div className="home-page">
      <Banner />
      <AboutSection />
      <TemplateSection1 />
      <TemplateSection2 />
      <TemplateSection3 />
      <ProductsSection />
      <MachinerySection />
      <Footer />
      
      <ProductDetailsModal />
      <MaterialDetailsModal />
      <MachineryDetailsModal />
      
      <style >{`
        .home-page {
          overflow-x: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        
        .text-shadow {
          text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        section {
          position: relative;
        }
        
        .section-title {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
          color: #388b6f;
          font-size: 1.8rem;
          font-weight: 600;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #f8b400;
          border-radius: 2px;
        }
        
        .about-img-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .about-img-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        
        .overlay-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(56, 139, 111, 0.9);
          color: white;
          transition: all 0.3s ease;
        }
        
        .features-list {
          list-style-type: none;
          padding-left: 0;
        }
        
        .features-list li {
          position: relative;
          padding-left: 30px;
          margin-bottom: 12px;
        }
        
        .features-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: #388b6f;
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .material-card, .product-card, .machinery-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: none;
        }
        
        .material-card:hover, .product-card:hover, .machinery-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        
        .card-img-container {
          position: relative;
          overflow: hidden;
        }
        
        .card-img-container .overlay-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(56, 139, 111, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .card-img-container:hover .overlay-content {
          opacity: 1;
        }
        
        /* New template section styles */
        .process-step {
          position: relative;
          padding-left: 50px;
          margin-bottom: 25px;
        }
        
        .step-number {
          position: absolute;
          left: 0;
          top: 0;
          width: 35px;
          height: 35px;
          background: #388b6f;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        .feature-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
          color: #388b6f;
        }
        
        footer {
          background: linear-gradient(135deg, #1a3a3a 0%, #0d1f1f 100%);
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
        
        @media (max-width: 768px) {
          .section-title {
            font-size: 1.5rem;
          }
          
          .section-title::after {
            bottom: -8px;
            width: 50px;
            height: 2px;
          }
          
          .process-step {
            padding-left: 40px;
          }
          
          .step-number {
            width: 30px;
            height: 30px;
            font-size: 1rem;
          }
          
          .social-icons a {
            width: 35px;
            height: 35px;
            line-height: 35px;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Home;