import React, { useState, useEffect, useRef } from "react";
import Nav from "../Home/Nav/Nav2";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Footer from "../Home/Footer/Footer";
import Navi from "../Features/Navi/Nav3";
import UserResources from '../Resource/UserListings';
import UserBookings from '../Resource/UserBookingsTable';

import "./Users.css";

function Users() {
  const [user, setUser] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const profileRef = useRef(); 
  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData)._id : null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.email) {
        fetchUser(userData.email);
        fetchUserPlans(userData.email);
      }
    }
  }, []);

  const fetchUser = (email) => {
    axios
      .get(`http://localhost:5000/user/${email}`)
      .then((res) => {
        if (res.data.status === "ok") setUser(res.data.user);
      })
      .catch((err) => console.error(err));
  };

  const fetchUserPlans = (email) => {
    axios
      .get(`http://localhost:5000/userPlan/getPlans/${email}`)
      .then((res) => {
        if (res.data.status === "ok") setSavedPlans(res.data.plans);
      })
      .catch((err) => console.error("Error fetching saved plans:", err));
  };

  const handleDownloadPdf = async () => {
    if (!profileRef.current) return;
    const canvas = await html2canvas(profileRef.current, { scale: 2 });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("user-profile.pdf");
  };

  const handleEditClick = () => {
    if (!user) return;
    setEditForm(
      Object.fromEntries(
        Object.entries(user).filter(
          ([key]) => !["_id", "__v", "password"].includes(key)
        )
      )
    );
    setIsEditing(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const dataToUpdate = { ...editForm };
    axios
      .put(`http://localhost:5000/user/updateAll/${user.email}`, dataToUpdate)
      .then((res) => {
        if (res.data.status === "ok") {
          alert("Profile updated successfully!");
          setUser(res.data.user);
          setIsEditing(false);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating profile");
      });
  };

  const handleDeleteProfile = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    axios
      .delete(`http://localhost:5000/user/${user.email}`)
      .then((res) => {
        if (res.data.status === "ok") {
          alert("Account deleted successfully!");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting account");
      });
  };

  const handleDeletePlan = (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    axios
      .delete(`http://localhost:5000/userPlan/delete/${planId}`)
      .then((res) => {
        if (res.data.status === "ok") {
          setSavedPlans(savedPlans.filter((plan) => plan._id !== planId));
          alert("Plan deleted successfully!");
        } else {
          alert(res.data.message || "Failed to delete plan");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting plan. Check console.");
      });
  };

  if (!user)
    return (
      <div className="users-page-container-rosh">
        <Nav />
        <h2>Loading user details...</h2>
      </div>
    );

  return (
    <div className="users-page-container-rosh">
      <Nav />
      <h1>User Details</h1>

      {/* Profile section */}
      <div ref={profileRef} className="users-page-profile-rosh">
        <Navi />
        <h2>{user.fullname}'s Profile</h2>

        {isEditing ? (
          <div>
            <table className="users-page-user-table-rosh">
              <tbody>
                {Object.entries(editForm).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                    <td>
                      <input
                        type="text"
                        name={key}
                        value={value || ""}
                        onChange={handleFormChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={handleSave} className="users-page-btn-rosh users-page-btn-green-rosh">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="users-page-btn-rosh users-page-btn-red-rosh">
              Cancel
            </button>
          </div>
        ) : (
          <table className="users-page-user-table-rosh">
            <tbody>
              {Object.entries(user).map(
                ([key, value]) =>
                  !["_id", "__v", "password"].includes(key) && (
                    <tr key={key}>
                      <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                      <td>{value}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Saved Plans */}
      <div className="users-page-saveplan-rosh">
        <h3>Saved Crop Plans</h3>
        <table className="users-page-plans-table-rosh">
          <thead>
            <tr>
              <th>Crop Name</th>
              <th>Weather</th>
              <th>Plan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedPlans.length > 0 ? (
              savedPlans.map((plan) => (
                <tr key={plan._id}>
                  <td>{plan.cropname}</td>
                  <td>{plan.weather}</td>
                  <td>{plan.plan}</td>
                  <td>
                    <button
                      className="users-page-btn-rosh users-page-btn-red-rosh"
                      onClick={() => handleDeletePlan(plan._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No plans saved
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isEditing && (
        <div className="users-page-action-buttons-rosh">
          <button onClick={handleDownloadPdf} className="users-page-btn-rosh users-page-btn-green-rosh">
            Download Profile PDF
          </button>
          <button onClick={handleEditClick} className="users-page-btn-rosh users-page-btn-blue-rosh">
            Update Profile
          </button>
          <button onClick={handleDeleteProfile} className="users-page-btn-rosh users-page-btn-red-rosh">
            Delete Profile
          </button>
        </div>
      )}
      {userId && (
      <>
        <UserResources userId={userId} />
        <UserBookings userId={userId} />
      </>
    )}

      <Footer/>
    </div>
  );
}

export default Users;
