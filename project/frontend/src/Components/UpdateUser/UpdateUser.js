import React, {useEffect,useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router'
import {useNavigate} from 'react-router'

function UpdateUser() {

    const [inputs,setInputs] = useState({});
    const history = useNavigate();
    const id = useParams().id;

    useEffect(()=>{
        const fetchHandler = async ()=>{
            await axios
            .get(`http://localhost:5000/users/${id}`)
            .then((res)=> res.data)
            .then((data)=> setInputs(data.user));
        };
        fetchHandler();
    },[id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/users/${id}`, {
            fullname: String (inputs.fullname),
            age: Number (inputs.age),
            gender: String(inputs.gender),
            NIC: String (inputs.NIC),
            contact_number: Number (inputs.contact_number),
            email: String (inputs.email),
            address: String (inputs.address),
            distric: String (inputs.distric),
            city: String (inputs.city),
            experience: Number (inputs.experience),
            agri_activities: String (inputs.agri_activities),
        })
        .then((res) => res.data);
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        sendRequest().then(()=>
        history('/UserDetails'));
    };

  return (
    <div>
      <h1>Update User</h1>
      <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <br />
                <input type="text" name="fullname" onChange={handleChange} value={inputs.fullname} required></input>
                <br />
                <label>Age</label>
                <br />
                <input type="number" name="age" onChange={handleChange} value={inputs.age} required></input>
                <br />
                <label>Gender</label>
                <br />
                <input type="text" name="gender" onChange={handleChange} value={inputs.gender} required></input>
                <br />
                <label>NIC</label>
                <br />
                <input type="text" name="NIC" onChange={handleChange} value={inputs.NIC} required></input>
                <br />
                <label>Contact Number</label>
                <br />
                <input type="number" name="contact_number" onChange={handleChange} value={inputs.contact_number} required></input>
                <br />
                <label>Email</label>
                <br />
                <input type="email" name="email" onChange={handleChange} value={inputs.email} required></input>
                <br />
                <label>Address</label>
                <br />
                <input type="text" name="address" onChange={handleChange} value={inputs.address} required></input>
                <br />
                <label>District</label>
                <br />
                <input type="text" name="distric" onChange={handleChange} value={inputs.distric} required></input>
                <br />
                <label>City</label>
                <br />
                <input type="text" name="city" onChange={handleChange} value={inputs.city} required></input>
                <br />
                <label>Experience</label>
                <br />
                <input type="number" name="experience" onChange={handleChange} value={inputs.experience} required></input>
                <br />
                <label>Agricultural Activities</label>
                <br />
                <input type="text" name="agri_activities" onChange={handleChange} value={inputs.agri_activities} required></input>
                <br /><br />
                <button type="submit">Add User</button>
            </form>
    </div>
  )
}

export default UpdateUser
