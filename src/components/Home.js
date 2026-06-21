// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
// import { 
//   BiEnvelope, BiPhone, BiMap, BiTime, 
//   BiLogoFacebook, BiLogoTwitter, BiLogoLinkedin, BiLogoInstagram,
//   BiChevronRight, BiAward, BiCog, BiGroup
// } from "react-icons/bi";

// const Home = () => {
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showMaterialModal, setShowMaterialModal] = useState(false);
//   const [selectedMaterial, setSelectedMaterial] = useState(null);
//   const [showMachineryModal, setShowMachineryModal] = useState(false);
//   const [selectedMachinery, setSelectedMachinery] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
//   const openProductDetails = (product) => {
//     setSelectedProduct(product);
//     setShowProductModal(true);
//   };
  
//   const closeProductModal = () => {
//     setShowProductModal(false);
//     setSelectedProduct(null);
//   };

//   const openMaterialDetails = (material) => {
//     setSelectedMaterial(material);
//     setShowMaterialModal(true);
//   };
  
//   const closeMaterialModal = () => {
//     setShowMaterialModal(false);
//     setSelectedMaterial(null);
//   };

//   const openMachineryDetails = (machinery) => {
//     setSelectedMachinery(machinery);
//     setShowMachineryModal(true);
//   };
  
//   const closeMachineryModal = () => {
//     setShowMachineryModal(false);
//     setSelectedMachinery(null);
//   };

//   const handlePlaceOrder = () => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       window.location.href = '/login';
//       return;
//     }
//     window.location.href = '/epe-sheets';
//   };

//   // Handle window resize for responsiveness
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
  
//   // Enhanced Banner section with responsive design
//   const Banner = () => (
//     <div 
//       className="banner text-white text-center d-flex align-items-center" 
//       id="home"
//       style={{
//         background: "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://engineeringcivil.org/wp-content/uploads/2023/08/pexels-photo-236709.jpeg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         minHeight: isMobile ? "70vh" : "60vh",
//         padding: isMobile ? "60px 0" : "80px 0",
//         marginTop: isMobile ? "0" : "25px",
//       }}
//     >
//       <Container>
//         <div 
//           className="banner-content"
//           style={{
//             maxWidth: "900px",
//             margin: "0 auto",
//             padding: isMobile ? "10px" : "20px",
//           }}
//         >
//           <div className="banner-badge mb-4">
//             <span 
//               className="badge bg-warning text-dark px-3 py-2"
//               style={{ fontSize: isMobile ? "0.8rem" : "0.9rem" }}
//             >
//               WELCOME TO OUR SITE
//             </span>
//           </div>
//           <h3 
//             className="fw-bold mb-4 text-shadow"
//             style={{
//               fontSize: isMobile ? "1.8rem" : "2.5rem",
//               lineHeight: "1.2",
//             }}
//           >
//             INFINITE PRIVATE LIMITED COMPANY
//           </h3>
//           <p 
//             className="lead mb-5 text-shadow"
//             style={{
//               fontSize: isMobile ? "1rem" : "1.25rem",
//               lineHeight: "1.6",
//             }}
//           >
//             Innovative Foam Solutions for Packaging, Insulation, and Protection
//           </p>
//           <div className="banner-stats mb-5">
//             <Row className="justify-content-center g-3">
//               {[
//                 { value: "5000+", label: "Tons Annual Capacity" },
//                 { value: "95%", label: "Client Retention" },
//                 { value: "20K+", label: "Sq.Ft Facility" },
//                 { value: "ISO", label: "9001:2015 Certified" }
//               ].map((stat, index) => (
//                 <Col md={3} sm={6} xs={6} key={index}>
//                   <div 
//                     className="stat-item p-3"
//                     style={{
//                       background: "rgba(255,255,255,0.1)",
//                       borderRadius: "12px",
//                       backdropFilter: "blur(10px)",
//                       border: "1px solid rgba(255,255,255,0.1)",
//                       transition: "all 0.3s ease",
//                       marginBottom: isMobile ? "10px" : "0"
//                     }}
//                   >
//                     <h3 
//                       className="text-warning mb-1"
//                       style={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
//                     >
//                       {stat.value}
//                     </h3>
//                     <p 
//                       className="mb-0"
//                       style={{ 
//                         fontSize: isMobile ? "0.75rem" : "0.9rem",
//                         lineHeight: "1.2"
//                       }}
//                     >
//                       {stat.label}
//                     </p>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//           <div className={`banner-buttons ${isMobile ? 'd-grid gap-2' : ''}`}>
//             <Button 
//               variant="warning" 
//               size={isMobile ? "md" : "lg"}
//               href="#products" 
//               className={isMobile ? "" : "me-3 fw-bold"}
//               style={{
//                 padding: isMobile ? "8px 16px" : "10px 20px",
//                 fontSize: isMobile ? "0.9rem" : "1rem",
//                 width: isMobile ? "100%" : "auto"
//               }}
//             >
//               Explore Products
//             </Button>
            
//             <Button 
//               variant="outline-light" 
//               size={isMobile ? "md" : "lg"}
//               onClick={handlePlaceOrder} 
//               className={`fw-bold ${isMobile ? "mt-2" : ""}`}
//               style={{
//                 padding: isMobile ? "8px 16px" : "10px 20px",
//                 fontSize: isMobile ? "0.9rem" : "1rem",
//                 width: isMobile ? "100%" : "auto"
//               }}
//             >
//               Place Order
//             </Button>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
  
//   // Enhanced About section with responsive design
//   const AboutSection = () => (
//     <section className={isMobile ? "py-4" : "py-6"} id="about">
//       <Container>
//         <h2 className="section-title text-center mb-4">About EPE</h2>
//         <Row className="align-items-center mb-5">
//           <Col md={6} className="mb-4 mb-md-0 pe-md-4">
//             <div className="about-img-container position-relative rounded-3 overflow-hidden">
//               <img 
//                 src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
//                 alt="EPE Foam Production" 
//                 className="img-fluid w-100"
//                 style={{ height: isMobile ? '200px' : '300px', objectFit: 'cover' }}
//               />
//               <div className="overlay-content p-3">
//                 <h5 className="text-white mb-0" style={{fontSize: isMobile ? '1rem' : '1.25rem'}}>Quality Manufacturing</h5>
//                 <p className="text-white mb-0" style={{fontSize: isMobile ? '0.8rem' : '1rem'}}>Since 2022</p>
//               </div>
//             </div>
//           </Col>
//           <Col md={6} className={isMobile ? "" : "ps-md-4"}>
//             <div className="about-content">
//               <h3 className="text-primary mb-3" style={{fontSize: isMobile ? '1.5rem' : '1.75rem'}}>About EPE Foam</h3>
//               <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 EPE foam (Expanded Polyethylene) is a lightweight, flexible plastic foam that offers excellent
//                 impact resistance, thermal insulation, and water resistance. At Infinity EPE Foam, we specialize
//                 in manufacturing high-quality EPE foam products tailored to meet diverse industrial needs.
//               </p>
//               <p className="mb-0" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 Our state-of-the-art manufacturing facility in Halol, Gujarat, spans over 20,000 sq.ft and houses
//                 the latest German extrusion technology. With an annual production capacity of 5,000 tons, we
//                 serve clients across automotive, electronics, healthcare, and consumer goods industries.
//               </p>
//             </div>
//           </Col>
//         </Row>
        
//         <Row className="align-items-center mt-5">
//           <Col md={6} className="order-md-2 mb-4 mb-md-0 ps-md-4">
//             <div className="about-img-container position-relative rounded-3 overflow-hidden">
//               <img 
//                 src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
//                 alt="EPE Foam Manufacturing Process" 
//                 className="img-fluid w-100"
//                 style={{ height: isMobile ? '200px' : '300px', objectFit: 'cover'}}
//               />
//               <div className="overlay-content p-3">
//                 <h5 className="text-white mb-0" style={{fontSize: isMobile ? '1rem' : '1.25rem'}}>Advanced Technology</h5>
//                 <p className="text-white mb-0" style={{fontSize: isMobile ? '0.8rem' : '1rem'}}>German Extrusion</p>
//               </div>
//             </div>
//           </Col>
//           <Col md={6} className="order-md-1 pe-md-4">
//             <div className="about-content">
//               <h4 className="mb-3" style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>Why Choose Our EPE Foam?</h4>
//               <ul className="features-list mb-3">
//                 <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Superior cushioning and protective properties</li>
//                 <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>100% recyclable and environmentally friendly</li>
//                 <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Excellent resistance to chemicals, water, and moisture</li>
//                 <li className="mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Customizable density, thickness, and dimensions</li>
//                 <li style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>Cost-effective packaging solution</li>
//               </ul>
//               <p className="mt-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 Our commitment to quality is reflected in our ISO 9001:2015 certification and client retention
//                 rate of over 95%. We continuously invest in R&D to develop innovative foam solutions that meet
//                 evolving market demands while reducing environmental impact.
//               </p>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );

//   // Template Photo Sections with responsive design
//   const TemplateSection1 = () => (
//     <section className={isMobile ? "py-4 bg-light" : "py-5 bg-light"}>
//       <Container>
//         <h2 className="section-title text-center mb-4">EPE Foam Applications</h2>
//         <Row className="g-3">
//           <Col md={4} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Img 
//                 variant="top" 
//                 src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
//                 style={{ height: isMobile ? '180px' : '250px', objectFit: 'cover' }}
//               />
//               <Card.Body className="p-3">
//                 <Card.Title style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Packaging Solutions</Card.Title>
//                 <Card.Text style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                   High-quality EPE foam for protecting fragile items during shipping and handling.
//                 </Card.Text>
//                 <Button 
//                   variant="primary" 
//                   size={isMobile ? "sm" : "md"}
//                   onClick={() => openProductDetails({
//                     title: "Packaging Solutions",
//                     img: "https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg",
//                     desc: "High-quality EPE foam for protecting fragile items during shipping and handling.",
//                     price: "Custom Pricing",
//                     specs: "Various thicknesses and densities available",
//                     applications: "Electronics, glassware, medical equipment"
//                   })}
//                 >
//                   View Details
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Img 
//                 variant="top" 
//                 src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
//                 style={{ height: isMobile ? '180px' : '250px', objectFit: 'cover' }}
//               />
//               <Card.Body className="p-3">
//                 <Card.Title style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Insulation Materials</Card.Title>
//                 <Card.Text style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                   Thermal and acoustic insulation for pipes, HVAC systems, and building applications.
//                 </Card.Text>
//                 <Button 
//                   variant="primary" 
//                   size={isMobile ? "sm" : "md"}
//                   onClick={() => openProductDetails({
//                     title: "Insulation Materials",
//                     img: "https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg",
//                     desc: "Thermal and acoustic insulation for pipes, HVAC systems, and building applications.",
//                     price: "₹200 - ₹1000 per meter",
//                     specs: "Temperature range: -50°C to 110°C",
//                     applications: "Construction, industrial piping, refrigeration"
//                   })}
//                 >
//                   View Details
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4} className="mb-3">
//             <Card className="h-100 border-0 shadow-sm">
//               <Card.Img 
//                 variant="top" 
//                 src="https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg" 
//                 style={{ height: isMobile ? '180px' : '250px', objectFit: 'cover' }}
//               />
//               <Card.Body className="p-3">
//                 <Card.Title style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Custom Die-Cut Foam</Card.Title>
//                 <Card.Text style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                   Precision-cut foam shapes tailored to your specific product requirements.
//                 </Card.Text>
//                 <Button 
//                   variant="primary" 
//                   size={isMobile ? "sm" : "md"}
//                   onClick={() => openProductDetails({
//                     title: "Custom Die-Cut Foam",
//                     img: "https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg",
//                     desc: "Precision-cut foam shapes tailored to your specific product requirements.",
//                     price: "Custom Pricing",
//                     specs: "Various densities and colors available",
//                     applications: "Product-specific packaging, medical devices"
//                   })}
//                 >
//                   View Details
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );

//   const TemplateSection2 = () => (
//     <section className={isMobile ? "py-4" : "py-5"}>
//       <Container>
//         <h2 className="section-title text-center mb-4">Our Manufacturing Process</h2>
//         <Row className="align-items-center g-3">
//           <Col md={6}>
//             <div className="process-step mb-4">
//               <div className="step-number">1</div>
//               <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Material Preparation</h4>
//               <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 High-quality polyethylene resin is mixed with additives and colorants to create the perfect foam formulation.
//               </p>
//             </div>
//             <div className="process-step mb-4">
//               <div className="step-number">2</div>
//               <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Extrusion</h4>
//               <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 The material is melted and expanded through our German-engineered extrusion lines to create consistent foam sheets.
//               </p>
//             </div>
//             <div className="process-step">
//               <div className="step-number">3</div>
//               <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Quality Control</h4>
//               <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 Every batch undergoes rigorous testing for density, thickness, and performance characteristics.
//               </p>
//             </div>
//           </Col>
//           <Col md={6}>
//             <img 
//               src="https://lzjinlida.com/images/hero-bg.jpg" 
//               alt="Manufacturing Process" 
//               className="img-fluid rounded shadow"
//               style={{ 
//                 height: isMobile ? '250px' : '400px', 
//                 width: '100%', 
//                 objectFit: 'cover',
//                 marginTop: isMobile ? '20px' : '0'
//               }}
//             />
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );

//   const TemplateSection3 = () => (
//     <section className={isMobile ? "py-4 bg-light" : "py-5 bg-light"}>
//       <Container>
//         <h2 className="section-title text-center mb-4">Why Choose Us</h2>
//         <Row className="g-3">
//           <Col md={4} className="mb-3">
//             <div className="feature-card p-3 text-center h-100">
//               <div className="feature-icon mb-3">
//                 <BiAward className="fs-1 text-primary" />
//               </div>
//               <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Quality Assurance</h4>
//               <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 ISO 9001:2015 certified manufacturing with strict quality control at every stage.
//               </p>
//             </div>
//           </Col>
//           <Col md={4} className="mb-3">
//             <div className="feature-card p-3 text-center h-100">
//               <div className="feature-icon mb-3">
//                 <BiCog className="fs-1 text-primary" />
//               </div>
//               <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Advanced Technology</h4>
//               <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 State-of-the-art German machinery for consistent, high-performance foam products.
//               </p>
//             </div>
//           </Col>
//           <Col md={4} className="mb-3">
//             <div className="feature-card p-3 text-center h-100">
//               <div className="feature-icon mb-3">
//                 <BiGroup className="fs-1 text-primary" />
//               </div>
//               <h4 style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Expert Team</h4>
//               <p style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                 Experienced professionals with deep knowledge of foam manufacturing and applications.
//               </p>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
  
//   // Enhanced Products section with responsive design
//   const ProductsSection = () => (
//     <section className={isMobile ? "py-4 bg-light" : "py-6 bg-light"} id="products">
//       <Container>
//         <h2 className="section-title text-center mb-4">Our Raw Materials</h2>
//         <Row className="g-3 justify-content-center mb-5">
//           {[
//             {
//               img: "https://themanufacturer-cdn-1.s3.eu-west-2.amazonaws.com/wp-content/uploads/2019/01/14113757/Untitled-5-1024x713.jpg",
//               title: "Polyethylene Resin",
//               desc: "High-grade virgin LDPE for premium foam quality",
//               details: "Our premium polyethylene resin is sourced from leading suppliers and undergoes rigorous quality control. This virgin LDPE (Low-Density Polyethylene) provides excellent foam properties including superior cushioning, thermal insulation, and chemical resistance. We use resin with specific melt flow rates optimized for our extrusion process.",
//               specifications: "Melt Flow Rate: 2-4 g/10min, Density: 0.910-0.925 g/cm³, Molecular Weight: 50,000-250,000"
//             },
//             {
//               img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROhpXc8sO4vXdCeBC6F1cGrgsFgCtqn13wbT31zWytrGmVWGIIBL3iYzuOHUTbKC9N3xk&usqp=CAU",
//               title: "Color Masterbatch",
//               desc: "Custom colors for brand-specific solutions",
//               details: "Our color masterbatch system allows for precise color matching to meet your brand requirements. We offer a wide range of standard colors and can create custom formulations. Our masterbatch is highly concentrated and provides excellent color dispersion and consistency throughout the foam.",
//               specifications: "Concentration: 20-50%, Carrier: LDPE, Particle Size: <50 microns, Heat Stability: 200°C"
//             },
//             {
//               img: "https://www.kiyorndlab.com/wp-content/uploads/2023/07/plastic-raw.jpg",
//               title: "Specialty Additives",
//               desc: "Fire retardants, UV stabilizers, anti-static agents",
//               details: "We incorporate various specialty additives to enhance foam performance. Our additive package includes fire retardants for safety compliance, UV stabilizers for outdoor applications, and anti-static agents for electronic packaging. Each additive is carefully selected and tested for compatibility.",
//               specifications: "Fire Retardant: Halogen-free, UV Stabilizer: HALS type, Anti-static: Quaternary ammonium"
//             },
//             {
//               img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKkqdHUCYFJgcCEhwx3KTmE7uhiJps7BF5IdoQQJI4aSZ_GL-0_JxqQSLGbNBtVWAxeoc&usqp=CAU",
//               title: "Recycled Materials",
//               desc: "Post-industrial recycled content for eco-friendly products",
//               details: "Our recycled material program supports sustainability goals while maintaining quality standards. We use post-industrial recycled polyethylene that has been cleaned, processed, and tested for consistency. This reduces environmental impact and can lower costs while maintaining performance.",
//               specifications: "Recycled Content: Up to 30%, Contamination: <0.1%, Melt Flow: Compatible with virgin resin"
//             }
//           ].map((item, index) => (
//             <Col lg={3} md={6} key={index} className="mb-3">
//               <Card className="h-100 material-card border-0 shadow-sm">
//                 <div className="card-img-container">
//                   <Card.Img variant="top" src={item.img} style={{ height: isMobile ? '150px' : '200px', objectFit: 'cover' }} />
//                   <div className="overlay-content d-flex align-items-center justify-content-center">
//                     <Button 
//                       variant="outline-light" 
//                       size={isMobile ? "sm" : "md"}
//                       className="rounded-pill px-3"
//                       onClick={() => openMaterialDetails(item)}
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 </div>
//                 <Card.Body className="p-3">
//                   <Card.Title className="mb-2" style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>{item.title}</Card.Title>
//                   <Card.Text className="text-muted" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>{item.desc}</Card.Text>
//                 </Card.Body>
//                 <Card.Footer className="bg-transparent border-0 pt-0">
//                   <Button 
//                     variant="link" 
//                     className="text-primary p-0 fw-bold"
//                     style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}
//                     onClick={() => openMaterialDetails(item)}
//                   >
//                     Learn More <BiChevronRight />
//                   </Button>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
        
//         <h2 className="section-title text-center my-4">Our Products</h2>
//         <Row className="g-3 justify-content-center">
//           {[
//             {
//               id: 1,
//               img: "https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg",
//               title: "EPE Foam Sheets",
//               desc: "Available in various thicknesses from 1mm to 100mm",
//               price: "₹150 - ₹800 per sheet",
//               specs: "Thickness: 1-100mm | Density: 20-45 kg/m³",
//               applications: "Packaging, insulation, cushioning"
//             },
//             {
//               id: 2,
//               img: "https://5.imimg.com/data5/SELLER/Default/2024/5/416707878/ZH/IW/JU/189342/white-epe-foam-1000x1000.png",
//               title: "EPE Foam Rolls",
//               desc: "Continuous rolls for packaging lines",
//               price: "₹120 - ₹600 per meter",
//               specs: "Thickness: 2-50mm | Width: 1-2m",
//               applications: "Industrial packaging, void fill"
//             },
//             {
//               id: 3,
//               img: "https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg",
//               title: "Custom Die-Cut Shapes",
//               desc: "Precision-cut for product-specific protection",
//               price: "Custom Pricing",
//               specs: "Custom shapes and sizes",
//               applications: "Product-specific packaging"
//             },
//             {
//               id: 4,
//               img: "https://c8.alamy.com/comp/2EPM50M/quality-mattress-materials-variety-for-comfort-and-durability-cutting-edge-technology-inner-layers-3d-scheme-vector-illustration-2EPM50M.jpg",
//               title: "Pipe Insulation",
//               desc: "Thermal and acoustic insulation for pipes",
//               price: "₹250 - ₹1200 per meter",
//               specs: "Diameter: 1/2\" to 12\" | Temp range: -50°C to 110°C",
//               applications: "HVAC systems, plumbing"
//             }
//           ].map((item, index) => (
//             <Col lg={3} md={6} key={index} className="mb-3">
//               <Card className="h-100 product-card border-0 shadow-sm">
//                 <div className="card-img-container">
//                   <Card.Img variant="top" src={item.img} style={{ height: isMobile ? '150px' : '200px', objectFit: 'cover' }} />
//                   <div className="overlay-content d-flex align-items-center justify-content-center">
//                     <Button 
//                       variant="outline-light" 
//                       size={isMobile ? "sm" : "md"}
//                       className="rounded-pill px-3"
//                       onClick={() => openProductDetails(item)}
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 </div>
//                 <Card.Body className="p-3 d-flex flex-column">
//                   <Card.Title className="mb-2" style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>{item.title}</Card.Title>
//                   <Card.Text className="mb-2 text-muted" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>{item.desc}</Card.Text>
//                   <Card.Text className="fw-bold text-primary mb-2" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{item.price}</Card.Text>
//                   <Button 
//                     variant="outline-primary" 
//                     size={isMobile ? "sm" : "md"}
//                     className="mt-auto rounded-pill px-3"
//                     style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}
//                     onClick={handlePlaceOrder}
//                   >
//                     Place Order
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </section>
//   );
  
//   // Enhanced Machinery section with responsive design
//   const MachinerySection = () => (
//     <section className={isMobile ? "py-4" : "py-6"} id="machinery">
//       <Container>
//         <h2 className="section-title text-center mb-4">Our Machinery</h2>
//         <Row className="g-3 justify-content-center">
//           {[
//             {
//               img: "https://lzjinlida.com/images/hero-bg.jpg",
//               title: "High-Speed EPE Foam Extruder",
//               desc: "German technology with 5,000 tons annual capacity",
//               details: "Our state-of-the-art EPE foam extruder features advanced German engineering with precise temperature control, automated thickness monitoring, and high-speed production capabilities. The machine operates at speeds up to 200 meters per minute with thickness accuracy of ±0.1mm.",
//               specifications: "Speed: 200 m/min, Thickness Range: 1-100mm, Width: 1-2m, Temperature Control: ±2°C",
//               features: [
//                 "Automated thickness adjustment",
//                 "Energy-efficient operation",
//                 "Real-time quality monitoring",
//                 "Low maintenance design"
//               ]
//             },
//             {
//               img: "https://www.yuanhanequip.com/uploads/image/weixintupian_20200821104705-1abji5r2egv.jpg",
//               title: "CNC Foam Cutting Machine",
//               desc: "Precision cutting with ±0.5mm tolerance",
//               details: "Our CNC cutting system provides precise cutting for complex shapes and patterns. The machine uses advanced CAD/CAM software for design and features automatic tool changing, dust extraction, and real-time monitoring. Perfect for custom die-cutting applications.",
//               specifications: "Cutting Accuracy: ±0.5mm, Max Thickness: 100mm, Table Size: 2.5m x 1.5m, Tool Speed: 0-5000 RPM",
//               features: [
//                 "3D cutting capability",
//                 "Automatic nesting software",
//                 "Dust collection system",
//                 "Multi-tool configuration"
//               ]
//             },
//             {
//               img: "https://3.imimg.com/data3/DE/MW/MY-1033284/foam-lamination-machines-500x500.png",
//               title: "Multi-layer Lamination System",
//               desc: "Creates custom laminated foam products",
//               details: "Our lamination system can bond multiple layers of foam with different materials including films, fabrics, and adhesives. The system features precise pressure control, temperature monitoring, and automatic feeding for consistent quality.",
//               specifications: "Max Layers: 5, Temperature: 50-200°C, Pressure: 0-50 bar, Speed: 0-50 m/min",
//               features: [
//                 "Adjustable pressure zones",
//                 "Precision temperature control",
//                 "Automatic alignment system",
//                 "Quality inspection cameras"
//               ]
//             },
//             {
//               img: "https://www.foampacific.co.kr/wp-content/uploads/2014/06/Non-Crosslinked-PE-Foam-Sheet-Extrusion-Line.jpg",
//               title: "Automated Quality Control Station",
//               desc: "Ensures consistent product quality",
//               details: "Our quality control station features automated testing equipment for density, thickness, compression resistance, and thermal properties. The system includes real-time data logging, statistical process control, and automatic rejection of non-conforming products.",
//               specifications: "Testing Speed: 100 samples/hour, Accuracy: ±1%, Data Logging: Real-time, Rejection Rate: <0.1%",
//               features: [
//                 "Non-contact measurement",
//                 "Automatic sample handling",
//                 "Cloud-based data storage",
//                 "Predictive quality analytics"
//               ]
//             }
//           ].map((item, index) => (
//             <Col lg={3} md={6} key={index} className="mb-3">
//               <Card className="h-100 machinery-card border-0 shadow-sm">
//                 <div className="card-img-container">
//                   <Card.Img variant="top" src={item.img} style={{ height: isMobile ? '150px' : '200px', objectFit: 'cover' }} />
//                   <div className="overlay-content d-flex align-items-center justify-content-center">
//                     <Button 
//                       variant="outline-light" 
//                       size={isMobile ? "sm" : "md"}
//                       className="rounded-pill px-3"
//                       onClick={() => openMachineryDetails(item)}
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 </div>
//                 <Card.Body className="p-3">
//                   <Card.Title className="mb-2" style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>{item.title}</Card.Title>
//                   <Card.Text className="text-muted" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>{item.desc}</Card.Text>
//                 </Card.Body>
//                 <Card.Footer className="bg-transparent border-0 pt-0">
//                   <Button 
//                     variant="link" 
//                     className="text-primary p-0 fw-bold"
//                     style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}
//                     onClick={() => openMachineryDetails(item)}
//                   >
//                     Learn More <BiChevronRight />
//                   </Button>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </section>
//   );

//   // Compact Footer with responsive design
//   const Footer = () => (
//     <footer className="bg-dark text-white py-4">
//       <Container>
//         <Row>
//           <Col lg={4} className="mb-4 mb-lg-0">
//             <h5 className="text-warning mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Infinite Pvt. Ltd.</h5>
//             <p className="mb-3" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>
//               Innovative foam solutions for packaging, insulation, and protection needs. 
//               Quality manufacturing since 2022.
//             </p>
//             <div className="social-icons mt-3">
//               <a href="https://facebook.com" className="text-white me-2 p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
//                 <BiLogoFacebook />
//               </a>
//               <a href="https://twitter.com" className="text-white me-2 p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
//                 <BiLogoTwitter />
//               </a>
//               <a href="https://linkedin.com" className="text-white me-2 p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
//                 <BiLogoLinkedin />
//               </a>
//               <a href="https://instagram.com" className="text-white p-2 d-inline-block rounded-circle" style={{background: 'rgba(255,255,255,0.1)'}}>
//                 <BiLogoInstagram />
//               </a>
//             </div>
//           </Col>
//           <Col lg={4} className="mb-4 mb-lg-0 ps-lg-4">
//             <h5 className="text-warning mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Quick Links</h5>
//             <ul className="list-unstyled">
//               <li className="mb-2"><a href="#home" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Home</a></li>
//               <li className="mb-2"><a href="#about" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>About Us</a></li>
//               <li className="mb-2"><a href="#products" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Products</a></li>
//               <li className="mb-2"><a href="#machinery" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Machinery</a></li>
//               <li><a href="/gallery" className="text-white" style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>Place Order</a></li>
//             </ul>
//           </Col>
//           <Col lg={4} className="ps-lg-4">
//             <h5 className="text-warning mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>Contact Us</h5>
//             <address style={{fontSize: isMobile ? '0.85rem' : '0.9rem'}}>
//               <p className="mb-2"><BiMap className="me-2 text-primary" /> GIDC, Halol, Gujarat, India</p>
//               <p className="mb-2"><BiPhone className="me-2 text-primary" /> +91 9876543210</p>
//               <p className="mb-2"><BiEnvelope className="me-2 text-primary" /> info@epefoam.com</p>
//               <p><BiTime className="me-2 text-primary" /> Mon-Sat: 9:00 AM - 6:00 PM</p>
//             </address>
//           </Col>
//         </Row>
//         <hr className="my-3" />
//         <Row>
//           <Col className="text-center">
//             <p className="mb-0" style={{fontSize: isMobile ? '0.8rem' : '0.9rem'}}>
//               &copy; {new Date().getFullYear()} Infinite Pvt. Ltd. All Rights Reserved.
//             </p>
//           </Col>
//         </Row>
//       </Container>
//     </footer>
//   );
  
//   // Product Details Modal with responsive design
//   const ProductDetailsModal = () => (
//     <Modal show={showProductModal} onHide={closeProductModal} size="lg" centered>
//       {selectedProduct && (
//         <>
//           <Modal.Header closeButton className="border-0 pb-0">
//             <Modal.Title style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>{selectedProduct.title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="py-3">
//             <Row>
//               <Col md={6}>
//                 <div className="mb-3 rounded-3 overflow-hidden">
//                   <img 
//                     src={selectedProduct.img} 
//                     alt={selectedProduct.title} 
//                     className="img-fluid rounded-3 shadow-sm"
//                   />
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h4 className="text-primary mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedProduct.title}</h4>
//                 <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedProduct.desc}</p>
//                 <div className="mb-3">
//                   <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Specifications</h5>
//                   <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedProduct.specs}</p>
//                 </div>
//                 <div className="mb-3">
//                   <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Applications</h5>
//                   <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedProduct.applications}</p>
//                 </div>
//                 <div className="d-flex justify-content-between align-items-center mt-4">
//                   <h4 className="text-primary mb-0" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedProduct.price}</h4>
//                   <Button 
//                     variant="primary" 
//                     size={isMobile ? "sm" : "md"}
//                     className="px-3 rounded-pill"
//                     onClick={() => {
//                       closeProductModal();
//                       handlePlaceOrder();
//                     }}
//                   >
//                     Place Order
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Modal.Body>
//           <Modal.Footer className="border-0">
//             <Button variant="outline-secondary" onClick={closeProductModal} className="rounded-pill px-3" size={isMobile ? "sm" : "md"}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </>
//       )}
//     </Modal>
//   );

//   // Material Details Modal with responsive design
//   const MaterialDetailsModal = () => (
//     <Modal show={showMaterialModal} onHide={closeMaterialModal} size="lg" centered>
//       {selectedMaterial && (
//         <>
//           <Modal.Header closeButton className="border-0 pb-0">
//             <Modal.Title style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>{selectedMaterial.title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="py-3">
//             <Row>
//               <Col md={6}>
//                 <div className="mb-3 rounded-3 overflow-hidden">
//                   <img 
//                     src={selectedMaterial.img} 
//                     alt={selectedMaterial.title} 
//                     className="img-fluid rounded-3 shadow-sm"
//                   />
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h4 className="text-primary mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedMaterial.title}</h4>
//                 <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMaterial.details}</p>
//                 <div className="mb-3">
//                   <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Specifications</h5>
//                   <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMaterial.specifications}</p>
//                 </div>
//               </Col>
//             </Row>
//           </Modal.Body>
//           <Modal.Footer className="border-0">
//             <Button variant="outline-secondary" onClick={closeMaterialModal} className="rounded-pill px-3" size={isMobile ? "sm" : "md"}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </>
//       )}
//     </Modal>
//   );

//   // Machinery Details Modal with responsive design
//   const MachineryDetailsModal = () => (
//     <Modal show={showMachineryModal} onHide={closeMachineryModal} size="lg" centered>
//       {selectedMachinery && (
//         <>
//           <Modal.Header closeButton className="border-0 pb-0">
//             <Modal.Title style={{fontSize: isMobile ? '1.3rem' : '1.5rem'}}>{selectedMachinery.title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="py-3">
//             <Row>
//               <Col md={6}>
//                 <div className="mb-3 rounded-3 overflow-hidden">
//                   <img 
//                     src={selectedMachinery.img} 
//                     alt={selectedMachinery.title} 
//                     className="img-fluid rounded-3 shadow-sm"
//                   />
//                 </div>
//               </Col>
//               <Col md={6}>
//                 <h4 className="text-primary mb-3" style={{fontSize: isMobile ? '1.1rem' : '1.25rem'}}>{selectedMachinery.title}</h4>
//                 <p className="mb-3" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMachinery.details}</p>
//                 <div className="mb-3">
//                   <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Specifications</h5>
//                   <p className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>{selectedMachinery.specifications}</p>
//                 </div>
//                 <div className="mb-3">
//                   <h5 style={{fontSize: isMobile ? '1rem' : '1.1rem'}}>Key Features</h5>
//                   <ul className="text-muted" style={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
//                     {selectedMachinery.features.map((feature, index) => (
//                       <li key={index} className="mb-1">{feature}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </Col>
//             </Row>
//           </Modal.Body>
//           <Modal.Footer className="border-0">
//             <Button variant="outline-secondary" onClick={closeMachineryModal} className="rounded-pill px-3" size={isMobile ? "sm" : "md"}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </>
//       )}
//     </Modal>
//   );
  
//   return (
//     <div className="home-page">
//       <Banner />
//       <AboutSection />
//       <TemplateSection1 />
//       <TemplateSection2 />
//       <TemplateSection3 />
//       <ProductsSection />
//       <MachinerySection />
//       <Footer />
      
//       <ProductDetailsModal />
//       <MaterialDetailsModal />
//       <MachineryDetailsModal />
      
//       <style >{`
//         .home-page {
//           overflow-x: hidden;
//           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//         }
        
//         .stat-item {
//           background: rgba(255,255,255,0.1);
//           border-radius: 12px;
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255,255,255,0.1);
//           transition: all 0.3s ease;
//         }
        
//         .stat-item:hover {
//           transform: translateY(-5px);
//           background: rgba(255,255,255,0.15);
//         }
        
//         .text-shadow {
//           text-shadow: 2px 2px 8px rgba(0,0,0,0.6);
//         }
        
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         section {
//           position: relative;
//         }
        
//         .section-title {
//           position: relative;
//           display: inline-block;
//           margin-bottom: 2rem;
//           color: #388b6f;
//           font-size: 1.8rem;
//           font-weight: 600;
//         }
        
//         .section-title::after {
//           content: '';
//           position: absolute;
//           bottom: -10px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 60px;
//           height: 3px;
//           background: #f8b400;
//           border-radius: 2px;
//         }
        
//         .about-img-container {
//           position: relative;
//           border-radius: 12px;
//           overflow: hidden;
//           box-shadow: 0 10px 20px rgba(0,0,0,0.1);
//           transition: all 0.3s ease;
//         }
        
//         .about-img-container:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 15px 30px rgba(0,0,0,0.15);
//         }
        
//         .overlay-content {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           background: rgba(56, 139, 111, 0.9);
//           color: white;
//           transition: all 0.3s ease;
//         }
        
//         .features-list {
//           list-style-type: none;
//           padding-left: 0;
//         }
        
//         .features-list li {
//           position: relative;
//           padding-left: 30px;
//           margin-bottom: 12px;
//         }
        
//         .features-list li::before {
//           content: '✓';
//           position: absolute;
//           left: 0;
//           top: 0;
//           color: #388b6f;
//           font-weight: bold;
//           font-size: 1.1rem;
//         }
        
//         .material-card, .product-card, .machinery-card {
//           transition: all 0.3s ease;
//           border-radius: 12px;
//           overflow: hidden;
//           cursor: pointer;
//           border: none;
//         }
        
//         .material-card:hover, .product-card:hover, .machinery-card:hover {
//           transform: translateY(-8px);
//           box-shadow: 0 15px 30px rgba(0,0,0,0.1);
//         }
        
//         .card-img-container {
//           position: relative;
//           overflow: hidden;
//         }
        
//         .card-img-container .overlay-content {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(56, 139, 111, 0.7);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           opacity: 0;
//           transition: opacity 0.3s ease;
//         }
        
//         .card-img-container:hover .overlay-content {
//           opacity: 1;
//         }
        
//         /* New template section styles */
//         .process-step {
//           position: relative;
//           padding-left: 50px;
//           margin-bottom: 25px;
//         }
        
//         .step-number {
//           position: absolute;
//           left: 0;
//           top: 0;
//           width: 35px;
//           height: 35px;
//           background: #388b6f;
//           color: white;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           font-size: 1.1rem;
//         }
        
//         .feature-card {
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 5px 15px rgba(0,0,0,0.05);
//           transition: all 0.3s ease;
//         }
        
//         .feature-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
//         }
        
//         .feature-icon {
//           color: #388b6f;
//         }
        
//         footer {
//           background: linear-gradient(135deg, #1a3a3a 0%, #0d1f1f 100%);
//         }
        
//         footer a {
//           color: #fff;
//           text-decoration: none;
//           transition: color 0.3s ease;
//         }
        
//         footer a:hover {
//           color: #f8b400;
//         }
        
//         .social-icons a {
//           display: inline-block;
//           width: 40px;
//           height: 40px;
//           line-height: 40px;
//           text-align: center;
//           background: rgba(255,255,255,0.1);
//           border-radius: 50%;
//           transition: all 0.3s ease;
//         }
        
//         .social-icons a:hover {
//           background: #f8b400;
//           color: #000 !important;
//           transform: translateY(-3px);
//         }
        
//         @media (max-width: 768px) {
//           .section-title {
//             font-size: 1.5rem;
//           }
          
//           .section-title::after {
//             bottom: -8px;
//             width: 50px;
//             height: 2px;
//           }
          
//           .process-step {
//             padding-left: 40px;
//           }
          
//           .step-number {
//             width: 30px;
//             height: 30px;
//             font-size: 1rem;
//           }
          
//           .social-icons a {
//             width: 35px;
//             height: 35px;
//             line-height: 35px;
//           }
//         }
//       `}
//       </style>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { 
  BiEnvelope, BiPhone, BiMap, BiTime, 
  BiLogoFacebook, BiLogoTwitter, BiLogoLinkedin, BiLogoInstagram,
  BiChevronRight, BiAward, BiCog, BiGroup, BiCheckCircle,
  BiTrendingUp, BiStar
} from "react-icons/bi";

const Home = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMachineryModal, setShowMachineryModal] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [scrollPosition, setScrollPosition] = useState(0);
  
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const Banner = () => (
    <div 
      className="banner-premium text-white text-center d-flex align-items-center" 
      id="home"
      style={{
        background: "linear-gradient(135deg, rgba(32, 31, 31, 0.92) 0%, rgba(10, 10, 10, 0.92) 50%), url('https://engineeringcivil.org/wp-content/uploads/2023/08/pexels-photo-236709.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: isMobile ? "75vh" : "70vh",
        padding: isMobile ? "40px 0" : "60px 0",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div className="banner-pattern" />
      <Container>
        <div 
          className="banner-content"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: isMobile ? "10px" : "20px",
            position: "relative",
            zIndex: 2,
            animation: "fadeInUp 1s ease-out"
          }}
        >
          <div className="banner-badge mb-4" style={{ animation: "slideInDown 0.8s ease-out" }}>
            <span 
              className="badge-premium"
              style={{ 
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                letterSpacing: "2px",
                fontWeight: "600"
              }}
            >
              ✓ ISO 9001:2015 CERTIFIED
            </span>
          </div>
          <h1 
            className="fw-bold mb-4"
            style={{
              fontSize: isMobile ? "2.2rem" : "3.5rem",
              lineHeight: "1.2",
              letterSpacing: "-1px",
              fontWeight: "700",
              animation: "slideInUp 1s ease-out 0.2s both"
            }}
          >
            Premium EPE Foam <span style={{color: "#d4a373"}}>Solutions</span>
          </h1>
          <p 
            className="lead mb-5"
            style={{
              fontSize: isMobile ? "1rem" : "1.3rem",
              lineHeight: "1.6",
              fontWeight: "300",
              maxWidth: "700px",
              margin: "0 auto 2rem",
              animation: "slideInUp 1s ease-out 0.4s both"
            }}
          >
            Innovative, Sustainable Foam Solutions for Packaging, Insulation & Protection
          </p>
          <div className="banner-stats mb-5" style={{ animation: "slideInUp 1s ease-out 0.6s both" }}>
            <Row className="justify-content-center g-3">
              {[
                { value: "5,000+", label: "Tons Annual Capacity", icon: "📦" },
                { value: "95%", label: "Client Retention", icon: "⭐" },
                { value: "20K+", label: "Sq.Ft Facility", icon: "🏭" },
                { value: "2022", label: "Since Founding", icon: "✓" }
              ].map((stat, index) => (
                <Col md={3} sm={6} xs={6} key={index}>
                  <div 
                    className="stat-card-premium"
                    style={{
                      marginBottom: isMobile ? "10px" : "0",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{stat.icon}</div>
                    <h3 
                      style={{ 
                        fontSize: isMobile ? "1.3rem" : "1.8rem",
                        fontWeight: "700",
                        marginBottom: "6px"
                      }}
                    >
                      {stat.value}
                    </h3>
                    <p 
                      style={{ 
                        fontSize: isMobile ? "0.75rem" : "0.85rem",
                        lineHeight: "1.3",
                        fontWeight: "500",
                        opacity: "0.9"
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className={`banner-buttons ${isMobile ? 'd-grid gap-3' : 'd-flex gap-3 justify-content-center'}`} style={{ animation: "slideInUp 1s ease-out 0.8s both" }}>
            <Button 
              className="btn-premium-primary"
              href="#products"
              style={{
                width: isMobile ? "100%" : "auto",
                padding: isMobile ? "12px 24px" : "14px 40px",
                fontSize: isMobile ? "0.95rem" : "1.05rem"
              }}
            >
              Explore Products
            </Button>
            
            <Button 
              className="btn-premium-secondary"
              onClick={handlePlaceOrder}
              style={{
                width: isMobile ? "100%" : "auto",
                padding: isMobile ? "12px 24px" : "14px 40px",
                fontSize: isMobile ? "0.95rem" : "1.05rem"
              }}
            >
              Place Order Now
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
  
  const AboutSection = () => (
    <section className="about-premium py-lg-6 py-4" id="about">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">About EPE Foam</h2>
          <p className="section-subtitle-premium">Manufacturing excellence with German precision</p>
        </div>
        
        <Row className="align-items-center mb-6">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="about-img-premium position-relative rounded-4 overflow-hidden">
              <img 
                src="https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg" 
                alt="EPE Foam Production" 
                className="img-fluid w-100"
                style={{ height: isMobile ? '280px' : '400px', objectFit: 'cover' }}
              />
              <div className="overlay-badge">
                <BiCheckCircle className="me-2" />
                Quality Manufacturing
              </div>
            </div>
          </Col>
          <Col lg={6} className={isMobile ? "" : "ps-lg-5"}>
            <div className="about-content-premium">
              <h3 className="h2 mb-4" style={{color: "#1a5f4a", fontWeight: "700"}}>
                What is EPE Foam?
              </h3>
              <p className="lead-text mb-4">
                EPE foam (Expanded Polyethylene) is a versatile, lightweight plastic foam offering exceptional impact resistance, thermal insulation, and water resistance. We've been perfecting this craft since 2022.
              </p>
              <p className="body-text mb-4">
                Our state-of-the-art facility in Halol, Gujarat spans 20,000+ sq.ft with cutting-edge German extrusion technology. With annual production capacity of 5,000 tons, we serve automotive, electronics, healthcare, and consumer goods industries globally.
              </p>
              <ul className="feature-list-premium">
                <li><BiCheckCircle className="me-2 text-primary" /> Lightweight yet incredibly durable</li>
                <li><BiCheckCircle className="me-2 text-primary" /> 100% recyclable & eco-friendly</li>
                <li><BiCheckCircle className="me-2 text-primary" /> Superior thermal & acoustic properties</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="align-items-center mt-6">
          <Col lg={6} className="order-lg-2 mb-4 mb-lg-0">
            <div className="about-img-premium position-relative rounded-4 overflow-hidden">
              <img 
                src="https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg" 
                alt="Manufacturing Excellence" 
                className="img-fluid w-100"
                style={{ height: isMobile ? '280px' : '400px', objectFit: 'cover'}}
              />
              <div className="overlay-badge">
                <BiTrendingUp className="me-2" />
                Advanced Technology
              </div>
            </div>
          </Col>
          <Col lg={6} className={isMobile ? "" : "order-lg-1 pe-lg-5"}>
            <div className="about-content-premium">
              <h3 className="h2 mb-4" style={{color: "#1a5f4a", fontWeight: "700"}}>
                Why Choose Our EPE Foam?
              </h3>
              <div className="benefit-grid">
                {[
                  { icon: "🎯", title: "Superior Cushioning", desc: "Exceptional protective properties for fragile items" },
                  { icon: "♻️", title: "Eco-Friendly", desc: "100% recyclable with minimal environmental impact" },
                  { icon: "🛡️", title: "Chemical Resistant", desc: "Excellent resistance to water and moisture" },
                  { icon: "⚙️", title: "Customizable", desc: "Full control over density, thickness & dimensions" }
                ].map((benefit, i) => (
                  <div key={i} className="benefit-card-premium">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h5>{benefit.title}</h5>
                    <p className="text-muted">{benefit.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-muted">
                ISO 9001:2015 certified with 95%+ client retention. We continuously innovate to meet evolving market demands.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const ApplicationsSection = () => (
    <section className="applications-premium py-lg-6 py-4 bg-light-premium">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">EPE Foam Applications</h2>
          <p className="section-subtitle-premium">Diverse solutions for multiple industries</p>
        </div>
        <Row className="g-4">
          {[
            {
              title: "Packaging Solutions",
              img: "https://5.imimg.com/data5/SELLER/Default/2024/4/412322962/UY/NN/OM/77241131/epe-hd-foam-sheet-1000x1000.jpg",
              desc: "High-quality protection for fragile items during shipping",
              icon: "📦",
              applications: "Electronics, glassware, medical equipment"
            },
            {
              title: "Insulation Materials",
              img: "https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg",
              desc: "Thermal and acoustic insulation for pipes & HVAC",
              icon: "❄️",
              applications: "Construction, industrial piping, refrigeration"
            },
            {
              title: "Custom Die-Cut Foam",
              img: "https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg",
              desc: "Precision-cut shapes for specific requirements",
              icon: "✂️",
              applications: "Product-specific packaging, medical devices"
            }
          ].map((item, index) => (
            <Col lg={4} md={6} key={index}>
              <div className="application-card-premium">
                <div className="card-image-premium">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                  />
                  <div className="card-icon-badge">{item.icon}</div>
                </div>
                <div className="card-body-premium">
                  <h4 className="mb-3">{item.title}</h4>
                  <p className="desc-text mb-3">{item.desc}</p>
                  <p className="applications-text"><strong>Uses:</strong> {item.applications}</p>
                  <Button 
                    className="btn-link-premium"
                    onClick={() => openProductDetails({
                      title: item.title,
                      img: item.img,
                      desc: item.desc,
                      price: "Custom Pricing",
                      specs: "Available in various specifications",
                      applications: item.applications
                    })}
                  >
                    Learn More <BiChevronRight />
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const ProcessSection = () => (
    <section className="process-premium py-lg-6 py-4">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">Our Manufacturing Process</h2>
          <p className="section-subtitle-premium">Precision engineering at every stage</p>
        </div>
        <Row className="align-items-center g-4">
          <Col lg={5}>
            {[
              { num: "01", title: "Material Preparation", desc: "High-quality polyethylene resin mixed with premium additives" },
              { num: "02", title: "German Extrusion", desc: "Advanced machinery ensures consistent foam sheet quality" },
              { num: "03", title: "Quality Testing", desc: "Rigorous testing of density, thickness & performance" },
              { num: "04", title: "Custom Processing", desc: "Die-cutting, lamination & finishing as needed" }
            ].map((step, i) => (
              <div key={i} className="process-step-premium mb-4">
                <div className="step-number-premium">{step.num}</div>
                <div className="step-content-premium">
                  <h5 className="mb-2">{step.title}</h5>
                  <p className="text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </Col>
          <Col lg={7}>
            <div className="process-image-premium">
              <img 
                src="https://lzjinlida.com/images/hero-bg.jpg" 
                alt="Manufacturing Process" 
                className="img-fluid rounded-4 shadow-lg"
                style={{ width: '100%', height: '500px', objectFit: 'cover' }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );

  const WhyChooseSection = () => (
    <section className="why-choose-premium py-lg-6 py-4 bg-light-premium">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">Why Choose Infinite?</h2>
          <p className="section-subtitle-premium">Excellence in every aspect</p>
        </div>
        <Row className="g-4">
          {[
            { icon: <BiAward />, title: "Quality Certified", desc: "ISO 9001:2015 certified with rigorous quality control", color: "#1a5f4a" },
            { icon: <BiCog />, title: "Advanced Technology", desc: "State-of-the-art German machinery for consistency", color: "#3a7ca5" },
            { icon: <BiGroup />, title: "Expert Team", desc: "Experienced professionals with deep industry knowledge", color: "#d4a373" },
            { icon: <BiTrendingUp />, title: "Rapid Growth", desc: "Trusted by 500+ clients across multiple industries", color: "#1a5f4a" }
          ].map((feature, i) => (
            <Col lg={3} md={6} key={i}>
              <div className="why-choose-card-premium">
                <div className="feature-icon-premium" style={{color: feature.color}}>
                  {feature.icon}
                </div>
                <h5 className="mt-3 mb-2">{feature.title}</h5>
                <p className="text-muted">{feature.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const MaterialsSection = () => (
    <section className="materials-premium py-lg-6 py-4">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">Raw Materials</h2>
          <p className="section-subtitle-premium">Premium inputs for premium outputs</p>
        </div>
        <Row className="g-4">
          {[
            { title: "Virgin LDPE Resin", desc: "High-grade polyethylene for premium quality", icon: "🔬" },
            { title: "Color Masterbatch", desc: "Custom colors matching your brand requirements", icon: "🎨" },
            { title: "Specialty Additives", desc: "Fire retardants, UV stabilizers, anti-static agents", icon: "⚗️" },
            { title: "Recycled Materials", desc: "Post-industrial recycled content for sustainability", icon: "♻️" }
          ].map((mat, i) => (
            <Col lg={3} md={6} key={i}>
              <div className="material-card-premium">
                <div className="material-icon">{mat.icon}</div>
                <h5>{mat.title}</h5>
                <p className="text-muted">{mat.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const ProductsSection = () => (
    <section className="products-premium py-lg-6 py-4 bg-light-premium" id="products">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">Our Products</h2>
          <p className="section-subtitle-premium">Tailored solutions for every need</p>
        </div>
        <Row className="g-4">
          {[
            {
              id: 1,
              img: "https://m.media-amazon.com/images/I/71iHgQ+TztL._AC_SL1500_.jpg",
              title: "EPE Foam Sheets",
              desc: "Available in various thicknesses from 1mm to 100mm",
              price: "₹150 - ₹800",
              rating: 4.8,
              specs: "Thickness: 1-100mm | Density: 20-45 kg/m³",
              applications: "Packaging, insulation, cushioning"
            },
            {
              id: 2,
              img: "https://5.imimg.com/data5/SELLER/Default/2024/5/416707878/ZH/IW/JU/189342/white-epe-foam-1000x1000.png",
              title: "EPE Foam Rolls",
              desc: "Continuous rolls for packaging lines",
              price: "₹120 - ₹600",
              rating: 4.9,
              specs: "Thickness: 2-50mm | Width: 1-2m",
              applications: "Industrial packaging, void fill"
            },
            {
              id: 3,
              img: "https://www.furnituredirect.com.my/wp-content/uploads/2024/01/DREAMCATCHER-CLOUD-7.jpg",
              title: "Custom Die-Cut",
              desc: "Precision-cut for product-specific protection",
              price: "Custom",
              rating: 4.7,
              specs: "Custom shapes and sizes",
              applications: "Product-specific packaging"
            },
            {
              id: 4,
              img: "https://c8.alamy.com/comp/2EPM50M/quality-mattress-materials-variety-for-comfort-and-durability-cutting-edge-technology-inner-layers-3d-scheme-vector-illustration-2EPM50M.jpg",
              title: "Pipe Insulation",
              desc: "Thermal & acoustic insulation for pipes",
              price: "₹250 - ₹1200",
              rating: 4.8,
              specs: "Diameter: 1/2\" to 12\" | Temp: -50°C to 110°C",
              applications: "HVAC systems, plumbing"
            }
          ].map((product) => (
            <Col lg={3} md={6} key={product.id}>
              <div className="product-card-premium">
                <div className="product-image-premium">
                  <img 
                    src={product.img}
                    alt={product.title}
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                  <div className="rating-badge">
                    <BiStar /> {product.rating}
                  </div>
                </div>
                <div className="product-body-premium">
                  <h5 className="mb-2">{product.title}</h5>
                  <p className="desc-text mb-3">{product.desc}</p>
                  <div className="price-section mb-3">
                    <span className="price-text fw-bold">{product.price}</span>
                  </div>
                  <Button 
                    className="btn-order-premium w-100"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const MachinerySection = () => (
    <section className="machinery-premium py-lg-6 py-4" id="machinery">
      <Container>
        <div className="section-header text-center mb-5">
          <h2 className="section-title-premium">Advanced Machinery</h2>
          <p className="section-subtitle-premium">State-of-the-art equipment powering our production</p>
        </div>
        <Row className="g-4">
          {[
            {
              title: "EPE Foam Extruder",
              desc: "German technology with 5,000 tons annual capacity",
              icon: "⚙️",
              specs: "Speed: 200 m/min | Accuracy: ±0.1mm"
            },
            {
              title: "CNC Cutting Machine",
              desc: "Precision cutting with ±0.5mm tolerance",
              icon: "✂️",
              specs: "3D cutting | Max thickness: 100mm"
            },
            {
              title: "Lamination System",
              desc: "Multi-layer foam bonding with precision",
              icon: "🔗",
              specs: "Up to 5 layers | Temp: 50-200°C"
            },
            {
              title: "Quality Control",
              desc: "Automated testing for consistency",
              icon: "✓",
              specs: "100 samples/hour | <0.1% rejection"
            }
          ].map((machine, i) => (
            <Col lg={3} md={6} key={i}>
              <div className="machinery-card-premium">
                <div className="machinery-icon">{machine.icon}</div>
                <h5>{machine.title}</h5>
                <p className="desc-text mb-2">{machine.desc}</p>
                <p className="specs-text">{machine.specs}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );

  const Footer = () => (
    <footer className="footer-premium text-white py-5">
      <Container>
        <Row className="mb-4">
          <Col lg={4} className="mb-4 mb-lg-0">
            <h5 className="text-accent mb-3 fw-bold">Infinite Pvt. Ltd.</h5>
            <p className="footer-desc mb-3">
              Premium foam solutions for packaging, insulation & protection. Quality manufacturing since 2022.
            </p>
            <div className="social-links">
              {[
                { icon: BiLogoFacebook, url: "https://facebook.com" },
                { icon: BiLogoTwitter, url: "https://twitter.com" },
                { icon: BiLogoLinkedin, url: "https://linkedin.com" },
                { icon: BiLogoInstagram, url: "https://instagram.com" }
              ].map((social, i) => (
                <a key={i} href={social.url} className="social-icon" target="_blank" rel="noopener noreferrer">
                  <social.icon />
                </a>
              ))}
            </div>
          </Col>
          <Col lg={4} className="mb-4 mb-lg-0">
            <h5 className="text-accent mb-3 fw-bold">Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#machinery">Machinery</a></li>
            </ul>
          </Col>
          <Col lg={4}>
            <h5 className="text-accent mb-3 fw-bold">Contact</h5>
            <div className="contact-info">
              <p className="mb-2"><BiMap className="me-2" /> GIDC, Halol, Gujarat, India</p>
              <p className="mb-2"><BiPhone className="me-2" /> +91 9876543210</p>
              <p className="mb-2"><BiEnvelope className="me-2" /> info@epefoam.com</p>
              <p><BiTime className="me-2" /> Mon-Sat: 9:00 AM - 6:00 PM</p>
            </div>
          </Col>
        </Row>
        <hr className="my-4" style={{opacity: 0.2}} />
        <Row>
          <Col className="text-center">
            <p className="mb-0 footer-copyright">
              © {new Date().getFullYear()} Infinite Pvt. Ltd. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
  
  const ProductDetailsModal = () => (
    <Modal show={showProductModal} onHide={closeProductModal} size="lg" centered className="modal-premium">
      {selectedProduct && (
        <>
          <Modal.Header closeButton className="border-0 bg-light-premium">
            <Modal.Title className="fw-bold" style={{color: "#1a5f4a"}}>{selectedProduct.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <Row>
              <Col md={6}>
                <div className="rounded-4 overflow-hidden shadow-sm">
                  <img 
                    src={selectedProduct.img} 
                    alt={selectedProduct.title} 
                    className="img-fluid w-100"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                </div>
              </Col>
              <Col md={6}>
                <h4 className="mb-3" style={{color: "#1a5f4a"}}>{selectedProduct.title}</h4>
                <p className="mb-4">{selectedProduct.desc}</p>
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Specifications</h6>
                  <p className="text-muted">{selectedProduct.specs}</p>
                </div>
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Applications</h6>
                  <p className="text-muted">{selectedProduct.applications}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0" style={{color: "#d4a373"}}>{selectedProduct.price}</h5>
                  <Button 
                    className="btn-premium-primary"
                    onClick={() => {
                      closeProductModal();
                      handlePlaceOrder();
                    }}
                  >
                    Order Now
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </>
      )}
    </Modal>
  );
  
  return (
    <div className="home-page-premium">
      <Banner />
      <AboutSection />
      <ApplicationsSection />
      <ProcessSection />
      <WhyChooseSection />
      <MaterialsSection />
      <ProductsSection />
      <MachinerySection />
      <Footer />
      <ProductDetailsModal />
      
      <style>{` 
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Theme variables moved to src/theme.css */

        .home-page-premium {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--text-dark);
          overflow-x: hidden;
        }

        /* ===== BANNER ===== */
        .banner-premium {
          position: relative;
          background-attachment: fixed;
        }

        .banner-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0,50 Q25,25 50,50 T100,50" stroke="rgba(255,255,255,0.05)" fill="none" stroke-width="0.5"/></svg>');
          opacity: 0.3;
        }

        .badge-premium {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 8px 20px;
          border-radius: 50px;
          color: white;
          backdrop-filter: blur(10px);
        }

        .stat-card-premium {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 24px 16px;
          border-radius: 16px;
          backdrop-filter: blur(15px);
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .stat-card-premium h3 {
          font-weight: 700;
        }

        .btn-premium-primary, .btn-premium-secondary {
          border: none;
          border-radius: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
        }

        .btn-premium-primary {
          background: linear-gradient(135deg, var(--accent-color) 0%, #c89c6a 100%);
          color: white;
        }

        .btn-premium-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(212, 163, 115, 0.4);
        }

        .btn-premium-secondary {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
        }

        .btn-premium-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-3px);
        }

        /* ===== SECTION HEADERS ===== */
        .section-header {
          margin-bottom: 3rem;
        }

        .section-title-premium {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
          position: relative;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .section-title-premium::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-color) 0%, var(--secondary-color) 100%);
          border-radius: 2px;
        }

        .section-subtitle-premium {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-top: 1.5rem;
          font-weight: 400;
        }

        /* ===== ABOUT SECTION ===== */
        .about-premium {
          position: relative;
          z-index: 1;
        }

        .about-img-premium {
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(26, 95, 74, 0.15);
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          aspect-ratio: 4/3;
        }

        .about-img-premium img {
          transition: transform 0.8s ease;
        }

        .about-img-premium:hover img {
          transform: scale(1.05);
        }

        .overlay-badge {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(26, 95, 74, 0.95) 100%);
          color: white;
          padding: 24px 20px;
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .lead-text {
          font-size: 1.15rem;
          color: var(--text-dark);
          font-weight: 400;
          line-height: 1.8;
        }

        .body-text {
          font-size: 1rem;
          color: var(--text-light);
          line-height: 1.8;
        }

        .feature-list-premium {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .feature-list-premium li {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          font-size: 1rem;
          color: var(--text-dark);
        }

        .feature-list-premium .bi {
          color: var(--primary-color);
          font-size: 1.3rem;
        }

        /* ===== BENEFIT GRID ===== */
        .benefit-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 1.5rem;
        }

        .benefit-card-premium {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .benefit-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(26, 95, 74, 0.1);
        }

        .benefit-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .benefit-card-premium h5 {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--primary-color);
        }

        /* ===== APPLICATION CARDS ===== */
        .applications-premium {
          position: relative;
          z-index: 1;
        }

        .application-card-premium {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid #f0f0f0;
        }

        .application-card-premium:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 50px rgba(26, 95, 74, 0.15);
        }

        .card-image-premium {
          position: relative;
          overflow: hidden;
          height: 250px;
        }

        .card-image-premium img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .application-card-premium:hover .card-image-premium img {
          transform: scale(1.08);
        }

        .card-icon-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 2.5rem;
          background: white;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .card-body-premium {
          padding: 28px;
        }

        .card-body-premium h4 {
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 12px;
          font-size: 1.3rem;
        }

        .desc-text {
          font-size: 0.95rem;
          color: var(--text-dark);
          line-height: 1.6;
        }

        .applications-text {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 16px !important;
        }

        .btn-link-premium {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 600;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-link-premium:hover {
          color: var(--accent-color);
          transform: translateX(4px);
        }

        /* ===== PROCESS SECTION ===== */
        .process-premium {
          position: relative;
          z-index: 1;
        }

        .process-step-premium {
          display: flex;
          gap: 20px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border-left: 4px solid var(--accent-color);
          transition: all 0.3s ease;
        }

        .process-step-premium:hover {
          box-shadow: 0 10px 30px rgba(26, 95, 74, 0.08);
          transform: translateX(8px);
        }

        .step-number-premium {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-color);
          min-width: 50px;
          text-align: center;
        }

        .step-content-premium h5 {
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 8px;
        }

        .step-content-premium p {
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.6;
        }

        .process-image-premium {
          margin-top: 20px;
        }

        /* ===== WHY CHOOSE SECTION ===== */
        .why-choose-card-premium {
          background: white;
          padding: 32px 24px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid #f0f0f0;
        }

        .why-choose-card-premium:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(26, 95, 74, 0.12);
        }

        .feature-icon-premium {
          font-size: 3rem;
          margin-bottom: 16px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .why-choose-card-premium h5 {
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 12px;
        }

        .why-choose-card-premium p {
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.6;
        }

        /* ===== MATERIALS SECTION ===== */
        .material-card-premium {
          background: white;
          padding: 28px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .material-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(26, 95, 74, 0.1);
        }

        .material-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .material-card-premium h5 {
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 10px;
        }

        /* ===== PRODUCTS SECTION ===== */
        .products-premium {
          position: relative;
          z-index: 1;
        }

        .product-card-premium {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card-premium:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 50px rgba(26, 95, 74, 0.15);
        }

        .product-image-premium {
          position: relative;
          overflow: hidden;
          height: 220px;
        }

        .product-image-premium img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .product-card-premium:hover .product-image-premium img {
          transform: scale(1.1);
        }

        .rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: white;
          color: var(--accent-color);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .product-body-premium {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .product-body-premium h5 {
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 10px;
          font-size: 1.15rem;
        }

        .price-section {
          margin-top: auto;
        }

        .price-text {
          color: var(--accent-color);
          font-size: 1.2rem;
        }

        .btn-order-premium {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          padding: 11px 20px;
          transition: all 0.3s ease;
        }

        .btn-order-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(26, 95, 74, 0.3);
        }

        /* ===== MACHINERY SECTION ===== */
        .machinery-card-premium {
          background: white;
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
          text-align: center;
        }

        .machinery-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(26, 95, 74, 0.1);
        }

        .machinery-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .machinery-card-premium h5 {
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 12px;
        }

        .specs-text {
          font-size: 0.85rem;
          color: var(--accent-color);
          font-weight: 500;
        }

        /* ===== FOOTER ===== */
        .footer-premium {
          background: linear-gradient(135deg, var(--dark-color) 0%, var(--primary-color) 100%);
          position: relative;
          z-index: 1;
        }

        .text-accent {
          color: var(--accent-color) !important;
        }

        .footer-desc {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: white;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .social-icon:hover {
          background: var(--accent-color);
          color: var(--dark-color);
          transform: translateY(-4px);
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .footer-links a:hover {
          color: var(--accent-color);
          transform: translateX(4px);
          display: inline-block;
        }

        .contact-info {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .contact-info p {
          display: flex;
          align-items: center;
        }

        .footer-copyright {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* ===== UTILITIES ===== */
        .bg-light-premium {
          background: var(--light-bg);
        }

        .py-lg-6 {
          padding-top: 4rem !important;
          padding-bottom: 4rem !important;
        }

        .mb-6 {
          margin-bottom: 3rem !important;
        }

        .mt-6 {
          margin-top: 3rem !important;
        }

        .pe-lg-5 {
          padding-right: 3rem !important;
        }

        .ps-lg-5 {
          padding-left: 3rem !important;
        }

        .rounded-4 {
          border-radius: 16px !important;
        }

        /* ===== ANIMATIONS ===== */
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

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== MODAL ===== */
        .modal-premium .modal-content {
          border: 1px solid #f0f0f0;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(26, 95, 74, 0.15);
        }

        .modal-premium .modal-header {
          border-bottom: 1px solid #f0f0f0;
        }

        .modal-premium .modal-footer {
          border-top: 1px solid #f0f0f0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .section-title-premium {
            font-size: 1.8rem;
          }

          .section-title-premium::after {
            width: 60px;
            height: 3px;
          }

          .benefit-grid {
            grid-template-columns: 1fr;
          }

          .py-lg-6 {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }

          .pe-lg-5, .ps-lg-5 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .process-image-premium {
            margin-top: 30px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
