import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';
import api from '../api/axios';
import { 
  BiEnvelope, BiPhone, BiMap, BiTime, 
  BiLogoFacebook, BiLogoTwitter, BiLogoLinkedin, BiLogoInstagram 
} from "react-icons/bi";

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    quantity: 100,
    requirements: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMachineryModal, setShowMachineryModal] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('inquiries/', formData);
      if (response.status === 201) {
        setSubmitted(true);
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          product: '',
          quantity: '',
          requirements: ''
        });
      }
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.');
      console.error(err);
    }
  };
  
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
  
  // Enhanced Banner section with better padding
  const Banner = () => (
    <div 
      className="banner text-white text-center d-flex align-items-center" 
      id="home"
      style={{
        background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://engineeringcivil.org/wp-content/uploads/2023/08/pexels-photo-236709.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "60vh",
        padding: "80px 0",
        marginTop: "25px",
      }}
    >
      <Container>
        <div 
          className="banner-content"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <div className="banner-badge mb-4">
            <span 
              className="badge bg-warning text-dark px-4 py-2 fs-6"
              style={{ fontSize: "0.9rem" }}
            >
              WELCOME TO OUR SITE
            </span>
          </div>
          <h3 
            className="fw-bold mb-4 text-shadow"
            style={{
              fontSize: "2.5rem",
              lineHeight: "1.2",
            }}
          >
            INFINITE PRIVATE LIMITED COMPANY
          </h3>
          <p 
            className="lead mb-5 text-shadow"
            style={{
              fontSize: "1.25rem",
              lineHeight: "1.6",
            }}
          >
            Innovative Foam Solutions for Packaging, Insulation, and Protection
          </p>
          <div className="banner-stats mb-5">
            <Row className="justify-content-center g-4">
              {[
                { value: "5000+", label: "Tons Annual Capacity" },
                { value: "95%", label: "Client Retention" },
                { value: "20K+", label: "Sq.Ft Facility" },
                { value: "ISO", label: "9001:2015 Certified" }
              ].map((stat, index) => (
                <Col md={3} sm={6} key={index}>
                  <div 
                    className="stat-item p-3"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <h3 
                      className="text-warning mb-1"
                      style={{ fontSize: "1.5rem" }}
                    >
                      {stat.value}
                    </h3>
                    <p 
                      className="mb-0"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className="banner-buttons">
            <Button 
              variant="warning" 
              size="lg" 
              href="#products" 
              className="me-3 fw-bold"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
              }}
            >
              Explore Products
            </Button>
            
            <Button 
              variant="outline-light" 
              size="lg" 
              onClick={handlePlaceOrder} 
              className="fw-bold"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
              }}
            >
              Place Order
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
  
  // Enhanced About section with consistent padding
  const AboutSection = () => (
    <section className="py-6" id="about">
      <Container>
        <h2 className="section-title text-center mb-5">About EPE</h2>
        <Row className="align-items-center mb-6">
          <Col md={6} className="mb-4 mb-md-0 pe-md-5">
            <div className="about-img-container position-relative rounded-3 overflow-hidden">
              <img 
                src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
                alt="EPE Foam Production" 
                className="img-fluid w-100"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="overlay-content p-4">
                <h5 className="text-white mb-0">Quality Manufacturing</h5>
                <p className="text-white mb-0">Since 2022</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="ps-md-5">
            <div className="about-content">
              <h3 className="text-primary mb-4">About EPE Foam</h3>
              <p className="mb-4 fs-5">
                EPE foam (Expanded Polyethylene) is a lightweight, flexible plastic foam that offers excellent
                impact resistance, thermal insulation, and water resistance. At Infinity EPE Foam, we specialize
                in manufacturing high-quality EPE foam products tailored to meet diverse industrial needs.
              </p>
              <p className="mb-4 fs-5">
                Our state-of-the-art manufacturing facility in Halol, Gujarat, spans over 20,000 sq.ft and houses
                the latest German extrusion technology. With an annual production capacity of 5,000 tons, we
                serve clients across automotive, electronics, healthcare, and consumer goods industries.
              </p>
            </div>
          </Col>
        </Row>
        
        <Row className="align-items-center mt-6">
          <Col md={6} className="order-md-2 mb-4 mb-md-0 ps-md-5">
            <div className="about-img-container position-relative rounded-3 overflow-hidden">
              <img 
                src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
                alt="EPE Foam Manufacturing Process" 
                className="img-fluid w-100"
                style={{ height: '300px', objectFit: 'cover'}}
              />
              <div className="overlay-content p-4">
                <h5 className="text-white mb-0">Advanced Technology</h5>
                <p className="text-white mb-0">German Extrusion</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="order-md-1 pe-md-5">
            <div className="about-content">
              <h4 className="mb-4 fs-3">Why Choose Our EPE Foam?</h4>
              <ul className="features-list mb-4">
                <li className="mb-3 fs-5">Superior cushioning and protective properties</li>
                <li className="mb-3 fs-5">100% recyclable and environmentally friendly</li>
                <li className="mb-3 fs-5">Excellent resistance to chemicals, water, and moisture</li>
                <li className="mb-3 fs-5">Customizable density, thickness, and dimensions</li>
                <li className="fs-5">Cost-effective packaging solution</li>
              </ul>
              <p className="mt-4 fs-5">
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

  // New Template Photo Sections
  const TemplateSection1 = () => (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="section-title text-center mb-5">EPE Foam Applications</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img 
                variant="top" 
                src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>Packaging Solutions</Card.Title>
                <Card.Text>
                  High-quality EPE foam for protecting fragile items during shipping and handling.
                </Card.Text>
                <Button 
                  variant="primary" 
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
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img 
                variant="top" 
                src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>Insulation Materials</Card.Title>
                <Card.Text>
                  Thermal and acoustic insulation for pipes, HVAC systems, and building applications.
                </Card.Text>
                <Button 
                  variant="primary" 
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
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Img 
                variant="top" 
                src="https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg" 
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>Custom Die-Cut Foam</Card.Title>
                <Card.Text>
                  Precision-cut foam shapes tailored to your specific product requirements.
                </Card.Text>
                <Button 
                  variant="primary" 
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
    <section className="py-5">
      <Container>
        <h2 className="section-title text-center mb-5">Our Manufacturing Process</h2>
        <Row className="align-items-center g-4">
          <Col md={6}>
            <div className="process-step">
              <div className="step-number">1</div>
              <h4>Material Preparation</h4>
              <p>
                High-quality polyethylene resin is mixed with additives and colorants to create the perfect foam formulation.
              </p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h4>Extrusion</h4>
              <p>
                The material is melted and expanded through our German-engineered extrusion lines to create consistent foam sheets.
              </p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h4>Quality Control</h4>
              <p>
                Every batch undergoes rigorous testing for density, thickness, and performance characteristics.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <img 
              src="https://lzjinlida.com/images/hero-bg.jpg" 
              alt="Manufacturing Process" 
              className="img-fluid rounded shadow"
              style={{ height: '400px', width: '100%', objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );

  const TemplateSection3 = () => (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="section-title text-center mb-5">Why Choose Us</h2>
        <Row className="g-4">
          <Col md={4}>
            <div className="feature-card p-4 text-center h-100">
              <div className="feature-icon mb-3">
                <i className="bi bi-award fs-1 text-primary"></i>
              </div>
              <h4>Quality Assurance</h4>
              <p>
                ISO 9001:2015 certified manufacturing with strict quality control at every stage.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card p-4 text-center h-100">
              <div className="feature-icon mb-3">
                <i className="bi bi-gear fs-1 text-primary"></i>
              </div>
              <h4>Advanced Technology</h4>
              <p>
                State-of-the-art German machinery for consistent, high-performance foam products.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card p-4 text-center h-100">
              <div className="feature-icon mb-3">
                <i className="bi bi-people fs-1 text-primary"></i>
              </div>
              <h4>Expert Team</h4>
              <p>
                Experienced professionals with deep knowledge of foam manufacturing and applications.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
  
  // Enhanced Products section with better card spacing
  const ProductsSection = () => (
    <section className="py-6 bg-light" id="products">
      <Container>
        <h2 className="section-title text-center mb-5">Our Raw Materials</h2>
        <Row className="g-4 justify-content-center mb-6">
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
            <Col lg={3} md={6} key={index}>
              <Card className="h-100 material-card border-0 shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={item.img} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="overlay-content d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-light" 
                      className="rounded-pill px-4"
                      onClick={() => openMaterialDetails(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <Card.Title className="mb-3 fs-5">{item.title}</Card.Title>
                  <Card.Text className="text-muted">{item.desc}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Button 
                    variant="link" 
                    className="text-primary p-0 fw-bold"
                    onClick={() => openMaterialDetails(item)}
                  >
                    Learn More →
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
        
        <h2 className="section-title text-center my-5">Our Products</h2>
        <Row className="g-4 justify-content-center">
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
            <Col lg={3} md={6} key={index}>
              <Card className="h-100 product-card border-0 shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={item.img} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="overlay-content d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-light" 
                      className="rounded-pill px-4"
                      onClick={() => openProductDetails(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="p-4 d-flex flex-column">
                  <Card.Title className="mb-3 fs-5">{item.title}</Card.Title>
                  <Card.Text className="mb-3 text-muted">{item.desc}</Card.Text>
                  <Card.Text className="fw-bold text-primary mb-3">{item.price}</Card.Text>
                  <Button 
                    variant="outline-primary" 
                    className="mt-auto rounded-pill px-4"
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
  
  // Enhanced Machinery section with consistent card height
  const MachinerySection = () => (
    <section className="py-6" id="machinery">
      <Container>
        <h2 className="section-title text-center mb-5">Our Machinery</h2>
        <Row className="g-4 justify-content-center">
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
            <Col lg={3} md={6} key={index}>
              <Card className="h-100 machinery-card border-0 shadow-sm">
                <div className="card-img-container">
                  <Card.Img variant="top" src={item.img} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="overlay-content d-flex align-items-center justify-content-center">
                    <Button 
                      variant="outline-light" 
                      className="rounded-pill px-4"
                      onClick={() => openMachineryDetails(item)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body className="p-4">
                  <Card.Title className="mb-3 fs-5">{item.title}</Card.Title>
                  <Card.Text className="text-muted">{item.desc}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Button 
                    variant="link" 
                    className="text-primary p-0 fw-bold"
                    onClick={() => openMachineryDetails(item)}
                  >
                    Learn More →
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  // Compact Footer
  const Footer = () => (
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
              <a href="#" className="text-white me-3"><BiLogoFacebook /><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-twitter"><BiLogoTwitter /></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-linkedin"><BiLogoLinkedin /></i></a>
              <a href="#" className="text-white"><i className="bi bi-instagram"><BiLogoInstagram /></i></a>
            </div>
          </Col>
          <Col lg={4} className="mb-4 mb-lg-0 ps-lg-4">
            <h5 className="text-warning mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#home" className="text-white">Home</a></li>
              <li className="mb-2"><a href="#about" className="text-white">About Us</a></li>
              <li className="mb-2"><a href="#products" className="text-white">Products</a></li>
              <li className="mb-2"><a href="#machinery" className="text-white">Machinery</a></li>
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
  );
  
  // Product Details Modal with better spacing
  const ProductDetailsModal = () => (
    <Modal show={showProductModal} onHide={closeProductModal} size="lg" centered>
      {selectedProduct && (
        <>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fs-3">{selectedProduct.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <Row>
              <Col md={6}>
                <div className="mb-4 rounded-3 overflow-hidden">
                  <img 
                    src={selectedProduct.img} 
                    alt={selectedProduct.title} 
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="text-primary mb-4">{selectedProduct.title}</h4>
                <p className="mb-4 fs-5">{selectedProduct.desc}</p>
                <div className="mb-4">
                  <h5>Specifications</h5>
                  <p className="text-muted fs-5">{selectedProduct.specs}</p>
                </div>
                <div className="mb-4">
                  <h5>Applications</h5>
                  <p className="text-muted fs-5">{selectedProduct.applications}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-5">
                  <h4 className="text-primary mb-0">{selectedProduct.price}</h4>
                  <Button 
                    variant="primary" 
                    className="px-4 py-2 rounded-pill"
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
            <Button variant="outline-secondary" onClick={closeProductModal} className="rounded-pill px-4">
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );

  // Material Details Modal with consistent styling
  const MaterialDetailsModal = () => (
    <Modal show={showMaterialModal} onHide={closeMaterialModal} size="lg" centered>
      {selectedMaterial && (
        <>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fs-3">{selectedMaterial.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <Row>
              <Col md={6}>
                <div className="mb-4 rounded-3 overflow-hidden">
                  <img 
                    src={selectedMaterial.img} 
                    alt={selectedMaterial.title} 
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="text-primary mb-4">{selectedMaterial.title}</h4>
                <p className="mb-4 fs-5">{selectedMaterial.details}</p>
                <div className="mb-4">
                  <h5>Specifications</h5>
                  <p className="text-muted fs-5">{selectedMaterial.specifications}</p>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={closeMaterialModal} className="rounded-pill px-4">
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );

  // Machinery Details Modal with improved layout
  const MachineryDetailsModal = () => (
    <Modal show={showMachineryModal} onHide={closeMachineryModal} size="lg" centered>
      {selectedMachinery && (
        <>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fs-3">{selectedMachinery.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <Row>
              <Col md={6}>
                <div className="mb-4 rounded-3 overflow-hidden">
                  <img 
                    src={selectedMachinery.img} 
                    alt={selectedMachinery.title} 
                    className="img-fluid rounded-3 shadow-sm"
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="text-primary mb-4">{selectedMachinery.title}</h4>
                <p className="mb-4 fs-5">{selectedMachinery.details}</p>
                <div className="mb-4">
                  <h5>Specifications</h5>
                  <p className="text-muted fs-5">{selectedMachinery.specifications}</p>
                </div>
                <div className="mb-4">
                  <h5>Key Features</h5>
                  <ul className="text-muted fs-5">
                    {selectedMachinery.features.map((feature, index) => (
                      <li key={index} className="mb-2">{feature}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={closeMachineryModal} className="rounded-pill px-4">
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
        
        .py-5 {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
        
        .py-6 {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }
        
        .mb-6 {
          margin-bottom: 5rem !important;
        }
        
        .mt-6 {
          margin-top: 5rem !important;
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
        
        .about-img-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .about-img-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
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
          padding-left: 35px;
          margin-bottom: 15px;
        }
        
        .features-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: #388b6f;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .material-card, .product-card, .machinery-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: none;
        }
        
        .material-card:hover, .product-card:hover, .machinery-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
          padding-left: 60px;
          margin-bottom: 30px;
        }
        
        .step-number {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          background: #388b6f;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
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
          .banner h1 {
            font-size: 2.5rem;
          }
          
          .banner p.lead {
            font-size: 1.2rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .py-5, .py-6 {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
          
          .process-step {
            padding-left: 50px;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Home;