import React, { useState, useEffect } from 'react';
import axios from "axios";
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import Footer from "../Home/Footer/Footer";
import "./Bview.css";

const URL = "http://localhost:5000/usersby";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function Bview() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users || []));
  }, []);

  return (
    <div>
      <Nav />
      <div className="vbprofile-container">
        <Navi />
        <h1 className="vbpage-title">Buyer Profile Details</h1>

        {users.length === 0 ? (
          <p>No buyers found.</p>
        ) : (
          <table className="vbprofile-table">
            <thead>
              <tr>
                <th>Buyer NIC</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? "even-row" : ""}>
                  <td>{user.buyerid || "N/A"}</td>
                  <td>{user.firstname || "N/A"}</td>
                  <td>{user.lastname || "N/A"}</td>
                  <td>{user.organization || "N/A"}</td>
                  <td>{user.gmail || "N/A"}</td>
                  <td>{user.contactNumber || "N/A"}</td>
                  <td>{user.address || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer /> 
    </div>
  );
}

export default Bview;