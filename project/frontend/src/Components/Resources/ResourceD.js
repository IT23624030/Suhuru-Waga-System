import React, { useState } from 'react';
import { Document, Page } from 'react-pdf'

function ResourceD(props) {
  const [numPages, setNumPages] = useState();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-viewer-container">
      {props.pdfFile ? (
        <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          <div className="pdf-viewer-content">
            {Array.apply(null, Array(numPages))
              .map((x, i) => i + 1)
              .map((page) => (
                <Page
                  key={`page_${page}`}
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
          </div>
        </Document>
      ) : (
        <p className="placeholder-text">No PDF file selected</p>
      )}
    </div>
  );
}

export default ResourceD;