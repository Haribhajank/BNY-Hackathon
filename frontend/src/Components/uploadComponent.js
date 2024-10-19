import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [extractedData, setExtractedData] = useState(null);


  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const onFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);


    axios.post('http://localhost:5000/upload', formData)
      .then((response) => {
        setMessage('File uploaded and processed successfully');
        setExtractedData(response.data.data);  // Save the extracted data
      })
      .catch((error) => {
        setMessage('Error uploading file');
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Upload Bank Statement PDF</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      {message && <p>{message}</p>}
      {extractedData && (
        <div>
          <h3>Extracted Data</h3>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
