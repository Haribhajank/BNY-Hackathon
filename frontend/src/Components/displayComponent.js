import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Box,
  Avatar,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// function DisplayComponent() {
//   const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     // Fetch transactions from the backend
//     axios
//       .get("http://localhost:5000/transactions")
//       .then((response) => {
//         setTransactions(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching transactions:", error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Bank Transactions</h2>
//       {transactions.length > 0 ? (
//         <table border="1">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Date</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((transaction) => (
//               <tr key={transaction.id}>
//                 <td>{transaction.id}</td>
//                 <td>{transaction.date}</td>
//                 <td>{transaction.amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No transactions found</p>
//       )}
//     </div>
//   );
// }
// const data = {
//   client_name: "John Doe",
//   bank_name: "B1 Bank",
//   account_number: "1261234567",
//   transactions: [
//     {
//       posting_date: "08/31/2020",
//       transaction_date: "08/19/2020",
//       description: "Correction: Cash Withdrawal GCC",
//       money_in: "100.00",
//       money_out: "null",
//       balance: "132.27",
//     },
//     {
//       posting_date: "08/31/2020",
//       transaction_date: "08/19/2020",
//       description: "Correction: ATM Cash Withdrawal Fee",
//       money_in: "null",
//       money_out: "6.56",
//       balance: "138.83",
//     },
//     // Add more transaction data...
//   ],
// };
const data = {
  client_name: "John Doe",
  bank_name: "B1 Bank",
  account_number: "1261234567",
  transactions: [
    {
      transaction_date: "08/19/2020",
      "credit/debit": "Credit",
      description: "Correction: Cash Withdrawal GCC",
      amount: "100.00",
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

function DisplayComponent() {
  const [transactions, setTransactions] = useState(data.transactions);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [sortKey, setSortKey] = useState("transaction_date");
  const [sortDirection, setSortDirection] = useState("ascending");

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
    // Create header row
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

    // Create data rows
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

    // Create a CSV Blob
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and click it to download the CSV
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applySort = (key) => {
    const direction =
      sortKey === key && sortDirection === "ascending"
        ? "descending"
        : "ascending";
    const sortedTransactions = [...transactions].sort((a, b) => {
      const aValue =
        key === "transaction_date" ? new Date(a[key]) : parseFloat(a[key]);
      const bValue =
        key === "transaction_date" ? new Date(b[key]) : parseFloat(b[key]);

      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setTransactions(sortedTransactions);
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        {/* Client Details Section */}
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            <AccountBalanceIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {"BANK OF TUNDLA"}
            </Typography>
          </Box>
        </Box>

        {/* Transactions Table */}
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
                  <strong>
                    Transaction Date
                    <IconButton onClick={() => applySort("transaction_date")}>
                      {sortKey === "transaction_date" &&
                      sortDirection === "ascending" ? (
                        <ArrowUpwardIcon fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" />
                      )}
                    </IconButton>
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>Credit/Debit</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>
                    Amount
                    <IconButton onClick={() => applySort("amount")}>
                      {sortKey === "amount" && sortDirection === "ascending" ? (
                        <ArrowUpwardIcon fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" />
                      )}
                    </IconButton>
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>
                    Balance
                    <IconButton onClick={() => applySort("balance")}>
                      {sortKey === "balance" &&
                      sortDirection === "ascending" ? (
                        <ArrowUpwardIcon fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" />
                      )}
                    </IconButton>
                  </strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
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

        {/* Download Button */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button variant="contained" color="primary" onClick={downloadCSV}>
            Download CSV
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default DisplayComponent;
