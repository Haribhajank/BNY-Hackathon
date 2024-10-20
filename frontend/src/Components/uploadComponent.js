import React, { useState } from "react";
import backgroundImage from '../images/img.jpeg';
import axios from "axios";
import {
  Typography,
  Box,
  Button,
  Input,
  Paper,
  Container,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function UploadComponent({ onViewResults }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

axios
  .post("http://127.0.0.1:8000/pdf/upload/", formData)
  .then((response) => {
    setLoading(false);
    setMessage("File uploaded and processed successfully.");

    // Passing both data and anomalies to the parent component
    onViewResults(response.data.data, response.data.anomalies);
  })
  .catch((error) => {
    setLoading(false);
    setMessage("Error uploading file.");
    console.error(error);
  })
};

  return (
    <>
      {/* Background wrapper with blur effect */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          zIndex: -1,
        }}
      />
      {/* AppBar with reduced opacity */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "rgba(25, 118, 210, 0.7)", // Reduce opacity of primary color
          backdropFilter: "blur(3px)", // Ensure blur effect is applied
        }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: "rgba(244, 143, 177, 0.8)", mr: 2 }}>
            <AccountBalanceIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
          Best-in-Class (BIC) Bank
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 5 }}>
    {/* Paper with reduced opacity to allow background to show through */}
           <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Reduce opacity to make background more visible
            position: "relative",
            backdropFilter: "blur(3px)", // Extra blur to enhance blending
          }}
        >
          {/* Keep content fully visible with another Box */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ zIndex: 2 }}
          >
            <Typography variant="h4" gutterBottom>
              Upload Bank Statement PDF
            </Typography>

            <Input
              type="file"
              onChange={onFileChange}
              sx={{ mt: 3, mb: 2 }}
              disableUnderline
              inputProps={{
                accept: ".pdf",
              }}
            />

            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={onFileUpload}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>

            {message && (
              <Alert
                severity={message.includes("Error") ? "error" : "success"}
                sx={{ mt: 2 }}
              >
                {message}
              </Alert>
            )}

            {extractedData && (
                        <Box mt={4} width="100%">
                          <Typography variant="h6" gutterBottom>
                            Extracted Data
                          </Typography>
                          <Paper
                            elevation={1}
                            sx={{ p: 2, maxHeight: 300, overflowY: "auto" }}
                          >
                            <pre>{JSON.stringify(extractedData, null, 2)}</pre>
                          </Paper>

                          {/* View Results Button */}
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 2 }}
                            onClick={onViewResults} // Call the prop function to view results
                          >
                            View Results
                          </Button>
                        </Box>
                      )}
                      </Box>
        </Paper>
      </Container>
    </>
  );
}

export default UploadComponent;

