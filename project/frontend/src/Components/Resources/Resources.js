import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceD from './ResourceD';
import { pdfjs } from 'react-pdf';
import './Resources.css'; // Import the CSS file
import Nav from '../Nav/Nav';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function Resources() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [allPdfFiles, setAllPdf] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query

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

  const submitPdf = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('formFile', file);
    formData.append('title', title);

    try {
      const result = await axios.post('http://localhost:5000/Resource/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (result.status === 200) {
        setMessage({ text: 'PDF uploaded successfully!', type: 'success' });
        setTitle('');
        setFile(null);
        getpdf();
      } else {
        setMessage({ text: 'PDF upload failed.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'PDF upload failed.', type: 'error' });
      console.error('Error uploading PDF:', error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  // Filter the PDFs based on the search query
  const filteredPdfs = allPdfFiles.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <div className="resource-hero-image">
                <h1>Government Resource Center</h1>
      </div>

      <div className="resources-container">
        <h1 className="resources-header">Resources</h1>
        <form className="upload-form" onSubmit={submitPdf}>
          <label className="form-label" htmlFor="resource">Resource Name:</label>
          <input
            className="form-input"
            type="text"
            id="resource"
            name="resource"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className="form-label">Select PDF file:</label>
          <input
            className="form-input file-input"
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button className="submit-button" type="submit">Submit</button>
        </form>

        {message.text && (
          <div className={`message-box ${message.type}-message`}>
            {message.text}
          </div>
        )}

        <div>
          <h2 className="resources-subheader">All Resources</h2><br />
          {/* New search input field */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search resources by title..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="pdf-list-container">
            {/* Display filtered PDFs */}
            {filteredPdfs.length > 0 ? (
              filteredPdfs.map((data) => (
                <div key={data._id} className="pdf-item">
                  <h3 className="pdf-title">{data.title}</h3>
                  <button className="show-pdf-button" onClick={() => showPdf(data.pdf)}>Show PDF</button>
                </div>
              ))
            ) : (
              <p className="placeholder-text">
                {searchQuery ? "No matching resources found." : "No resources available."}
              </p>
            )}
          </div>
        </div>
        <ResourceD pdfFile={pdfFile} />
      </div>
    </div>
  );
}

export default Resources;