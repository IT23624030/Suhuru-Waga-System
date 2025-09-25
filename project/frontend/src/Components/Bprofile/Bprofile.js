import React, { useState, useEffect } from 'react';
import axios from "axios";
import Bfooter from "../Bfooter/Bfooter";
import Bheader from '../Bheader/Bheader';
import "./Bprofile.css";

const URL = "http://localhost:5000/usersby";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
}

function Bprofile() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users || []));
  }, []);

  return (
    <div>
      <Bheader />
      <div className="bprofile-container">
        <h1 className="bpage-title">Buyer Profile Details</h1>

        {users.length === 0 ? (
          <p>No buyers found.</p>
        ) : (
          <table className="bprofile-table">
            <thead>
              <tr>
                <th>Buyer NIC</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>Actions</th>
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
                  <td className="baction-buttons">
                    <button
                      className="bedit-btn"
                      onClick={() => window.location.href = `/bprofiles/${user._id}`}
                    >
                      Edit
                    </button>
                    <button
                      className="bdelete-btn"
                      onClick={async () => {
                        if (!window.confirm("Are you sure you want to delete this buyer?")) return;
                        await axios.delete(`http://localhost:5000/usersby/${user._id}`);
                        setUsers(users.filter(u => u._id !== user._id));
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Bfooter />
    </div>
  );
}

export default Bprofile;