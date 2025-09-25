import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DistrictDropdown from "./DistrictDropdown";
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import "./CropAdvisor.css"; // Import the new CSS file
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import Footer from "../Home/Footer/Footer";

// Centralized API client
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

function CropAdvisor() {
  const [district, setDistrict] = useState("");
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [planDetails, setPlanDetails] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  const [userEmail, setUserEmail] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserEmail(userData.email);
    }
  }, []);

  const handleSearch = async () => {
    if (!district) return alert("Please select a district to search.");
    setLoading(true);
    setError(null);
    setCrops([]);
    setPlanDetails(null);
    setSelectedCrop("");
    setSelectedWeather("");
    setPlanError(null);
    setSaveMessage(null);

    try {
      const res = await api.get(`/crops/${encodeURIComponent(district)}`);
      if (!res.data || res.data.length === 0) {
        setError("No crops found for this district. Please try another one.");
      } else {
        setCrops(res.data);
      }
    } catch (err) {
      console.error("Error fetching crops:", err?.message, err?.response?.data);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred while fetching crops.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetPlan = async () => {
    if (!selectedCrop || !selectedWeather)
      return alert("Please select both crop and weather.");
    setPlanLoading(true);
    setPlanError(null);
    setPlanDetails(null);
    setSaveMessage(null);

    try {
      const crop = (selectedCrop ?? "").toString().trim();
      const weather = (selectedWeather ?? "").toString().trim();

      // 1) Exact route
      try {
        const res = await api.get(`/createPlanByCrop/${encodeURIComponent(crop)}/${encodeURIComponent(weather)}`);
        if (res?.data) {
          setPlanDetails(res.data);
          return;
        }
      } catch (err1) {
        if (err1?.response?.status !== 404) throw err1;
      }

      // 2) Lowercase retry
      try {
        const cropLc = crop.toLowerCase();
        const weatherLc = weather.toLowerCase();
        const resLc = await api.get(`/createPlanByCrop/${encodeURIComponent(cropLc)}/${encodeURIComponent(weatherLc)}`);
        if (resLc?.data) {
          setPlanDetails(resLc.data);
          return;
        }
      } catch (err2) {
        if (err2?.response?.status !== 404) throw err2;
      }

      // 3) Crop-only fallback
      try {
        const res2 = await api.get(`/plan/${encodeURIComponent(crop)}`);
        if (res2?.data) {
          setPlanDetails({ cropname: res2.data.cropname || crop, weather, plan: res2.data.plan });
          return;
        }
      } catch (err3) {
        if (err3?.response?.status !== 404) throw err3;
      }

      // 4) Fetch all and filter client-side
      try {
        const all = await api.get(`/createPlans`);
        if (Array.isArray(all?.data)) {
          const match = all.data.find(p =>
            String(p?.cropname ?? "").trim().toLowerCase() === crop.toLowerCase() &&
            String(p?.weather ?? "").trim().toLowerCase() === weather.toLowerCase()
          ) || all.data.find(p =>
            String(p?.cropname ?? "").trim().toLowerCase() === crop.toLowerCase()
          );
          if (match) {
            setPlanDetails({ cropname: match.cropname || crop, weather: match.weather || weather, plan: match.plan });
            return;
          }
        }
      } catch (err4) {
        // ignore and show final error
      }

      setPlanError(`No plan found for crop "${crop}" with weather "${weather}".`);
    } catch (err) {
      console.error("Error fetching crop plan:", err?.message, err?.response?.data);
      const message = err?.response?.data?.message || err?.message || `No plan found for the selected crop and weather.`;
      setPlanError(message);
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!planDetails) return alert("No plan to save.");
    if (!userEmail) return alert("User not logged in.");

    try {
      const res = await api.post("/userPlan/savePlan", {
        email: userEmail,
        cropname: planDetails.cropname,
        weather: planDetails.weather,
        plan: planDetails.plan,
      });

      if (res.data.status === "ok") {
        setSaveMessage("Plan saved successfully!");
      } else {
        setSaveMessage("Failed to save plan.");
      }
    } catch (err) {
      console.error("Error saving plan:", err?.message, err?.response?.data);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Error saving plan. Check console for details.";
      setSaveMessage(message);
    }
  };

  const handleDownloadPdf = async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, { scale: 2 });
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("user-report.pdf");
  };

  // Build weather options: if a crop is selected, show only weathers that have that crop
  const allWeathers = crops
    .flatMap((doc) => doc.whether)
    .filter(Boolean)
    .map((w) => (typeof w === "string" ? w.trim() : String(w).trim()));
  const weatherOptions = (() => {
    const sel = (selectedCrop ?? "").toString().trim();
    if (!sel) return Array.from(new Set(allWeathers));
    const validWeathers = crops
      .filter((doc) => Array.isArray(doc.crops) && doc.crops.some((c) => (c?.cropname ?? "").toString().trim() === sel))
      .map((doc) => (doc?.whether ?? "").toString().trim())
      .filter(Boolean);
    return Array.from(new Set(validWeathers));
  })();

  return (
    <div>
      <Nav />
      <div className="features-content-layout">
        <Navi />
        
          <div className="cropadvisor-wrappercrops">
            <h2 className="title">Search Crop & Get Work Plan</h2>

            <div className="search-boxro">
              <label>Select District:</label>
              <DistrictDropdown
                onSelect={setDistrict}
                selectedValue={district}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {loading && <p className="loading-text">Searching for crops...</p>}
            {error && <p className="error-text">{error}</p>}

            {crops.length > 0 && (
              <div className="crop-plan-layout">
                <div className="crop-sectionro">
                  <h3>Available Crops for District</h3>
                  {crops.map((cropDoc, index) => (
                    <div key={index} className="crop-card">
                      <p><strong>Weather:</strong> {cropDoc.whether}</p>
                      <p><strong>Start Months:</strong> {cropDoc.startMonths.join(", ")}</p>
                      <p><strong>Available Crops:</strong>
                        {cropDoc.crops.map((crop) => (
                          <span key={crop._id}> {crop.cropname}</span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="plan-sectionro">
                  <h3>Get the Plan</h3>
                  <div className="form-box">
                    <label>Selected Crop:</label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => {
                        setSelectedCrop(e.target.value.trim());
                        setPlanDetails(null);
                        setPlanError(null);
                        setSaveMessage(null);
                      }}
                    >
                      <option value="">-- Select a crop --</option>
                      {crops
                        .flatMap((doc) => doc.crops)
                        .map((crop) => {
                          const name = (crop?.cropname ?? "").toString().trim();
                          return (
                            <option key={crop._id} value={name}>
                              {name}
                            </option>
                          );
                        })}
                    </select>

                    <label>Selected Weather:</label>
                    <select
                      value={selectedWeather}
                      onChange={(e) => {
                        setSelectedWeather(e.target.value.trim());
                        setPlanDetails(null);
                        setPlanError(null);
                        setSaveMessage(null);
                      }}
                    >
                      <option value="">-- Select weather --</option>
                      {weatherOptions.map((weather, idx) => {
                        const w = (weather ?? "").toString().trim();
                        return (
                          <option key={idx} value={w}>
                            {w}
                          </option>
                        );
                      })}
                    </select>

                    <button
                      className="btn-primary"
                      onClick={handleGetPlan}
                      disabled={!selectedCrop || !selectedWeather || planLoading}
                    >
                      {planLoading ? "Getting Plan..." : "Get"}
                    </button>
                  </div>

                  {planError && <p className="error">{planError}</p>}

                  {planDetails && (
                    <div className="plan-card">
                      <div ref={componentRef}>
                        <h4>
                          Plan for {planDetails.cropname} ({planDetails.weather})
                        </h4>
                        <p><strong>Instructions:</strong> {planDetails.plan}</p>
                      </div>

                      <button className="btn-save" onClick={handleSavePlan}>
                        Save
                      </button>
                      <button className="btn-download" onClick={handleDownloadPdf}>
                        Download PDF
                      </button>

                      {saveMessage && <p className="success">{saveMessage}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      
      <Footer />
    </div>
  );
}

export default CropAdvisor;