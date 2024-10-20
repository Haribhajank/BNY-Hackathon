import React, { useEffect, useState } from "react";
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

const data = {
  client_name: "John Doe",
  bank_name: "B1 Bank",
  account_number: "1261234567",
  transactions: [
    {
      transaction_date: "08/19/2020",
      "credit/debit": "Credit",
      description: "Correction: Cash Withdrawal GCC",
      amount: "90.00",
      balance: "132.27",
    },
    {
      transaction_date: "08/20/2020",
      "credit/debit": "Debit",
      description: "Correction: ATM Cash Withdrawal Fee",
      amount: "6.56",
      balance: "138.83",
    },
    {
      transaction_date: "08/21/2020",
      "credit/debit": "Credit",
      description: "Banking App Payment Received A Pieterse",
      amount: "1000.00",
      balance: "1138.83",
    },
    {
      transaction_date: "08/22/2020",
      "credit/debit": "Credit",
      description: "Banking App Payment Lindo",
      amount: "100.00",
      balance: "1038.83",
    },
    {
      transaction_date: "08/17/2020",
      "credit/debit": "Debit",
      description: "Banking App Payment Fee",
      amount: "1.60",
      balance: "1037.23",
    },
    {
      transaction_date: "08/16/2020",
      "credit/debit": "Credit",
      description: "Correction: Cash Withdrawal GCC",
      amount: "100.00",
      balance: "132.27",
    },
    {
      transaction_date: "08/15/2020",
      "credit/debit": "Debit",
      description: "Correction: ATM Cash Withdrawal Fee",
      amount: "7.56",
      balance: "138.83",
    },
    {
      transaction_date: "08/14/2020",
      "credit/debit": "Credit",
      description: "Banking App Payment Received A Pieterse",
      amount: "300.00",
      balance: "1138.83",
    },
    {
      transaction_date: "08/13/2020",
      "credit/debit": "Credit",
      description: "Banking App Payment Lindo",
      amount: "200.00",
      balance: "1038.83",
    },
    {
      transaction_date: "08/12/2020",
      "credit/debit": "Debit",
      description: "Banking App Payment Fee",
      amount: "21.60",
      balance: "1037.23",
    },
    // Add remaining transactions here...
  ],
};
const fraudTransactionIndices = [1, 4, 7]; // Array of indices representing potential fraudulent transactions

function DisplayComponent({ result, onBack }) {
  const [transactions, setTransactions] = useState(result.transactions);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [highlightFraud, setHighlightFraud] = useState(false); // State for toggling fraud highlight

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
          data.client_name,
          data.bank_name,
          data.account_number,
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
      {/* AppBar for top-left header with Avatar */}
      <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
            <AccountBalanceIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Best-in-Class (BIC) Bank
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" gutterBottom>
            Transaction Details:
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ maxHeight: 400, overflowY: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
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
                          ? "rgba(255, 0, 0, 0.2)" // Highlight fraudulent transactions in red
                          : "inherit",
                    }}
                  >
                    <TableCell>{data.client_name}</TableCell>
                    <TableCell>{data.bank_name}</TableCell>
                    <TableCell>{data.account_number}</TableCell>
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


// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Paper,
//   Box,
//   Typography,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Button,
//   Avatar,
//   AppBar,
//   Toolbar,
// } from "@mui/material";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

// const fraudTransactionIndices = [1, 4, 7];

// function DisplayComponent({ result, onBack }) {
//   // Ensure result and transactions exist before setting state
//   const [transactions, setTransactions] = useState([]);
//   const [highlightFraud, setHighlightFraud] = useState(false);

//   // Set transactions once result is passed from the parent
//   useEffect(() => {
//     if (result && result.transactions) {
//       console.log("Transactions received:", result.transactions);
//       setTransactions(result.transactions);
//     } else {
//       console.log("No transactions found or result is undefined");
//     }
//   }, [result]);

//   const downloadCSV = () => {
//     const csvRows = [];
//     csvRows.push(
//       [
//         "Client Name",
//         "Bank Name",
//         "Account No.",
//         "Transaction Date",
//         "Credit/Debit",
//         "Description",
//         "Amount",
//         "Balance",
//       ].join(",")
//     );
//     transactions.forEach((transaction) => {
//       csvRows.push(
//         [
//           result.client_name,
//           result.bank_name,
//           result.account_number,
//           transaction.transaction_date,
//           transaction["credit/debit"],
//           transaction.description,
//           transaction.amount,
//           transaction.balance,
//         ].join(",")
//       );
//     });

//     const csvString = csvRows.join("\n");
//     const blob = new Blob([csvString], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "transactions.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleHighlightFraud = () => {
//     setHighlightFraud((prev) => !prev);
//   };

//   return (
//     <>
//       <AppBar position="static" sx={{ bgcolor: "primary.main" }}>
//         <Toolbar>
//           <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
//             <AccountBalanceIcon />
//           </Avatar>
//           <Typography variant="h6" fontWeight="bold">
//             Best-in-Class (BIC) Bank
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Container sx={{ mt: 5 }}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
//           <Typography variant="h6" gutterBottom>
//             Transaction Details:
//           </Typography>

//           {/* Ensure transactions are available before rendering */}
//           {transactions.length > 0 ? (
//             <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Transaction Date</TableCell>
//                     <TableCell>Credit/Debit</TableCell>
//                     <TableCell>Description</TableCell>
//                     <TableCell>Amount</TableCell>
//                     <TableCell>Balance</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {transactions.map((transaction, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{transaction.transaction_date}</TableCell>
//                       <TableCell>{transaction["credit/debit"]}</TableCell>
//                       <TableCell>{transaction.description}</TableCell>
//                       <TableCell>{transaction.amount}</TableCell>
//                       <TableCell>{transaction.balance}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Typography variant="body1" color="textSecondary">
//               No transactions available.
//             </Typography>
//           )}

//           <Box display="flex" justifyContent="space-between" mt={3}>
//             <Button variant="contained" color="primary" onClick={downloadCSV}>
//               Download CSV
//             </Button>
//             <Button variant="contained" color="default" onClick={onBack}>
//               Go Back
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
//     </>
//   );
// }

// export default DisplayComponent;


