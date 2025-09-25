import React from "react";
import Hero from "./Hero";
import Features from "./Features1";
import Categories from "./Categories";
import FeaturedResources from "./FeaturedResources";
import AvailableResources from "./AvailableResources";
import BlogSection from "./BlogSection";
import Newsletter from "./Newsletter"; 
import Navbar from './Nav/Nav';
import Nav from "./Nav/Nav2";
import Footer from './Footer/Footer';
import Navi from "../Features/Navi/Nav3";

function Resources() {
  return (
    <>
      <Nav />
      <Navi />
      <Hero />
      <Features />
      <FeaturedResources />
      <Categories />
      <AvailableResources />
      <BlogSection />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Resources;