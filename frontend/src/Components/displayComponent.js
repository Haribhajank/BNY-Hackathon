import React, { useState } from 'react';
import UploadComponent from './UploadComponent';

function DisplayComponent() {
  const [transactions, setTransactions] = useState([]);

  const handleUploadSuccess = (data) => {
    setTransactions(data.transactions);  // Update the state with the uploaded transactions
  };

  return (
    <div>
      <UploadComponent onUploadSuccess={handleUploadSuccess} />
      <h2>Bank Transactions</h2>
      {transactions.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Credit/Debit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.transaction_date}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.description}</td>
                <td>{transaction['credit/debit']}</td>
                <td>{transaction.balance}</td>
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
