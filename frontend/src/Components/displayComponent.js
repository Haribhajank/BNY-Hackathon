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
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch transactions from the backend
    axios.get('http://localhost:5000/transactions')
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  return (
    <div>
      <h2>Bank Transactions</h2>
      {transactions.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
}

export default DisplayComponent;
