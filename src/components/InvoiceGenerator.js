 
// import React from "react";
// import jsPDF from "jspdf";

// export default function InvoiceGenerator({ order }) {
//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Order Invoice", 20, 20);
//     doc.text(`Order ID: ${order.orderId}`, 20, 30);
//     doc.text(`Product: ${order.product?.name || "Unknown"}`, 20, 40);
//     doc.text(`Quantity: ${order.quantity}`, 20, 50);
//     doc.text(`Total: $${order.total_amount}`, 20, 60);
//     doc.text(`Address: ${order.address}`, 20, 70);
//     doc.text(`Phone: ${order.phone}`, 20, 80);
//     // Remove or safely access user
//     // doc.text(`Customer: ${order.user?.username || "Unknown"}`, 20, 90);
//     doc.save("invoice.pdf");
//   };

//   return (
//     <button
//       style={{
//         marginTop: "14px",
//         background: "#2d6a4f",
//         color: "#fff",
//         border: "none",
//         padding: "10px 20px",
//         borderRadius: "6px",
//         cursor: "pointer"
//       }}
//       onClick={downloadPDF}
//     >
//       Download Invoice PDF
//     </button>
//   );
// }
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function InvoiceGenerator({ order }) {
  const downloadPDF = () => {
    const doc = new jsPDF();
    const taxRate = 0.18; // 18% GST
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    
    // Parse amounts as numbers
    const totalAmount = parseFloat(order.total_amount);
    const subtotal = totalAmount / (1 + taxRate);
    const tax = subtotal * taxRate;
    const unitPrice = subtotal / parseInt(order.quantity);

    // Set default styles
    doc.setFont("helvetica");
    doc.setTextColor(40, 40, 40);

    // Company Header
    doc.setFillColor(45, 106, 79);
    doc.rect(0, 0, pageWidth, 35, "F");
    
    // Company Name
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("INFINITE PRIVATE LIMITED COMPANY", pageWidth / 2, 15, null, null, "center");
    
    // Company Info
    doc.setFontSize(9);
    doc.setTextColor(220, 255, 220);
    doc.text("GIDC, Halol, Gujarat", pageWidth / 2, 22, null, null, "center");
    doc.text("Phone: (+91) 8140463137 | Email: pateldhruv20065@gmail.com", pageWidth / 2, 27, null, null, "center");
    doc.text("GSTIN: 27ABCDE1234F1Z5", pageWidth / 2, 32, null, null, "center");

    // Invoice Title
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(45, 106, 79);
    doc.text("TAX INVOICE", pageWidth / 2, 50, null, null, "center");

    // Reset text settings
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(40, 40, 40);

    // Invoice Details
    const invDetailsY = 60;
    doc.text(`Invoice Number: GM-${order.orderId}`, margin, invDetailsY);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, margin, invDetailsY + 6);
    doc.text(`Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, margin, invDetailsY + 12);

    // Customer Details
    const custDetailsY = 60;
    const custX = pageWidth - margin - 80;
    doc.text("Bill To:", custX, custDetailsY);
    doc.setFont(undefined, "normal");
    
    // Split address into multiple lines if needed
    const splitAddress = doc.splitTextToSize(order.address || "", 80);
    doc.text(splitAddress, custX, custDetailsY + 6);
    
    // Position phone below address
    const phoneY = custDetailsY + 6 + (splitAddress.length * 5);
    doc.text(`Phone: ${order.phone}`, custX, phoneY);

    // Table Configuration
    const tableColumns = [
      { header: "Description", dataKey: "description" },
      { header: "HSN Code", dataKey: "hsn" },
      { header: "Qty", dataKey: "qty" },
      { header: "Unit Price", dataKey: "unitPrice" },
      { header: "Amount", dataKey: "amount" }
    ];

    const tableRows = [
      {
        description: order.product?.name || "Unknown Product",
        hsn: "123456",
        qty: order.quantity.toString(),
        unitPrice: `$${unitPrice.toFixed(2)}`,
        amount: `$${subtotal.toFixed(2)}`
      }
    ];

    // Summary Rows
    const summaryRows = [
      { 
        description: "Subtotal:", 
        amount: `$${subtotal.toFixed(2)}`,
        styles: { fontStyle: "bold", halign: "right", cellPadding: { top: 5 } }
      },
      { 
        description: `GST (${(taxRate * 100).toFixed(0)}%):`, 
        amount: `$${tax.toFixed(2)}`,
        styles: { fontStyle: "bold", halign: "right" }
      },
      { 
        description: "Shipping:", 
        amount: "$0.00",
        styles: { halign: "right" }
      },
      { 
        description: "Total Amount:", 
        amount: `$${totalAmount.toFixed(2)}`,
        styles: { fontStyle: "bold", halign: "right", fillColor: [240, 240, 240] }
      }
    ];

    // Table Start Position (adjust based on content height)
    const tableY = Math.max(phoneY + 15, invDetailsY + 30);

    // Generate main table
    doc.autoTable({
      columns: tableColumns,
      body: tableRows,
      startY: tableY,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: "middle",
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [45, 106, 79],
        textColor: 255,
        fontStyle: "bold",
        halign: "center"
      },
      columnStyles: {
        description: { cellWidth: 70 },
        hsn: { halign: "center" },
        qty: { halign: "center" },
        unitPrice: { halign: "right" },
        amount: { halign: "right" }
      },
      theme: "grid"
    });

    // Get position after main table
    const summaryY = doc.lastAutoTable.finalY;

    // Generate summary table
    doc.autoTable({
      columns: [
        { dataKey: "description" },
        { dataKey: "amount" }
      ],
      body: summaryRows,
      startY: summaryY,
      margin: { left: margin, right: margin },
      showHead: false,
      columnStyles: {
        description: { cellWidth: 130, fontStyle: "bold" },
        amount: { halign: "right" }
      },
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineColor: [200, 200, 200]
      },
      theme: "plain"
    });

    // Get position after summary table
    const finalY = doc.lastAutoTable.finalY + 10;

    // Payment Terms
    doc.setFontSize(9);
    doc.text("Payment Terms: Net 30 days", margin, finalY);
    doc.text("Late payments subject to 1.5% monthly interest", margin, finalY + 5);

    // Notes
    doc.text("Notes:", margin, finalY + 15);
    doc.text("• Goods sold are not returnable", margin + 5, finalY + 20);
    doc.text("• Please make payment within the due date", margin + 5, finalY + 25);

    // Authorization
    doc.text("Authorized Signature", pageWidth - margin - 50, finalY + 40);
    doc.line(pageWidth - margin - 60, finalY + 45, pageWidth - margin, finalY + 45);

    // Footer
    const footerY = finalY + 55;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your business! • Terms & Conditions Apply", pageWidth / 2, footerY + 5, null, null, "center");
    doc.text("© 2023 Infinite Private Limited. All rights reserved", pageWidth / 2, footerY + 12, null, null, "center");
    doc.text("This is a computer generated invoice", pageWidth / 2, footerY + 19, null, null, "center");

    doc.save(`invoice_${order.orderId}.pdf`);
  };

  return (
    <button
      style={{
        marginTop: "14px",
        background: "#2d6a4f",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
      onMouseOver={(e) => e.target.style.background = "#1d4d3a"}
      onMouseOut={(e) => e.target.style.background = "#2d6a4f"}
      onClick={downloadPDF}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16L12 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 12L12 16L17 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 20L21 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Download Invoice PDF
    </button>
  );
}