// src/Component/Resource/ResourceTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminsResourceTable.css";

const ResourceTable = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("/api/resources"); // adjust your API base path
        setResources(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch resources.");
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="table-container">
      <table className="resource-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Available Units</th>
            <th>Total Units</th>
            <th>Base Rate</th>
            <th>Shortage Status</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res._id}>
              <td>{res.name}</td>
              <td>{res.category}</td>
              <td>{res.description}</td>
              <td>{res.availability?.availableUnits || 0}</td>
              <td>{res.availability?.totalUnits || 0}</td>
              <td>{res.pricing?.baseRate || 0}</td>
              <td>{res.shortageFlags?.isShortage ? "Shortage" : "Sufficient"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;