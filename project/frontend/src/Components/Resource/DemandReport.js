import React, { useEffect, useState } from "react";
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

const DemandReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCharts, setExpandedCharts] = useState({});
  const [chartData, setChartData] = useState({});
  const [activeChartType, setActiveChartType] = useState({}); // Track current chart per resource

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const resourcesRes = await fetch("http://localhost:5000/resources", { mode: "cors" });
        const bookingsRes = await fetch("http://localhost:5000/bookings", { mode: "cors" });

        if (!resourcesRes.ok || !bookingsRes.ok) throw new Error("Failed to fetch data");

        const resources = await resourcesRes.json();
        const bookings = await bookingsRes.json();

        const report = resources.map((resource) => {
          const demandCount = bookings.filter(
            (b) => b.resourceId === resource._id && ["Pending", "Confirmed"].includes(b.status)
          ).length;

          const available = resource.availability?.availableUnits || 0;
          const shortage = Math.max(demandCount - available, 0);
          const month = new Date().getMonth() + 1;
          const season = month >= 3 && month <= 8 ? "Yala" : "Maha";

          return {
            resourceId: resource._id,
            resource: resource.name,
            type: resource.category,
            available,
            demand: demandCount,
            shortage,
            season,
            status: shortage > 0 ? "Shortage" : "Sufficient",
          };
        });

        setReportData(report);
      } catch (err) {
        console.error("Could not fetch report data:", err);
        setError("Failed to load report data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const fetchChartData = async (resourceId) => {
    if (chartData[resourceId]) {
      setExpandedCharts((prev) => ({ ...prev, [resourceId]: !prev[resourceId] }));
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/bookings/history/${resourceId}`, { mode: "cors" });
      if (!res.ok) throw new Error("Failed to fetch chart data");

      const data = await res.json();
      setChartData((prev) => ({ ...prev, [resourceId]: data }));
      setExpandedCharts((prev) => ({ ...prev, [resourceId]: true }));
      setActiveChartType((prev) => ({ ...prev, [resourceId]: chartTypes[0] })); // Default to first chart
    } catch (err) {
      console.error("Error fetching chart data:", err);
      alert("Failed to fetch chart data for this resource.");
    }
  };

  const handleChartSwitch = (resourceId, direction) => {
    const currentType = activeChartType[resourceId] || chartTypes[0];
    const currentIndex = chartTypes.indexOf(currentType);
    const nextIndex = (currentIndex + direction + chartTypes.length) % chartTypes.length;
    setActiveChartType((prev) => ({ ...prev, [resourceId]: chartTypes[nextIndex] }));
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
          <h1 className="report-title">📊 Resource Demand Report</h1>
          <p className="report-subtitle">
            Analysis of resource availability vs. demand from bookings
          </p>
        </header>

        <main className="report-main">
          {loading ? (
            <div className="loading-indicator">
              <div className="spinner" />
              <p>Loading report data...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : reportData.length === 0 ? (
            <p>No report data available.</p>
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
                  {reportData.map((item, index) => (
                    <React.Fragment key={index}>
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

export default DemandReport;