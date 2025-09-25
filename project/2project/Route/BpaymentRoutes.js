const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const paymentController = require("../Controlers/BpaymentController");

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpeg", ".jpg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDF allowed!"));
    }
  },
});

// Routes
router.post(
  "/",
  upload.fields([
    { name: "bank_receipt", maxCount: 1 },
    { name: "order_pdf", maxCount: 1 },
  ]),
  paymentController.createPayment
);

router.get("/", paymentController.getPayments);
router.get("/:id", paymentController.getPaymentById);

router.put(
  "/:id",
  upload.fields([
    { name: "bank_receipt", maxCount: 1 },
    { name: "order_pdf", maxCount: 1 },
  ]),
  paymentController.updatePayment
);

router.delete("/:id", paymentController.deletePayment);

module.exports = router;