import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceD from './ResourceD';
import './Resources.css';
import Nav from "../Home/Nav/Nav2";
import Navi from "../Features/Navi/Nav3";
import Footer from "../Home/Footer/Footer";

function VResources() {
  const [allPdfFiles, setAllPdf] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getpdf();
  }, []);

  const getpdf = async () => {
    try {
      const result = await axios.get('http://localhost:5000/Resource/getpdf');
      setAllPdf(result.data.data || []);
    } catch (error) {
      setAllPdf([]);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  const filteredPdfs = allPdfFiles.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <div className="forms-hero-image">
        <Navi />
          <h1>Government Resource Center</h1>
      </div>
      <div className="resources-container">
        <h1 className="resources-header">Resources</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search resources by title..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <h2 className="resources-subheader">All Resources</h2>
          <div className="pdf-list-container">
            {filteredPdfs && filteredPdfs.length > 0 ? (
              filteredPdfs.map((data) => (
                <div key={data._id} className="pdf-item">
                  <h3 className="pdf-title">{data.title}</h3>
                  <button className="show-pdf-button" onClick={() => showPdf(data.pdf)}>
                    Show PDF
                  </button>
                </div>
              ))
            ) : (
              <p className="placeholder-text">No matching resources found.</p>
            )}
          </div>
        </div>
        <ResourceD pdfFile={pdfFile} />
      </div>
       <Footer /> 
    </div>
  );
}

export default VResources;