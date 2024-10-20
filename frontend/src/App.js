import React, { useState } from "react";
import "./App.css";
import UploadComponent from "./Components/UploadComponent";
import DisplayComponent from "./Components/DisplayComponent";

function App() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [result, setResult] = useState(null);
  const [anomalies, setAnomalies] = useState([]); // Store anomaly indices

  const handleUpload = (data, anomalyIndices) => {
    console.log("Data received from the server:", data);
    console.log("Anomalies detected:", anomalyIndices);

    setResult(data); // Store the actual extracted data
    setAnomalies(anomalyIndices); // Store anomalies
    setIsUploaded(true); // Indicate that upload was successful
  };

  const handleBack = () => {
    setIsUploaded(false); // Go back to the upload page
    setResult(null); // Clear the result data
    setAnomalies([]); // Clear the anomaly data
  };

  return (
    <div className="App">
      {isUploaded ? (
        <DisplayComponent result={result} anomalies={anomalies} onBack={handleBack} />
      ) : (
        <UploadComponent onViewResults={handleUpload} />
      )}
    </div>
  );
}

export default App;

