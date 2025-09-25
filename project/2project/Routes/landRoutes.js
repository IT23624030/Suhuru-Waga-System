const express = require('express');
const router = express.Router();
const Land = require('../Model/Land');
const upload = require('../middleware/upload');
const Parser = require('json2csv').Parser;
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs'); 
const path = require('path');

// Utility function to convert image to base64
function getImageBase64(imagePath) {
  try {
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      const imageExt = path.extname(imagePath).toLowerCase();
      const mimeType = imageExt === '.jpeg' || imageExt === '.jpg' ? 'image/jpeg' : 'image/png';
      return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    }
  } catch (error) {
    console.log('Error loading image:', error.message);
  }
  return null;
}

// Enhanced PDF generation function with improved design and content
function generateProfessionalPDF(land, bids, analytics) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Enhanced color scheme
  const colors = {
    primary: [41, 128, 185],      // Professional blue
    secondary: [52, 73, 94],      // Dark blue-gray
    accent: [231, 76, 60],        // Attention red
    success: [39, 174, 96],       // Success green
    warning: [243, 156, 18],      // Warning orange
    light: [248, 249, 250],       // Light gray
    text: [52, 58, 64],           // Text color
    muted: [108, 117, 125]        // Muted text
  };
  
  // Enhanced header section
  function addEnhancedHeader() {
    // Background gradient effect
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Company logo placeholder (if available)
    const logoPath = path.join(__dirname, '../uploads/logo.png');
    const logoBase64 = getImageBase64(logoPath);
    
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, 'PNG', 15, 8, 35, 35);
      } catch (error) {
        console.log('Logo not found, using text header');
      }
    }
    
    // Company name and branding
    doc.setFontSize(24);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('SUHURU BID', logoBase64 ? 60 : 20, 25);
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.secondary);
    doc.setFont(undefined, 'normal');
    doc.text('Agricultural Land Trading Platform', logoBase64 ? 60 : 20, 33);
    doc.text('Professional Bidding Management System', logoBase64 ? 60 : 20, 40);
    
    // Contact information
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    const contactInfo = [
      'Email: support@suhuru.lk',
      'Phone: +94 11 234 5678',
      'Web: www.suhuru.lk'
    ];
    
    contactInfo.forEach((info, index) => {
      doc.text(info, pageWidth - 15, 20 + (index * 6), { align: 'right' });
    });
    
    // Decorative line
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(3);
    doc.line(15, 48, pageWidth - 15, 48);
    
    // Sub-line with accent color
    doc.setDrawColor(...colors.success);
    doc.setLineWidth(1);
    doc.line(15, 50, pageWidth - 15, 50);
  }
  
  // Report title and metadata
  function addReportTitle() {
    doc.setFontSize(20);
    doc.setTextColor(...colors.secondary);
    doc.setFont(undefined, 'bold');
    doc.text('LAND BIDDING REPORT', 20, 65);
    
    // Report metadata
    const reportData = [
      { label: 'Report ID:', value: `LND-${land._id?.toString().slice(-8) || 'UNKNOWN'}` },
      { label: 'Generated:', value: new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })},
      { label: 'Status:', value: land.isBiddingActive ? 'Active Bidding' : 'Bidding Closed' }
    ];
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.muted);
    doc.setFont(undefined, 'normal');
    
    reportData.forEach((item, index) => {
      const yPos = 75 + (index * 6);
      doc.setFont(undefined, 'bold');
      doc.text(item.label, pageWidth - 80, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(item.value, pageWidth - 80 + doc.getTextWidth(item.label) + 2, yPos);
    });
  }
  
  // Enhanced land information section
  function addLandInformation() {
    let yPos = 100;
    
    // Section title
    doc.setFontSize(16);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('🏞️ LAND INFORMATION', 20, yPos);
    
    // Background for land info
    doc.setFillColor(...colors.light);
    doc.roundedRect(15, yPos + 5, pageWidth - 30, 70, 5, 5, 'F');
    
    yPos += 20;
    
    // Land details in organized layout
    const landDetails = [
      { icon: '👤', label: 'Owner Name:', value: land.ownerName || 'N/A' },
      { icon: '📐', label: 'Area:', value: `${land.area || 0} acres` },
      { icon: '🌱', label: 'Soil Type:', value: land.soilType || 'N/A' },
      { icon: '💰', label: 'Base Amount:', value: `$${(land.amount || 0).toLocaleString()}`, isAmount: true },
      { icon: '📍', label: 'Location:', value: land.location?.address || 'N/A' },
      { icon: '📅', label: 'Listed Date:', value: land.createdAt ? new Date(land.createdAt).toLocaleDateString() : 'N/A' }
    ];
    
    doc.setFontSize(11);
    
    landDetails.forEach((detail, index) => {
      const xPos = index % 2 === 0 ? 25 : pageWidth / 2 + 10;
      const currentYPos = yPos + Math.floor(index / 2) * 12;
      
      // Icon and label
      doc.setTextColor(...colors.secondary);
      doc.setFont(undefined, 'bold');
      doc.text(`${detail.icon} ${detail.label}`, xPos, currentYPos);
      
      // Value
      doc.setFont(undefined, 'normal');
      if (detail.isAmount) {
        doc.setTextColor(...colors.success);
        doc.setFont(undefined, 'bold');
      } else {
        doc.setTextColor(...colors.text);
      }
      
      const valueText = detail.value.length > 25 ? detail.value.substring(0, 25) + '...' : detail.value;
      doc.text(valueText, xPos + doc.getTextWidth(`${detail.icon} ${detail.label}`) + 3, currentYPos);
    });
    
    // Resources section
    if (land.resources && land.resources.length > 0) {
      yPos += 50;
      doc.setFontSize(12);
      doc.setTextColor(...colors.secondary);
      doc.setFont(undefined, 'bold');
      doc.text('🔧 Available Resources:', 25, yPos);
      
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      doc.setFont(undefined, 'normal');
      const resourcesText = land.resources.join(' • ');
      const resourceLines = doc.splitTextToSize(resourcesText, pageWidth - 50);
      doc.text(resourceLines, 25, yPos + 8);
      
      yPos += 8 + (resourceLines.length * 5);
    }
    
    return yPos + 20;
  }
  
  // Enhanced analytics section with visual elements
  function addAnalyticsSection(yPos) {
    doc.setFontSize(16);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('📊 BIDDING ANALYTICS', 20, yPos);
    
    yPos += 15;
    
    // Analytics cards
    const analyticsData = [
      { title: 'Total Bids', value: analytics.totalBids.toString(), color: colors.primary, icon: '📝' },
      { title: 'Highest Bid', value: `$${analytics.highestBid.toLocaleString()}`, color: colors.success, icon: '🏆' },
      { title: 'Average Bid', value: `$${Math.round(analytics.averageBidAmount).toLocaleString()}`, color: colors.warning, icon: '📈' },
      { title: 'Total Amount', value: `$${analytics.totalBidAmount.toLocaleString()}`, color: colors.accent, icon: '💎' }
    ];
    
    const cardWidth = (pageWidth - 50) / 4;
    const cardHeight = 35;
    
    analyticsData.forEach((item, index) => {
      const xPos = 20 + (index * (cardWidth + 5));
      
      // Card background
      doc.setFillColor(...item.color);
      doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, 'F');
      
      // Icon
      doc.setFontSize(16);
      doc.text(item.icon, xPos + 5, yPos + 15);
      
      // Value
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text(item.value, xPos + cardWidth / 2, yPos + 18, { align: 'center' });
      
      // Title
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(item.title.toUpperCase(), xPos + cardWidth / 2, yPos + 28, { align: 'center' });
    });
    
    // Highest bidder information
    if (analytics.highestBidder) {
      yPos += 50;
      doc.setFillColor(255, 248, 220);
      doc.roundedRect(20, yPos, pageWidth - 40, 20, 3, 3, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(...colors.warning);
      doc.setFont(undefined, 'bold');
      doc.text('🥇 Highest Bidder:', 25, yPos + 8);
      
      doc.setTextColor(...colors.text);
      doc.setFont(undefined, 'normal');
      doc.text(`${analytics.highestBidder.bidderName} (${analytics.highestBidder.mobileNumber})`, 25, yPos + 16);
    }
    
    return yPos + 35;
  }
  
  // Enhanced bids table
  function addBidsTable(yPos) {
    if (bids.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(...colors.muted);
      doc.text('No bids available for this land.', 20, yPos);
      return yPos + 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text(`💼 DETAILED BIDS (${bids.length} Total)`, 20, yPos);
    
    yPos += 10;
    
    const tableData = bids.map((bid, index) => [
      (index + 1).toString(),
      index === 0 ? '🏆' : '',
      bid.bidderName || 'N/A',
      bid.mobileNumber ? bid.mobileNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : 'N/A',
      `$${(bid.bidAmount || 0).toLocaleString()}`,
      bid.timestamp ? new Date(bid.timestamp).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }) : 'N/A'
    ]);
    
    doc.autoTable({
      head: [['Rank', 'Status', 'Bidder Name', 'Contact', 'Bid Amount', 'Date & Time']],
      body: tableData,
      startY: yPos + 5,
      styles: {
        fontSize: 9,
        cellPadding: 5,
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
        textColor: colors.text
      },
      headStyles: {
        fillColor: colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'center', cellWidth: 15 },
        2: { cellWidth: 40 },
        3: { cellWidth: 35, halign: 'center' },
        4: { halign: 'right', cellWidth: 30, textColor: colors.success, fontStyle: 'bold' },
        5: { halign: 'center', cellWidth: 35, fontSize: 8 }
      },
      didParseCell: function(data) {
        // Highlight highest bid row
        if (data.row.index === 0 && data.section === 'body') {
          data.cell.styles.fillColor = [255, 248, 220];
          data.cell.styles.textColor = [133, 100, 4];
        }
      }
    });
    
    return doc.lastAutoTable.finalY + 10;
  }
  
  // Enhanced footer
  function addFooter() {
    const footerY = pageHeight - 25;
    
    // Footer background
    doc.setFillColor(...colors.light);
    doc.rect(0, footerY - 10, pageWidth, 35, 'F');
    
    // Footer border
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 10, pageWidth - 15, footerY - 10);
    
    // Company info
    doc.setFontSize(9);
    doc.setTextColor(...colors.secondary);
    doc.setFont(undefined, 'bold');
    doc.text('SUHURU BID - Connecting Farmers & Buyers', 20, footerY);
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...colors.muted);
    doc.text('Trusted Agricultural Platform for Land Trading', 20, footerY + 6);
    
    // Report info
    doc.setFontSize(8);
    doc.text(`Report ID: LND-${land._id?.toString().slice(-8) || 'XXXXXXXX'}`, pageWidth - 20, footerY, { align: 'right' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, footerY + 5, { align: 'right' });
    doc.text('This document contains confidential information', pageWidth - 20, footerY + 10, { align: 'right' });
  }
  
  // Enhanced watermark
  function addWatermark() {
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(50);
    
    // Main watermark
    doc.text('SUHURU', pageWidth / 2, pageHeight / 2 - 10, {
      angle: 45,
      align: 'center'
    });
    
    // Secondary watermark
    doc.setFontSize(30);
    doc.text('CONFIDENTIAL', pageWidth / 2, pageHeight / 2 + 20, {
      angle: 45,
      align: 'center'
    });
    
    doc.setGState(new doc.GState({ opacity: 1 }));
  }
  
  // Generate the PDF
  addEnhancedHeader();
  addReportTitle();
  let currentYPos = addLandInformation();
  currentYPos = addAnalyticsSection(currentYPos);
  addBidsTable(currentYPos);
  addFooter();
  addWatermark();
  
  // Add page border
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(1);
  doc.rect(10, 5, pageWidth - 20, pageHeight - 10);
  
  return doc;
}

// GET all lands with search functionality
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { ownerName: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } },
          { soilType: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { resources: { $in: [new RegExp(search, 'i')] } }
        ]
      };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const lands = await Land.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Land.countDocuments(query);
    
    res.json({
      success: true,
      data: lands,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: lands.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lands',
      error: error.message
    });
  }
});

// GET single land by ID
router.get('/:id', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    res.json({
      success: true,
      data: land
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching land',
      error: error.message
    });
  }
});

// POST create new land
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Land image is required'
      });
    }
    
    const {
      ownerName,
      address,
      lat,
      lng,
      area,
      soilType,
      resources,
      amount,
      description
    } = req.body;
    
    // Parse resources if it's a string
    let parsedResources = [];
    if (resources) {
      try {
        parsedResources = typeof resources === 'string' ? JSON.parse(resources) : resources;
      } catch (e) {
        parsedResources = typeof resources === 'string' ? resources.split(',').map(r => r.trim()) : resources;
      }
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const newLand = new Land({
      imageUrl,
      ownerName,
      location: {
        address,
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        }
      },
      area: parseFloat(area),
      soilType,
      resources: parsedResources,
      amount: parseFloat(amount),
      description
    });
    
    const savedLand = await newLand.save();
    
    res.status(201).json({
      success: true,
      message: 'Land created successfully',
      data: savedLand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating land',
      error: error.message
    });
  }
});

// PUT update land
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    const {
      ownerName,
      address,
      lat,
      lng,
      area,
      soilType,
      resources,
      amount,
      description
    } = req.body;
    
    // Parse resources if it's a string
    let parsedResources = [];
    if (resources) {
      try {
        parsedResources = typeof resources === 'string' ? JSON.parse(resources) : resources;
      } catch (e) {
        parsedResources = typeof resources === 'string' ? resources.split(',').map(r => r.trim()) : resources;
      }
    }
    
    // Update fields
    if (ownerName) land.ownerName = ownerName;
    if (address) land.location.address = address;
    if (lat) land.location.coordinates.lat = parseFloat(lat);
    if (lng) land.location.coordinates.lng = parseFloat(lng);
    if (area) land.area = parseFloat(area);
    if (soilType) land.soilType = soilType;
    if (resources) land.resources = parsedResources;
    if (amount) land.amount = parseFloat(amount);
    if (description) land.description = description;
    
    // Update image if new one is uploaded
    if (req.file) {
      land.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    
    const updatedLand = await land.save();
    
    res.json({
      success: true,
      message: 'Land updated successfully',
      data: updatedLand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating land',
      error: error.message
    });
  }
});

// DELETE land
router.delete('/:id', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    await Land.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Land deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting land',
      error: error.message
    });
  }
});

// GET bids for a specific land
router.get('/:id/bids', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    // Check if bidding is still active (within 7 days)
    if (!land.isBiddingActive) {
      return res.json({
        success: true,
        status: 'Bidding closed',
        message: 'Bidding period has expired',
        data: [],
        daysRemaining: 0
      });
    }
    
    // Sort bids by amount in descending order
    const sortedBids = land.bids.sort((a, b) => b.bidAmount - a.bidAmount);
    
    res.json({
      success: true,
      status: 'Active',
      data: sortedBids,
      daysRemaining: land.daysRemaining
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bids',
      error: error.message
    });
  }
});

// Generate and download report for land bids
router.get('/:id/report/:format', async (req, res) => {
  try {
    const { id, format } = req.params;
    
    // Validate format
    if (!['csv', 'pdf', 'json'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Supported formats: csv, pdf, json'
      });
    }
    
    const land = await Land.findById(id);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    // Allow report download at any time
    // Note: Bidding status doesn't affect report availability
    
    const bids = land.bids || [];
    const totalBids = bids.length;
    const totalBidAmount = bids.reduce((sum, bid) => sum + (bid.bidAmount || 0), 0);
    const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.bidAmount || 0)) : 0;
    const highestBidder = bids.find(bid => bid.bidAmount === highestBid);
    const averageBidAmount = totalBids > 0 ? totalBidAmount / totalBids : 0;
    
    const reportData = {
      landInfo: {
        id: land._id,
        ownerName: land.ownerName,
        location: land.location.address,
        area: land.area,
        soilType: land.soilType,
        amount: land.amount,
        createdAt: land.createdAt
      },
      analytics: {
        totalBids,
        totalBidAmount,
        highestBid,
        highestBidder: highestBidder ? {
          name: highestBidder.bidderName,
          mobile: highestBidder.mobileNumber,
          amount: highestBidder.bidAmount,
          timestamp: highestBidder.timestamp
        } : null,
        averageBidAmount: parseFloat(averageBidAmount.toFixed(2))
      },
      bids: bids.sort((a, b) => b.bidAmount - a.bidAmount)
    };
    
    if (format === 'csv') {
      // Generate CSV
      const csvFields = [
        'bidderName',
        'mobileNumber', 
        'bidAmount',
        'timestamp'
      ];
      
      const csvData = bids.map(bid => ({
        bidderName: bid.bidderName,
        mobileNumber: bid.mobileNumber,
        bidAmount: bid.bidAmount,
        timestamp: bid.timestamp.toISOString()
      }));
      
      const json2csvParser = new Parser({ fields: csvFields });
      const csv = json2csvParser.parse(csvData);
      
      // Add summary at the top
      const summary = `Land Bidding Report\n` +
                     `Owner: ${land.ownerName}\n` +
                     `Location: ${land.location.address}\n` +
                     `Area: ${land.area} acres\n` +
                     `Soil Type: ${land.soilType}\n` +
                     `Base Amount: $${land.amount}\n` +
                     `Created: ${land.createdAt.toDateString()}\n\n` +
                     `Analytics:\n` +
                     `Total Bids: ${totalBids}\n` +
                     `Total Bid Amount: $${totalBidAmount}\n` +
                     `Highest Bid: $${highestBid}\n` +
                     `Average Bid: $${averageBidAmount.toFixed(2)}\n\n` +
                     `Bids:\n${csv}`;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="land-${id}-bids-report.csv"`);
      res.send(summary);
      
    } else if (format === 'pdf') {
      // Generate Professional PDF
      const analytics = {
        totalBids,
        totalBidAmount,
        highestBid,
        averageBidAmount,
        highestBidder
      };
      
      const doc = generateProfessionalPDF(land, bids, analytics);
      
      // Convert to buffer and send
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="suhuru-land-${id}-report.pdf"`);
      res.send(pdfBuffer);
      
    } else {
      // Return JSON format
      res.json({
        success: true,
        data: reportData
      });
    }
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
