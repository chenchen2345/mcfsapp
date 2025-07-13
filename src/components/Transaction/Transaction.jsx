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
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [page, size]);

  const loadTransactions = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, size };
      
      // 如果是强制刷新，添加时间戳参数避免缓存
      if (forceRefresh) {
        params._t = Date.now();
      }
      
      const data = await fetchTransactions(params);
      console.log('Backend response data:', data); // 调试信息
      
      if (data && data.transactions) {
        console.log('Transactions with structure:', data.transactions.map(tx => ({
          id: tx.id,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
          hasUpdatedAt: 'updatedAt' in tx
        }))); // 调试信息
        setTransactions(data.transactions);
        setTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        console.log('Direct array response:', data.map(tx => ({
          id: tx.id,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
          hasUpdatedAt: 'updatedAt' in tx
        }))); // 调试信息
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
        amount: tx.amount !== null && tx.amount !== undefined ? tx.amount.toString() : '',
        nameOrig: tx.nameOrig || '',
        oldBalanceOrig: tx.oldBalanceOrig !== null && tx.oldBalanceOrig !== undefined ? tx.oldBalanceOrig.toString() : '',
        newBalanceOrig: tx.newBalanceOrig !== null && tx.newBalanceOrig !== undefined ? tx.newBalanceOrig.toString() : '',
        nameDest: tx.nameDest || '',
        oldBalanceDest: tx.oldBalanceDest !== null && tx.oldBalanceDest !== undefined ? tx.oldBalanceDest.toString() : '',
        newBalanceDest: tx.newBalanceDest !== null && tx.newBalanceDest !== undefined ? tx.newBalanceDest.toString() : ''
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
    
    // 转换数值字段为数字类型
    const processedData = {
      ...formData,
      amount: formData.amount === '' ? 0 : parseFloat(formData.amount) || 0,
      oldBalanceOrig: formData.oldBalanceOrig === '' ? 0 : parseFloat(formData.oldBalanceOrig) || 0,
      newBalanceOrig: formData.newBalanceOrig === '' ? 0 : parseFloat(formData.newBalanceOrig) || 0,
      oldBalanceDest: formData.oldBalanceDest === '' ? 0 : parseFloat(formData.oldBalanceDest) || 0,
      newBalanceDest: formData.newBalanceDest === '' ? 0 : parseFloat(formData.newBalanceDest) || 0
    };
    
    try {
      if (dialogMode === 'create') {
        await createTransaction(processedData);
        // 创建后重新加载列表
        setTimeout(() => {
          loadTransactions(true);
        }, 100);
      } else if (dialogMode === 'edit' && selectedId) {
        // 更新操作
        const updatedTransaction = await updateTransaction(selectedId, processedData);
        console.log('Updated transaction response:', updatedTransaction); // 调试信息
        
        // 直接更新本地状态中的对应记录
        setTransactions(prevTransactions => 
          prevTransactions.map(tx => 
            tx.id === selectedId 
              ? {
                  ...tx,
                  ...updatedTransaction, // 使用后端返回的完整数据
                  updatedAt: updatedTransaction.updatedAt // 确保updatedAt字段被正确设置
                }
              : tx
          )
        );
      }
      setShowDialog(false);
    } catch (err) {
      // 显示详细的错误信息
      let errorMessage = 'Operation failed';
      if (err.message) {
        errorMessage += ': ' + err.message;
      }
      if (err.details) {
        errorMessage += ' - ' + err.details;
      }
      alert(errorMessage);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      // 直接从本地状态中移除被删除的记录
      setTransactions(prevTransactions => 
        prevTransactions.filter(tx => tx.id !== id)
      );
      // 更新总数
      setTotal(prevTotal => prevTotal - 1);
    } catch (err) {
      // 显示详细的错误信息
      let errorMessage = 'Delete failed';
      if (err.message) {
        errorMessage += ': ' + err.message;
      }
      if (err.details) {
        errorMessage += ' - ' + err.details;
      }
      alert(errorMessage);
    }
  };

  const handleImport = async e => {
    e.preventDefault();
    if (!csvFile) return;
    
    setImporting(true);
    setImportError(null);
    setImportSuccess(null);
    
    try {
      const result = await importTransactions(csvFile);
      setCsvFile(null);
      loadTransactions(true);
      
      // 显示成功信息
      const successMessage = result.count 
        ? `Successfully imported ${result.count} transactions`
        : 'Import successful';
      setImportSuccess(successMessage);
      
      // 3秒后清除成功消息
      setTimeout(() => setImportSuccess(null), 3000);
    } catch (err) {
      // 显示详细错误信息
      setImportError(err.message || 'Unknown error occurred');
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

  const formatUpdatedAt = (createdAt, updatedAt) => {
    console.log('formatUpdatedAt called with:', { createdAt, updatedAt }); // 调试信息
    
    // 如果updatedAt不存在、为空或为零值，显示"Not modified"
    if (!updatedAt || updatedAt === '' || updatedAt === '0001-01-01T00:00:00Z') {
      console.log('UpdatedAt is empty or zero value, showing "Not modified"');
      return 'Not modified';
    }
    
    // 如果updatedAt与createdAt相同，说明记录没有被修改过
    if (createdAt && updatedAt && new Date(createdAt).getTime() === new Date(updatedAt).getTime()) {
      console.log('UpdatedAt equals CreatedAt, showing "Not modified"');
      return 'Not modified';
    }
    
    console.log('UpdatedAt is valid, showing formatted time');
    return new Date(updatedAt).toLocaleString();
  };

  const getFraudStatus = (transaction) => {
    if (transaction.isFraud) {
      return <span className="fraud-badge">Fraud Detected</span>;
    }
    return <span className="safe-badge">Safe</span>;
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
                  <td>{formatDate(tx.createdAt)}</td>
                  <td>{formatUpdatedAt(tx.createdAt, tx.updatedAt)}</td>
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

      {/* Import Status Messages */}
      {importError && (
        <div className="import-error-message">
          <strong>Import Error:</strong> {importError}
          <button onClick={() => setImportError(null)}>×</button>
        </div>
      )}
      
      {importSuccess && (
        <div className="import-success-message">
          <strong>Success:</strong> {importSuccess}
          <button onClick={() => setImportSuccess(null)}>×</button>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="transaction-actions-bottom">
        <button onClick={() => handleOpenDialog('create')}>New Transaction</button>
        <form onSubmit={handleImport} className="import-form" style={{ display: 'inline-block' }}>
          <label htmlFor="csv-upload-btn" className={`import-csv-btn ${importing ? 'importing' : ''}`} style={{ cursor: importing ? 'not-allowed' : 'pointer' }}>
            {importing ? 'Importing...' : 'Import CSV'}
            <input
              id="csv-upload-btn"
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              disabled={importing}
              onChange={e => {
                if (importing) return; // 防止在导入过程中重复触发
                
                const file = e.target.files[0];
                if (file) {
                  // 验证文件类型
                  if (!file.name.toLowerCase().endsWith('.csv')) {
                    setImportError('Please select a valid CSV file');
                    return;
                  }
                  
                  // 验证文件大小 (限制为10MB)
                  if (file.size > 10 * 1024 * 1024) {
                    setImportError('File size must be less than 10MB');
                    return;
                  }
                  
                  setCsvFile(file);
                  setImportError(null);
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