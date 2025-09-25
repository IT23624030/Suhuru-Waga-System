import React, { useEffect, useState, useRef } from 'react';
import Nav from "../Home/Nav/Nav2";
import './Adminhome.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import html2canvas from 'html2canvas'; // npm install html2canvas
import jsPDF from 'jspdf'; // npm install jspdf

function Adminhome() {
  const navigate = useNavigate();
  const downloadRef = useRef(null); // Ref for counts + chart

  // State for counts
  const [counts, setCounts] = useState({ users: 0, workers: 0 });
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [error, setError] = useState(null);

  
  // Fetch user/workers counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users-count");
        if (res.data.status === "ok") {
          setCounts(res.data.counts);
        } else {
          setError("Failed to fetch counts");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoadingCounts(false);
      }
    };
    fetchCounts();
  }, []);

  

  // Download as PDF
  const handleDownloadPDF = () => {
    if (downloadRef.current) {
      html2canvas(downloadRef.current, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`dashboard_${new Date().toISOString()}.pdf`);
      });
    }
  };

  return (
  <div className="admin-home-containerro">
    <Nav />

    {/* Download Button */}
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <button
        onClick={handleDownloadPDF}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Download Dashboard as PDF
      </button>
    </div>

    {/* Wrapper for counts + chart */}
    <div ref={downloadRef}>
      <div className="counts-dashboardro">
        {loadingCounts ? (
          <p>Loading counts...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="count-cardro usersro">
              <h3>Total Users</h3>
              <p>{counts.users}</p>
            </div>
            <div className="count-cardro workersro">
              <h3>Total Workers</h3>
              <p>{counts.workers}</p>
            </div>
          </>
        )}
      </div>
    </div>

    {/* Admin Feature Cards */}
    <div className="features-gridsadminro">
      <button className="feature-card-buttonro" onClick={() => navigate("/CreatePlan")}>
        <div className="feature-icon cplan-icons"></div>
        <h3 className="card-title">Create Work Plan</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/CreateCrop")}>
        <div className="feature-icon sugge-icons"></div>
        <h3 className="card-title">Crop Suggest</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/CreateMarket")}>
        <div className="feature-icon market-icons"></div>
        <h3 className="card-title">Market Insight</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/GovHome")}>
        <div className="feature-icon notices4-icons"></div>
        <h3 className="card-title">Government Portal</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/notices")}>
        <div className="feature-icon notices-icons"></div>
        <h3 className="card-title">Government Notice Board</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/forms")}>
        <div className="feature-icon notices1-icons"></div>
        <h3 className="card-title">Forms & Applications</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/alerts")}>
        <div className="feature-icon notices2-icons"></div>
        <h3 className="card-title">Emergency Alerts</h3>
      </button>
      <button className="feature-card-buttonro" onClick={() => navigate("/resources")}>
        <div className="feature-icon notices3-icons"></div>
        <h3 className="card-title">Agriculture Resources</h3>
      </button>
    </div>
  </div>
);
}

export default Adminhome;