import React, { useState } from 'react';
import './App.css';
import UploadComponent from './Components/UploadComponent';
import DisplayComponent from './Components/DisplayComponent';

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (file) => {
    console.log('File uploaded:', file);

    setTimeout(() => {
      const simulatedResult = 'This is the result from the backend!';  
      setResult(simulatedResult);
      setIsUploaded(true);
    }, 1000); 
  };


  const handleBack = () => {
    setIsUploaded(false);
    setResult(null);
  };

  return (
    <div className="App">
      {isUploaded ? (
        <DisplayComponent result={result} onBack={handleBack} />
      ) : (
        <UploadComponent onUpload={handleUpload} />
      )}
    </div>
  );
}

export default App;
