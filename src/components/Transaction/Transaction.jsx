import React, { useState, useEffect } from 'react';
import './Transaction.css';
import {
  fetchTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions
} from '../../services/api';

const Transaction = () => {
  // Transaction related states
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    nameOrig: '',
    oldBalanceOrig: '',
    newBalanceOrig: '',
    nameDest: '',
    oldBalanceDest: '',
    newBalanceDest: ''
  });
  const [selectedId, setSelectedId] = useState(null);
  const [importing, setImporting] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    loadTransactions();
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

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      loadTransactions();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const transaction = await getTransaction(parseInt(searchId));
      if (transaction) {
        setTransactions([transaction]);
        setTotal(1);
      } else {
        setTransactions([]);
        setTotal(0);
      }
    } catch (err) {
      setError('Transaction not found');
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, tx = null) => {
    setDialogMode(mode);
    setShowDialog(true);
    if (mode === 'edit' && tx) {
      setFormData({
        type: tx.type || '',
        amount: tx.amount ? tx.amount.toString() : '',
        nameOrig: tx.nameOrig || '',
        oldBalanceOrig: tx.oldBalanceOrig ? tx.oldBalanceOrig.toString() : '',
        newBalanceOrig: tx.newBalanceOrig ? tx.newBalanceOrig.toString() : '',
        nameDest: tx.nameDest || '',
        oldBalanceDest: tx.oldBalanceDest ? tx.oldBalanceDest.toString() : '',
        newBalanceDest: tx.newBalanceDest ? tx.newBalanceDest.toString() : ''
      });
      setSelectedId(tx.id);
    } else {
      setFormData({
        type: '',
        amount: '',
        nameOrig: '',
        oldBalanceOrig: '',
        newBalanceOrig: '',
        nameDest: '',
        oldBalanceDest: '',
        newBalanceDest: ''
      });
      setSelectedId(null);
    }
  };

  const handleDialogChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDialogSubmit = async e => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.type || !formData.nameOrig || !formData.nameDest) {
      alert('Please fill in all required fields (Type, Name Orig, Name Dest)');
      return;
    }

    // Validate numeric fields
    const amount = parseFloat(formData.amount);
    const oldBalanceOrig = parseFloat(formData.oldBalanceOrig);
    const newBalanceOrig = parseFloat(formData.newBalanceOrig);
    const oldBalanceDest = parseFloat(formData.oldBalanceDest);
    const newBalanceDest = parseFloat(formData.newBalanceDest);

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount (must be greater than 0)');
      return;
    }

    if (isNaN(oldBalanceOrig) || isNaN(newBalanceOrig) || isNaN(oldBalanceDest) || isNaN(newBalanceDest)) {
      alert('Please enter valid balance amounts');
      return;
    }

    try {
      // Convert string values to numbers for numeric fields
      const processedFormData = {
        ...formData,
        amount: amount,
        oldBalanceOrig: oldBalanceOrig,
        newBalanceOrig: newBalanceOrig,
        oldBalanceDest: oldBalanceDest,
        newBalanceDest: newBalanceDest
      };

      if (dialogMode === 'create') {
        await createTransaction(processedFormData);
      } else if (dialogMode === 'edit' && selectedId) {
        await updateTransaction(selectedId, processedFormData);
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

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  const getFraudStatus = (transaction) => {
    if (transaction.isFraud) {
      return <span className="fraud-badge">Fraud Detected</span>;
    }
    return <span className="safe-badge">Safe</span>;
  };

  const getFraudProbability = (transaction) => {
    if (transaction.fraudProbability !== undefined && transaction.fraudProbability !== null) {
      return `${(transaction.fraudProbability * 100).toFixed(2)}%`;
    }
    return 'N/A';
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>Transaction Management</h2>
        <div className="search-section">
          <input 
            className="search-input" 
            placeholder="Search by Transaction ID" 
            value={searchId} 
            onChange={e => setSearchId(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearchById()}
          />
          <button onClick={handleSearchById}>Search</button>
          <button onClick={() => { setSearchId(''); loadTransactions(); }}>Clear</button>
        </div>
      </div>

      <div className="transaction-table-wrapper">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Name Orig</th>
                <th>Old Balance Orig</th>
                <th>New Balance Orig</th>
                <th>Name Dest</th>
                <th>Old Balance Dest</th>
                <th>New Balance Dest</th>
                <th>Is Fraud</th>
                <th>Fraud Probability</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className={tx.isFraud ? 'fraud-row' : ''}>
                  <td>{tx.id}</td>
                  <td>
                    <span className={`transaction-type ${tx.type?.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="amount-cell">{formatAmount(tx.amount)}</td>
                  <td>{tx.nameOrig}</td>
                  <td>{formatAmount(tx.oldBalanceOrig)}</td>
                  <td>{formatAmount(tx.newBalanceOrig)}</td>
                  <td>{tx.nameDest}</td>
                  <td>{formatAmount(tx.oldBalanceDest)}</td>
                  <td>{formatAmount(tx.newBalanceDest)}</td>
                  <td>{getFraudStatus(tx)}</td>
                  <td>{getFraudProbability(tx)}</td>
                  <td>{formatDate(tx.createdAt)}</td>
                  <td>{formatDate(tx.updatedAt)}</td>
                  <td>
                    <button onClick={() => handleOpenDialog('edit', tx)}>Edit</button>
                    <button onClick={() => handleDelete(tx.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="transaction-pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {Math.ceil(total / size)}</span>
        <span>Total: {total} transactions</span>
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
              <div className="form-row">
                <label>
                  Type:
                  <select name="type" value={formData.type} onChange={handleDialogChange} required>
                    <option value="">Select Type</option>
                    <option value="CASH_IN">Cash In</option>
                    <option value="CASH_OUT">Cash Out</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="PAYMENT">Payment</option>
                  </select>
                </label>
                <label>
                  Amount:
                  <input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleDialogChange} required />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Name Orig:
                  <input name="nameOrig" value={formData.nameOrig} onChange={handleDialogChange} required />
                </label>
                <label>
                  Old Balance Orig:
                  <input name="oldBalanceOrig" type="number" step="0.01" value={formData.oldBalanceOrig} onChange={handleDialogChange} required />
                </label>
              </div>

              <div className="form-row">
                <label>
                  New Balance Orig:
                  <input name="newBalanceOrig" type="number" step="0.01" value={formData.newBalanceOrig} onChange={handleDialogChange} required />
                </label>
                <label>
                  Name Dest:
                  <input name="nameDest" value={formData.nameDest} onChange={handleDialogChange} required />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Old Balance Dest:
                  <input name="oldBalanceDest" type="number" step="0.01" value={formData.oldBalanceDest} onChange={handleDialogChange} required />
                </label>
                <label>
                  New Balance Dest:
                  <input name="newBalanceDest" type="number" step="0.01" value={formData.newBalanceDest} onChange={handleDialogChange} required />
                </label>
              </div>

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