import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import {useNavigate} from 'react-router-dom';

function User(props) {
  const {_id,fullname,age,gender,NIC,contact_number,email,address,distric,city,experience,agri_activities} = props.user;

  const history = useNavigate();

  const deleteHandler = async() => {
    await axios.delete(`http://localhost:5000/users/${_id}`)
    .then(res => res.data)
    // Corrected logic: Navigate to the homepage after successful deletion
    .then(() => history("/"))
    .then(() => history("/UserDetails"))
  }

  return ( 
    <div>
      <p>User Display.</p>
      <br></br>
      <h1>ID:{_id}</h1>
      <h1>fullname:{fullname}</h1>
      <h1>age:{age}</h1>
      <h1>gender:{gender}</h1>
      <h1>NIC:{NIC}</h1>
      <h1>contact_number:{contact_number}</h1>
      <h1>email:{email}</h1>
      <h1>address:{address}</h1>
      <h1>distric:{distric}</h1>
      <h1>city:{city}</h1>
      <h1>experience:{experience}</h1>
      <h1>agri_activities:{agri_activities}</h1>
      <Link to={`/UserDetails/${_id}`}>Update</Link>
      <button onClick={deleteHandler}>Delete</button> {/* <-- The 'onClick' is now correct */}
    </div>
  );
}

export default User;