import React, { useEffect, useState } from "react";
import backgroundImage from '../images/img.jpeg';
import axios from "axios";
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const BLUE = 0.8067; // Define BLUE variable
const CDM = 0.951; // Define CDM variable

function DisplayComponent({ result, anomalies, onBack }) {
  const [transactions, setTransactions] = useState(result.transactions);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [highlightFraud, setHighlightFraud] = useState(false); // State for toggling fraud highlight
  const fraudTransactionIndices = anomalies;

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditValues(transactions[index]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  const handleSaveClick = (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = editValues;
    setTransactions(updatedTransactions);
    setEditingIndex(null);
  };

  const handleCancelClick = () => {
    setEditingIndex(null);
  };

  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push(
      [
        "Client Name",
        "Bank Name",
        "Account No.",
        "Transaction Date",
        "Credit/Debit",
        "Description",
        "Amount",
        "Balance",
      ].join(",")
    );
    transactions.forEach((transaction) => {
      csvRows.push(
        [
          result.client_name,
          result.bank_name,
          result.account_number,
          transaction.transaction_date,
          transaction["credit/debit"],
          transaction.description,
          transaction.amount,
          transaction.balance,
        ].join(",")
      );
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHighlightFraud = () => {
    setHighlightFraud((prev) => !prev); // Toggle highlighting on and off
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



      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        <Paper       elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Reduce opacity to make background more visible
            position: "relative",
            backdropFilter: "blur(3px)", // Extra blur to enhance blending
          }}>
          <Typography variant="h6" gutterBottom>
            Transaction Details:
          </Typography>
          <TableRow>
            <TableCell
              colSpan={8}
              sx={{ textAlign: "center" ,backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(3px)"}}
            >
              <Typography variant="body1">BLUE: {BLUE}</Typography>
            </TableCell>
            <TableCell
              colSpan={8}
              sx={{ textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            >
              <Typography variant="body1">CDM: {CDM}</Typography>
            </TableCell>
          </TableRow>

          <TableContainer
            component={Paper}
            sx={{ maxHeight: 400, overflowY: "auto", backgroundColor: "rgba(255, 255, 255, 0.0)"}}
          >
            <Table stickyHeader >
              <TableHead >
                <TableRow >
                  <TableCell>
                    <strong>Client Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Bank Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Account No.</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Transaction Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Credit/Debit</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Balance</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        highlightFraud &&
                        fraudTransactionIndices.includes(index)
                          ? "rgba(255, 0, 0, 0.7)" // Highlight fraudulent transactions in red
                          : "inherit",
                    }}
                  >
                    <TableCell>{result.client_name}</TableCell>
                    <TableCell>{result.bank_name}</TableCell>
                    <TableCell>{result.account_number}</TableCell>
                    {editingIndex === index ? (
                      <>
                        <TableCell>
                          <TextField
                            name="transaction_date"
                            value={editValues.transaction_date}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="credit/debit"
                            value={editValues["credit/debit"]}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="description"
                            value={editValues.description}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="amount"
                            value={editValues.amount}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            name="balance"
                            value={editValues.balance}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSaveClick(index)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelClick}
                            sx={{ ml: 1 }}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{transaction.transaction_date}</TableCell>
                        <TableCell>{transaction["credit/debit"]}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.balance}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditClick(index)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Download Button and Highlight Fraud Button */}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="contained" color="primary" onClick={downloadCSV}>
              Download CSV
            </Button>
            <Button variant="contained" color="default" onClick={onBack}> Go Back</Button>
            <Button
              variant="contained"
              color={highlightFraud ? "secondary" : "error"} // Change button color based on state
              onClick={handleHighlightFraud}
            >
              {highlightFraud
                ? "Hide Fraud Transactions"
                : "Identify Fraud Transactions"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default DisplayComponent;



