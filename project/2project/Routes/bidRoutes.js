const express = require('express');
const router = express.Router();
const Land = require('../Model/Land');
const json2csv = require('json2csv').Parser;
const PDFDocument = require('pdfkit');

// POST create new bid for a specific land
router.post('/:landId', async (req, res) => {
  try {
    const { landId } = req.params;
    const { bidderName, mobileNumber, NIC, bidAmount } = req.body;
    // Validate required fields
    if (!bidderName || !mobileNumber || !NIC || !bidAmount) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: bidderName, mobileNumber, NIC, bidAmount'
      });
    } 
    
    // Validate mobile number format
    if (!/^[0-9]{10,15}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid mobile number (10-15 digits)'
      });
    }

     // Validate NIC number format
    if (!NIC || !/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(NIC)) { // <--- Corrected validation
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid NIC number'
      });
    }

    
    // Validate bid amount
    if (isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be a positive number'
      });
    }
    
    const land = await Land.findById(landId);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    // Check if bidding is still active (within 7 days)
    if (!land.isBiddingActive) {
      return res.status(403).json({
        success: false,
        message: 'Bidding period has expired. Bids are only accepted within 7 days of land creation.'
      });
    }
    
    // Check if bid amount is higher than the base amount
    if (parseFloat(bidAmount) <= land.amount) {
      return res.status(400).json({
        success: false,
        message: `Bid amount must be higher than the base amount of LKR ${land.amount}`
      });
    }
    
    // Check if this mobile number has already placed a bid
    const existingBid = land.bids.find(bid => bid.mobileNumber === mobileNumber);
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already placed a bid for this land. Multiple bids from the same mobile number are not allowed.'
      });
    }
    
    // Create new bid
    const newBid = {
      bidderName: bidderName.trim(),
      mobileNumber: mobileNumber.trim(),
      NIC: NIC.trim(),
      bidAmount: parseFloat(bidAmount),
      timestamp: new Date()
    };

    // Atomic push update to avoid validating unrelated fields on entire document
    const updatedLand = await Land.findByIdAndUpdate(
      landId,
      { $push: { bids: newBid } },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!updatedLand) {
      return res.status(404).json({ success: false, message: 'Land not found' });
    }

    // Get the created bid (last element)
    const createdBid = updatedLand.bids[updatedLand.bids.length - 1];

    return res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: {
        bid: createdBid,
        landInfo: {
          id: updatedLand._id,
          ownerName: updatedLand.ownerName,
          location: updatedLand.location.address,
          daysRemaining: updatedLand.daysRemaining
        }
      }
    });
  } catch (error) {
    // Send clearer validation errors where possible
    const isValidationError = error.name === 'ValidationError';
    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: isValidationError ? error.message : 'Error placing bid',
      error: error.message
    });
  }
});

// GET all bids for a specific land (alternative endpoint)
router.get('/:landId', async (req, res) => {
  try {
    const { landId } = req.params;
    const land = await Land.findById(landId);
    
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
        daysRemaining: 0,
        landInfo: {
          id: land._id,
          ownerName: land.ownerName,
          location: land.location.address,
          baseAmount: land.amount
        }
      });
    }
    
    // Sort bids by amount in descending order
    const sortedBids = land.bids.sort((a, b) => b.bidAmount - a.bidAmount);
    
    res.json({
      success: true,
      status: 'Active',
      data: sortedBids,
      daysRemaining: land.daysRemaining,
      landInfo: {
        id: land._id,
        ownerName: land.ownerName,
        location: land.location.address,
        baseAmount: land.amount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bids',
      error: error.message
    });
  }
});

// DELETE a specific bid (optional - for admin purposes)
router.delete('/:landId/:bidId', async (req, res) => {
  try {
    const { landId, bidId } = req.params;
    
    const land = await Land.findById(landId);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    // Find and remove the bid
    const bidIndex = land.bids.findIndex(bid => bid._id.toString() === bidId);
    
    if (bidIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }
    
    land.bids.splice(bidIndex, 1);
    await land.save();
    
    res.json({
      success: true,
      message: 'Bid deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bid',
      error: error.message
    });
  }
});

// GET bid statistics for a land
router.get('/:landId/stats', async (req, res) => {
  try {
    const { landId } = req.params;
    const land = await Land.findById(landId);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    const bids = land.bids;
    const totalBids = bids.length;
    const totalBidAmount = bids.reduce((sum, bid) => sum + bid.bidAmount, 0);
    const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.bidAmount)) : 0;
    const lowestBid = bids.length > 0 ? Math.min(...bids.map(bid => bid.bidAmount)) : 0;
    const averageBidAmount = totalBids > 0 ? totalBidAmount / totalBids : 0;
    
    const stats = {
      totalBids,
      totalBidAmount,
      highestBid,
      lowestBid,
      averageBidAmount: parseFloat(averageBidAmount.toFixed(2)),
      baseAmount: land.amount,
      bidIncrease: highestBid > 0 ? parseFloat(((highestBid - land.amount) / land.amount * 100).toFixed(2)) : 0,
      isBiddingActive: land.isBiddingActive,
      daysRemaining: land.daysRemaining
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bid statistics',
      error: error.message
    });
  }
});

// GET report download (CSV/PDF) for a specific land
router.get('/:landId/report/:format', async (req, res) => {
  try {
    const { landId, format } = req.params;
    
    if (!['csv', 'pdf'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Use csv or pdf'
      });
    }
    
    const land = await Land.findById(landId);
    
    if (!land) {
      return res.status(404).json({
        success: false,
        message: 'Land not found'
      });
    }
    
    const bids = land.bids;
    const stats = {
      totalBids: bids.length,
      totalBidAmount: bids.reduce((sum, bid) => sum + bid.bidAmount, 0),
      highestBid: bids.length > 0 ? Math.max(...bids.map(bid => bid.bidAmount)) : 0,
      averageBidAmount: bids.length > 0 ? (bids.reduce((sum, bid) => sum + bid.bidAmount, 0) / bids.length).toFixed(2) : 0
    };
    
  // CSV and PDF report generation (NIC field included with fallback)
  if (format === 'csv') {
    const csvData = bids.map(bid => ({
      'Bidder Name': bid.bidderName,
      'Mobile Number': bid.mobileNumber,
      'NIC': bid.NIC || '-',
      'Bid Amount': bid.bidAmount,
      'Date': new Date(bid.timestamp).toLocaleDateString(),
      'Time': new Date(bid.timestamp).toLocaleTimeString()
    }));
      
    const csvFields = ['Bidder Name', 'Mobile Number', 'NIC', 'Bid Amount', 'Date', 'Time'];
    const csvParser = new json2csv({ fields: csvFields });
    const csvContent = csvParser.parse(csvData);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=land-${landId}-bids-report.csv`);
      res.send(csvContent);
      
    } else if (format === 'pdf') {
      // Generate PDF
      const doc = new PDFDocument();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=land-${landId}-bids-report.pdf`);
      
      doc.pipe(res);
      
      // PDF Header
      doc.fontSize(20).text('Land Bidding Report', 50, 50);
      doc.fontSize(12).text(`Land Owner: ${land.ownerName}`, 50, 80);
      doc.text(`Location: ${land.location.address}`, 50, 100);
      doc.text(`Base Amount: $${land.amount}`, 50, 120);
      doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 50, 140);
      
      // Statistics
      doc.fontSize(16).text('Statistics:', 50, 180);
      doc.fontSize(12).text(`Total Bids: ${stats.totalBids}`, 50, 200);
      doc.text(`Highest Bid: $${stats.highestBid}`, 50, 220);
      doc.text(`Average Bid: $${stats.averageBidAmount}`, 50, 240);
      
      // Bids Table
      doc.fontSize(16).text('Bids:', 50, 280);
      
      let yPosition = 300;
    doc.text('Bidder Name', 50, yPosition);
    doc.text('Mobile', 200, yPosition);
    doc.text('NIC', 300, yPosition);
    doc.text('Amount', 400, yPosition);
    doc.text('Date', 500, yPosition);
    
    yPosition += 20;
      
      bids.forEach((bid, index) => {
      // ... check for new page
      doc.text(bid.bidderName || '-', 50, yPosition);
      doc.text(bid.mobileNumber || '-', 200, yPosition);
      doc.text((bid.NIC || '-').toString(), 300, yPosition);
      doc.text(`$${bid.bidAmount}`, 400, yPosition);
      doc.text(new Date(bid.timestamp).toLocaleDateString(), 500, yPosition);
      yPosition += 20;
    });
      
      doc.end();
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
});

module.exports = router;