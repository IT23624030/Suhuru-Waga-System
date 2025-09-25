import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./DemandReport.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = ["lineChartData", "pieChartData", "barChartData"];
const chartTitles = {
  lineChartData: "Bookings Per Month",
  pieChartData: "Revenue Per Season",
  barChartData: "Total Unit Hours",
};

const IndividualDemandReport = () => {
  const { id } = useParams(); // UUID
  const navigate = useNavigate();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [chartData, setChartData] = useState({});
  const [activeChartType, setActiveChartType] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetch user
        let userRes = await fetch(`http://localhost:5000/farmers/${id}`, { mode: "cors" });
        let userType = "Farmer";

        if (!userRes.ok) {
          userRes = await fetch(`http://localhost:5000/providers/${id}`, { mode: "cors" });
          userType = "Provider";

          if (!userRes.ok) throw new Error("User not found");
        }

        const userData = await userRes.json();
        setUser(userData);

        // Extract username for validation
        const userName = userData?.personalInfo?.name || userData?.username || userData?.name;

        // Fetch resources
        const resourcesRes = await fetch(`http://localhost:5000/resources/user/${id}`, { mode: "cors" });
        if (!resourcesRes.ok) throw new Error("Failed to fetch resources");
        let resources = await resourcesRes.json();

        // ✅ Filter resources that match the userName
        resources = resources.filter(r => r.providerName === userName || r.username === userName);

        // Fetch bookings for demand calculation
        const bookingsRes = await fetch(`http://localhost:5000/bookings/user/${id}`, { mode: "cors" });
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

        // Map resources with demand, availability, and status
        const report = resources.map((resource) => {
          const demandCount = bookings.filter(
            (b) =>
              b.resourceId === resource._id &&
              ["Pending", "Confirmed"].includes(b.status)
          ).length;

          const available = resource.availability?.availableUnits ?? resource.availableUnits ?? 0;
          const shortage = Math.max(demandCount - available, 0);
          const month = new Date().getMonth() + 1;
          const season = month >= 3 && month <= 8 ? "Yala" : "Maha";

          return {
            resourceId: resource._id,
            resource: resource.name || resource.cropType || "Resource",
            type: resource.category || resource.resourceType || "N/A",
            available,
            demand: demandCount,
            shortage,
            season,
            status: shortage > 0 ? "Shortage" : "Sufficient",
          };
        });

        if (report.length === 0) setError("No resources match the user's username.");

        setReportData(report);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReportData();
    else navigate("/login");
  }, [id, navigate]);

  const fetchChartData = async (resourceId) => {
    if (chartData[resourceId]) {
      setExpandedCharts(prev => ({ ...prev, [resourceId]: !prev[resourceId] }));
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/bookings/history/${encodeURIComponent(resourceId)}`, { mode: "cors" });
      if (!res.ok) throw new Error("Failed to fetch chart data");
      const data = await res.json();
      setChartData(prev => ({ ...prev, [resourceId]: data }));
      setExpandedCharts(prev => ({ ...prev, [resourceId]: true }));
      setActiveChartType(prev => ({ ...prev, [resourceId]: chartTypes[0] }));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch chart data for this resource.");
    }
  };

  const handleChartSwitch = (resourceId, direction) => {
    const currentType = activeChartType[resourceId] || chartTypes[0];
    const currentIndex = chartTypes.indexOf(currentType);
    const nextIndex = (currentIndex + direction + chartTypes.length) % chartTypes.length;
    setActiveChartType(prev => ({ ...prev, [resourceId]: chartTypes[nextIndex] }));
  };

  const renderChart = (resourceId) => {
    const type = activeChartType[resourceId];
    const data = chartData[resourceId]?.[type];
    if (!data) return null;
    switch (type) {
      case "lineChartData":
        return <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
      case "pieChartData":
        return <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
      case "barChartData":
        return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="report-wrapper">
        <header className="report-header">
          <h1 className="report-title">
            📊 {user?.personalInfo?.name || user?.name || user?.username || "User"}'s Resource Demand Report
          </h1>
          <p className="report-subtitle">
            Analysis of resources' availability vs. demand from bookings
          </p>
        </header>
        <main className="report-main">
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner" />
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div className="error-message"><p>{error}</p></div>
          ) : reportData.length === 0 ? (
            <p>No resources found for this user.</p>
          ) : (
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Type</th>
                    <th>Available</th>
                    <th>Demand (Qty)</th>
                    <th>Shortage</th>
                    <th>Season</th>
                    <th>Status</th>
                    <th>Charts</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item) => (
                    <React.Fragment key={item.resourceId}>
                      <tr className={item.status === "Shortage" ? "row-shortage" : "row-sufficient"}>
                        <td>{item.resource}</td>
                        <td>{item.type}</td>
                        <td className="center">{item.available}</td>
                        <td className="center">{item.demand}</td>
                        <td className="center">{item.shortage}</td>
                        <td>{item.season}</td>
                        <td className="center">
                          <span className={`status-tag ${item.status === "Shortage" ? "shortage" : "sufficient"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="center">
                          <button onClick={() => fetchChartData(item.resourceId)} className="chart-toggle-btn">
                            {expandedCharts[item.resourceId] ? "Hide Charts" : "Show Charts"}
                          </button>
                        </td>
                      </tr>
                      {expandedCharts[item.resourceId] && chartData[item.resourceId] && (
                        <tr className="chart-row">
                          <td colSpan="8">
                            <div className="charts-container">
                              <div className="chart-navigation">
                                <button onClick={() => handleChartSwitch(item.resourceId, -1)}>◀</button>
                                <span>{chartTitles[activeChartType[item.resourceId]]}</span>
                                <button onClick={() => handleChartSwitch(item.resourceId, 1)}>▶</button>
                              </div>
                              <div className="chart-wrapper" style={{ height: "400px" }}>
                                {renderChart(item.resourceId)}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default IndividualDemandReport;