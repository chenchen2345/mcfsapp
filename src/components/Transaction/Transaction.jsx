import React, { useState, useEffect } from 'react';
import './Transaction.css';
import {
  fetchTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions,
  fetchFraudReports,
  getFraudReportByTransaction,
  generateFraudReport
} from '../../services/api';

const Transaction = () => {
  // Transaction related states
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    type: '', amount: '', nameOrig: '', oldBalanceOrig: '', newBalanceOrig: '', nameDest: '', oldBalanceDest: '', newBalanceDest: ''
  });
  const [selectedId, setSelectedId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [fraudReports, setFraudReports] = useState([]);

  useEffect(() => { 
    loadTransactions(); 
    loadFraudReports();
  }, [page, size]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, size };
      const data = await fetchTransactions(params);
      if (data && data.transactions) {
        setTransactions(data.transactions);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        setTransactions(data);
        setTotal(data.length);
      } else {
        setTransactions([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const loadFraudReports = async () => {
    try {
      const data = await fetchFraudReports();
      if (data && data.fraud_reports) {
        setFraudReports(data.fraud_reports);
      } else if (Array.isArray(data)) {
        setFraudReports(data);
      } else {
        setFraudReports([]);
      }
    } catch (err) {
      console.error('Failed to load fraud reports:', err);
      setFraudReports([]);
    }
  };

  const handleOpenDialog = (mode, tx = null) => {
    setDialogMode(mode);
    setShowDialog(true);
    if (mode === 'edit' && tx) {
      setFormData({ ...tx });
      setSelectedId(tx.id);
    } else {
      setFormData({ type: '', amount: '', nameOrig: '', oldBalanceOrig: '', newBalanceOrig: '', nameDest: '', oldBalanceDest: '', newBalanceDest: '' });
      setSelectedId(null);
    }
  };

  const handleDialogChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDialogSubmit = async e => {
    e.preventDefault();
    try {
      if (dialogMode === 'create') {
        await createTransaction(formData);
      } else if (dialogMode === 'edit' && selectedId) {
        await updateTransaction(selectedId, formData);
      }
      setShowDialog(false);
      loadTransactions();
    } catch (err) {
      alert('Operation failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      loadTransactions();
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleImport = async e => {
    e.preventDefault();
    if (!csvFile) return;
    setImporting(true);
    try {
      await importTransactions(csvFile);
      setCsvFile(null);
      loadTransactions();
      alert('Import successful');
    } catch (err) {
      alert('Import failed: ' + (err.message || 'Unknown error'));
    } finally {
      setImporting(false);
    }
  };

  const handleGenerateReport = async id => {
    try {
      await generateFraudReport(id);
      loadFraudReports();
      alert('Report generated successfully');
    } catch (err) {
      alert('Failed to generate report: ' + (err.message || 'Unknown error'));
    }
  };

  const getFraudReportForTransaction = (transactionId) => {
    return fraudReports.find(report => report.transaction_id === transactionId);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Search functionality (local filtering)
  const filteredTransactions = transactions.filter(tx => {
    if (!search) return true;
    return (
      tx.nameOrig?.toLowerCase().includes(search.toLowerCase()) ||
      tx.nameDest?.toLowerCase().includes(search.toLowerCase()) ||
      String(tx.id).includes(search) ||
      tx.type?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>Transaction Management</h2>
        <input className="search-input" placeholder="Search by account/name/ID/type" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="transaction-table-wrapper">
        {loading ? <div className="loading">Loading...</div> : error ? <div className="error">{error}</div> : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Sender</th>
                <th>Sender Balance</th>
                <th>Receiver</th>
                <th>Receiver Balance</th>
                <th>Fraud Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => {
                const fraudReport = getFraudReportForTransaction(tx.id);
                return (
                  <tr key={tx.id} className={tx.isFraud ? 'fraud-row' : ''}>
                    <td>{tx.id}</td>
                    <td>
                      <span className={`transaction-type ${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="amount-cell">{formatAmount(tx.amount)}</td>
                    <td>{tx.nameOrig}</td>
                    <td>
                      {formatAmount(tx.oldBalanceOrig)} → {formatAmount(tx.newBalanceOrig)}
                    </td>
                    <td>{tx.nameDest}</td>
                    <td>
                      {formatAmount(tx.oldBalanceDest)} → {formatAmount(tx.newBalanceDest)}
                    </td>
                    <td>
                      {tx.isFraud ? (
                        <span className="fraud-badge">Fraud Detected</span>
                      ) : (
                        <span className="safe-badge">Safe</span>
                      )}
                    </td>
                    <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleOpenDialog('edit', tx)}>Edit</button>
                      <button onClick={() => handleDelete(tx.id)}>Delete</button>
                      {fraudReport ? (
                        <button className="report-available">Report Available</button>
                      ) : (
                        <button onClick={() => handleGenerateReport(tx.id)}>Generate Report</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      <div className="transaction-pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page}</span>
        <button disabled={page * size >= total} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {/* Bottom Actions */}
      <div className="transaction-actions-bottom">
        <button onClick={() => handleOpenDialog('create')}>New Transaction</button>
        <form onSubmit={handleImport} className="import-form" style={{ display: 'inline-block' }}>
          <label htmlFor="csv-upload-btn" className="import-csv-btn" style={{ cursor: 'pointer' }}>
            {importing ? 'Importing...' : 'Import CSV'}
            <input
              id="csv-upload-btn"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={e => {
                setCsvFile(e.target.files[0]);
                if (e.target.files[0]) {
                  setTimeout(() => {
                    e.target.form.requestSubmit();
                  }, 0);
                }
              }}
            />
          </label>
        </form>
      </div>
      {/* Create/Edit Dialog */}
      {showDialog && (
        <div className="transaction-dialog-backdrop" onClick={() => setShowDialog(false)}>
          <div className="transaction-dialog" onClick={e => e.stopPropagation()}>
            <h3>{dialogMode === 'create' ? 'New Transaction' : 'Edit Transaction'}</h3>
            <form onSubmit={handleDialogSubmit} className="transaction-dialog-form">
              <label>Type:
                <select name="type" value={formData.type} onChange={handleDialogChange} required>
                  <option value="">Select Type</option>
                  <option value="CASH_IN">Cash In</option>
                  <option value="CASH_OUT">Cash Out</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="PAYMENT">Payment</option>
                </select>
              </label>
              <label>Amount:<input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleDialogChange} required /></label>
              <label>Sender:<input name="nameOrig" value={formData.nameOrig} onChange={handleDialogChange} required /></label>
              <label>Sender Old Balance:<input name="oldBalanceOrig" type="number" step="0.01" value={formData.oldBalanceOrig} onChange={handleDialogChange} required /></label>
              <label>Sender New Balance:<input name="newBalanceOrig" type="number" step="0.01" value={formData.newBalanceOrig} onChange={handleDialogChange} required /></label>
              <label>Receiver:<input name="nameDest" value={formData.nameDest} onChange={handleDialogChange} required /></label>
              <label>Receiver Old Balance:<input name="oldBalanceDest" type="number" step="0.01" value={formData.oldBalanceDest} onChange={handleDialogChange} required /></label>
              <label>Receiver New Balance:<input name="newBalanceDest" type="number" step="0.01" value={formData.newBalanceDest} onChange={handleDialogChange} required /></label>
              <div className="transaction-dialog-actions">
                <button type="submit" className="equal-width-btn">Save</button>
                <button type="button" className="equal-width-btn" onClick={() => setShowDialog(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction; 