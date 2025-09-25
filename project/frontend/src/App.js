import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import Home2 from './Components/Home/home2';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import Features from './Components/Features/Features';
import Createp from './Components/Createp/Createp';
import CropAdvisor from './Components/CropAdvisor/CropAdvisor';
import Profile from './Components/Profile/Profile';
import Login from './Components/Login/Login';
import AddUser from './Components/AddUser/AddUser';
import Users from './Components/UserDetails/Users';
import UpdateUsers from './Components/UpdateUser/UpdateUser';
import Register from './Components/Register/Register';
import Calculator from './Components/Calculator/Calculator';
import CreatePlan from './Components/CreatePlan/CreatePlan';
import AdminLogin from './Components/Login/AdminLogin';
import Adminhome from './Components/Adminhome/Adminhome';
import CreateMarket from './Components/CreateMarket/CreateMarket';
import CreateCrop from './Components/CreateCrop/CreateCrop';

//Dulaksha
import Land from './pages/Land';
import LandOwnerRegister from './Components/LandOwnerRegister/LandOwnerRegister';
import View from './Components/View/View';
import SriLankaMap from './Components/SriLankaMap/SriLankaMap';
import LandOwnerCanSeeDocument from './Components/LandOwnerCanSeeDocument/LandOwnerCanSeeDocument';






// Dewmina
import Navbar from './Components/Resource/Navbar';
import Hero from './Components/Resource/Hero';
import Features1 from './Components/Resource/Features1';
import Categories from './Components/Resource/Categories';
import FeaturedResources from './Components/Resource/FeaturedResources';
import AvailableResources from './Components/Resource/AvailableResources';
import BlogSection from './Components/Resource/BlogSection';
import Newsletter from './Components/Resource/Newsletter';
import Footer from './Components/Resource/Footer';
import BookingPage from './Components/Resource/BookingPage';
import DemandReport from './Components/Resource/DemandReport';
import IndividualDemandReport from "./Components/Resource/IndividualDemandReport";

import ResourceTable from "./Components/Resource/AdminsResourceTable"; // Admin scrollable table
import UserBookings from "./Components/Resource/UserBookingsTable"; // User booking table
import UserResources from "./Components/Resource/UserListings"


import AddResourceForm from './Components/Resource/AddResourceForm';
import Resources from './Components/Resource/Resources';






import AddCropForm from "./Components/AddCropForm/AddCropForm";



//ravindu
import GovHome from './Components/GovHome/GovHome';
import Notices from './Components/Notices/Notices';
import Forms from './Components/Forms/Forms';
import Alerts from './Components/Alerts/Alerts';
import ResourcesR from './Components/Resources/Resources';
import AddNotice from './Components/Notices/AddNotice';
import UpdateNotice from './Components/Notices/UpdateNotice';
import AddAlert from './Components/Alerts/AddAlert';
import EditAlert from './Components/Alerts/EditAlert';
import CropSuggest from './Components/Crop Suggestion/CropSuggest';

import VGovHome from './Components/GovHome/VGovHome';
import VNotices from './Components/Notices/VNotices';
import VAlerts from './Components/Alerts/VAlerts';
import VResources from './Components/Resources/VResources';
import VForms from './Components/Forms/VForms';

//chalakshana
import Bfinalhome from "./Components/Bfinalhome/Bfinalhome";
import Bprofile  from "./Components/Bprofile/Bprofile";
import Bcropads from "./Components/Bcropads/Bcropads";
import Buyersadd from "./Components/Buyersadd/Buyersadd";
import Buyersupdate from "./Components/Buyersupdate/Buyersupdate";
import Borderconfirmdisplay from "./Components/Borderconfirmdisplay/Borderconfirmdisplay";
import Borderconfirmadd from "./Components/Borderconfirmadd/Borderconfirmadd";
import Borderconfirmupdate from "./Components/Borderconfirmupdate/Borderconfirmupdate";
import Bpaymentadd from "./Components/Bpaymentadd/Bpaymentadd";
import Bpaymentdisplay from "./Components/Bpaymentdisplay/Bpaymentdisplay";
import Bcanceladd from "./Components/Bcancelorderadd/Bcancelorderadd";
import Bcancelorderdisplay from "./Components/Bcancelorderdisplay/Bcancelorderdisplay";
import Bview from "./Components/Bview/Bview";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
{/* Home Page */}
         


          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/home2" element={<Home2/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/Features" element={<Features/>} />
          <Route path="/Createp" element={<Createp/>} />
          <Route path="/land-owner-register" element={<LandOwnerRegister/>} />
          <Route path="/land" element={<Land/>} />
          <Route path="/CropAdvisor" element={<CropAdvisor />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/UserDetails" element={<Users />} />
          <Route path="/UserDetails/:id" element={<UpdateUsers />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Calculator" element={<Calculator />} />
          <Route path="/CreatePlan" element={<CreatePlan />} />
          <Route path="/View" element={<View />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/Adminhome" element={<Adminhome />} />
          <Route path="/CreateMarket" element={<CreateMarket />} />
          <Route path="/CreateCrop" element={<CreateCrop />} />
          <Route path="/SriLankaMap" element={<SriLankaMap />} />
          <Route path="/landforms" element={<LandOwnerCanSeeDocument />} />






          <Route path="/request/:id" element={<BookingPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/demand" element={<DemandReport />} />
          <Route path="/available-resources" element={<AvailableResources />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/add-resource" element={<AddResourceForm />} />
          <Route path="/Resources" element={<Resources />} />
          <Route path="/report/:id" element={<IndividualDemandReport />} />
          <Route path="/my-bookings" element={<UserBookings />} />
<Route path="/admin-resources" element={<ResourceTable />} />    
          <Route path="/my-resources" element={<UserResources />} />



          <Route path="/GovHome" element={<GovHome />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/resourcesR" element={<ResourcesR />} />
          <Route path="/add-notice" element={<AddNotice />} />
          <Route path="/notices/:id" element={<UpdateNotice />} />
          <Route path="/add-alert" element={<AddAlert />} />
          <Route path="/edit-alert/:id" element={<EditAlert />} />
          <Route path="/crop-suggest" element={<CropSuggest />} />

          <Route path="/VGov-home" element={<VGovHome />} />
          <Route path="/Vnotices" element={<VNotices />} />
          <Route path="/Valerts" element={<VAlerts />} />
          <Route path="/Vresources" element={<VResources />} />
          <Route path="/Vforms" element={<VForms />} />



         <Route path="/" element={<Bfinalhome />} />
         <Route path="/bfinalhome" element={<Bfinalhome />} />
         <Route path="/addbuy" element={<Buyersadd />} />
         <Route path="/bprofiles" element={<Bprofile />} />
         <Route path="/bprofiles/:id" element={<Buyersupdate />} />
          <Route path="/cropads" element={<Bcropads />} />
          <Route path="/confirmorder" element={<Borderconfirmdisplay />} />
          <Route path="/addconfirms" element={<Borderconfirmadd />} />
          <Route path="/confirmorder/:id" element={<Borderconfirmupdate />} />
           <Route path="/bpay" element={<Bpaymentadd />} />
           <Route path="/bpaydisplay" element={<Bpaymentdisplay />} />
            <Route path="/bcancelorder" element={<Bcanceladd />} />
             <Route path="/bcancelorderdisplay" element={<Bcancelorderdisplay />} />
             <Route path="/addcrop" element={<AddCropForm />} />
             <Route path="/bview" element={<Bview />} />

            
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App