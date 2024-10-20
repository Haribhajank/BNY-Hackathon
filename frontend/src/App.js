import React, { useState } from "react";
import "./App.css";
import UploadComponent from "./Components/UploadComponent";
import DisplayComponent from "./Components/DisplayComponent";

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = (data) => {
    console.log("Data received from the server:", data);
    setResult(data); // Store the actual extracted data
    setIsUploaded(true); // Indicate that upload was successful
  };

  const handleBack = () => {
    setIsUploaded(false); // Go back to the upload page
    setResult(null); // Clear the result data
  };

  return (
    <div className="App">
      {isUploaded ? (
        <DisplayComponent result={result} onBack={handleBack} />
      ) : (
        <UploadComponent onViewResults={handleUpload} />
      )}
    </div>
  );
}

export default App;

