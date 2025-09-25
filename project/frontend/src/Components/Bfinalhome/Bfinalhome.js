import React from 'react';
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import { FaClipboardList, FaMoneyBillWave, FaUserCheck, FaTruck, FaChartLine } from "react-icons/fa";
import "./Bfinalhome.css";

function Bfinalhome() {
  return (
    <div className="bfinalhome-page">
      <Bheader />

      {/* ---------- Banner ---------- */}
      <div className="bfinalhome-banner">
        <h1>Order Management Portal</h1>
      </div>

      {/* ---------- Content Section ---------- */}
      <div className="bfinalhome-content">
        <div className="bfeature-card">
          <FaClipboardList className="bfeature-icon" />
          <h2>Seamless Order Management</h2>
          <p>
            Register, create your profile, and access all order-related features with ease. Keep track of all crop purchases efficiently.
          </p>
        </div>

        <div className="bfeature-card">
          <FaTruck className="bfeature-icon" />
          <h2>Place Orders Easily</h2>
          <p>
            Specify crop type, quantity, unit, total price, and delivery preferences. Monitor each order status in real-time.
          </p>
        </div>

        <div className="bfeature-card">
          <FaMoneyBillWave className="bfeature-icon" />
          <h2>Integrated Payment Options</h2>
          <p>
            Pay securely online or choose cash on delivery. View detailed payment history and download invoices easily.
          </p>
        </div>

        <div className="bfeature-card">
          <FaUserCheck className="bfeature-icon" />
          <h2>Farmer Profiles</h2>
          <p>
            Access farmer details, CVs, and ratings to make informed decisions before placing orders.
          </p>
        </div>

        <div className="bfeature-card">
          <FaChartLine className="bfeature-icon" />
          <h2>Track & Analyze</h2>
          <p>
            Review order history, analyze purchase trends, and ensure transparency in every transaction.
          </p>
        </div>

        <div className="bfeature-card">
          <FaChartLine className="bfeature-icon" />
          <h2>Eco-Friendly Choices</h2>
          <p>
            Promote sustainable farming by choosing crops from eco-conscious farmers and minimizing your carbon footprint.
          </p>
        </div>
      </div>

      <Bfooter />
    </div>
  );
}

export default Bfinalhome;