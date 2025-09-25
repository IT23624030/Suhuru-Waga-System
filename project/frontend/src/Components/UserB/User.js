import React from 'react';
import { Link } from "react-router-dom"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserB.css";

function User(props) {
  const { _id, buyerid, firstname, lastname, organization, gmail, contactNumber, address } = props.user;
    
  const history = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/usersby/${_id}`);

      // ✅ Show alert after successful deletion
      alert("Buyer deleted successfully!");

      // Redirect to home or buyer profiles
      history("/bprofiles");
    } catch (err) {
      console.error(err);
      alert("Failed to delete buyer. Please try again.");
    }
  };

  return (
    <div>
      <h2>Buyer NIC: <span>{buyerid}</span></h2>
      <h2>First Name: <span>{firstname}</span></h2>
      <h2>Last Name: <span>{lastname}</span></h2>
      <h2>Company Name: <span>{organization}</span></h2>
      <h2>Gmail: <span>{gmail}</span></h2>
      <h2>Contact Number: <span>{contactNumber}</span></h2>
      <h2>Address: <span>{address}</span></h2>

      <div>
        <Link to={`/bprofiles/${_id}`} >Edit</Link>
        <button onClick={deleteHandler} >Delete</button>
      </div>
    </div>
  );
}

export default User;