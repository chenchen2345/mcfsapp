import React, { useState, useEffect } from 'react';
import './FraudReporting.css';
import {
  fetchTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactions,
  fetchFraudReports,
  getFraudReport,
  getFraudReportByTransaction,
  createFraudReport,
  updateFraudReport,
  deleteFraudReport,
  generateFraudReport
} from '../services/api';

const FraudReporting = () => {
  // 交易相关状态
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 删除本地搜索相关状态
  // const [search, setSearch] = useState('');
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
  const [fraudReport, setFraudReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // 欺诈报告相关状态
  const [fraudReports, setFraudReports] = useState([]);
  const [fraudReportsLoading, setFraudReportsLoading] = useState(false);
  const [fraudReportsError, setFraudReportsError] = useState(null);
  const [showFraudReports, setShowFraudReports] = useState(false);
  const [fraudReportPage, setFraudReportPage] = useState(1);
  const [fraudReportSize, setFraudReportSize] = useState(10);
  const [fraudReportTotal, setFraudReportTotal] = useState(0);

  // Fraud Reports Tab 下方，添加新建按钮和弹窗相关状态
  const [showCreateFraudDialog, setShowCreateFraudDialog] = useState(false);
  const [newFraudTransactionId, setNewFraudTransactionId] = useState('');
  const [creatingFraud, setCreatingFraud] = useState(false);
  const [updateFraudId, setUpdateFraudId] = useState(null);
  const [updatingFraud, setUpdatingFraud] = useState(false);
  // Search for fraud report by ID or transaction ID
  const [searchType, setSearchType] = useState('report'); // 'report' or 'transaction'
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // 新增每条 transaction 的生成报告 loading 状态
  const [generatingReportId, setGeneratingReportId] = useState(null);

  useEffect(() => { 
    if (showFraudReports) {
      loadFraudReports();
    } else {
      loadTransactions(); 
    }
  }, [page, size, fraudReportPage, fraudReportSize, showFraudReports]);

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
      setError(err.message || '加载交易失败');
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const loadFraudReports = async () => {
    try {
      setFraudReportsLoading(true);
      setFraudReportsError(null);
      const params = { page: fraudReportPage, size: fraudReportSize };
      const data = await fetchFraudReports(params);
      if (data && data.reports) {
        setFraudReports(data.reports);
        setFraudReportTotal(data.total || 0);
      } else if (Array.isArray(data)) {
        setFraudReports(data);
        setFraudReportTotal(data.length);
      } else {
        setFraudReports([]);
        setFraudReportTotal(0);
      }
    } catch (err) {
      setFraudReportsError(err.message || '加载欺诈报告失败');
      setFraudReports([]);
      setFraudReportTotal(0);
    } finally {
      setFraudReportsLoading(false);
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
      alert('Import succeeded');
    } catch (err) {
      alert('Import failed: ' + (err.message || 'Unknown error'));
    } finally {
      setImporting(false);
    }
  };

  const handleShowReport = async id => {
    setReportLoading(true);
    setFraudReport(null);
    try {
      const report = await getFraudReportByTransaction(id);
      setFraudReport(report);
    } catch (err) {
      // If not generated, prompt user to generate first
      setFraudReport({ error: 'No report found. Please click "Generate Report" first.' });
    } finally {
      setReportLoading(false);
    }
  };

  // 移除 generateFraudReport 相关逻辑
  // 删除 handleGenerateReport 方法
  // 删除 transaction 列表中“Generate Report”按钮

  const handleShowFraudReport = async id => {
    setReportLoading(true);
    setFraudReport(null);
    try {
      const report = await getFraudReport(id);
      setFraudReport(report);
    } catch (err) {
      setFraudReport({ error: err.message || 'Failed to get report' });
    } finally {
      setReportLoading(false);
    }
  };

  const handleDeleteFraudReport = async id => {
    if (!window.confirm('Are you sure you want to delete this fraud report?')) return;
    try {
      await deleteFraudReport(id);
      loadFraudReports();
      alert('Delete succeeded');
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Unknown error'));
    }
  };

  // 搜索功能（本地过滤）
  // 删除本地过滤逻辑
  // const filteredTransactions = transactions.filter(tx => {
  //   if (!search) return true;
  //   return (
  //     tx.nameOrig?.toLowerCase().includes(search.toLowerCase()) ||
  //     tx.nameDest?.toLowerCase().includes(search.toLowerCase()) ||
  //     String(tx.id).includes(search)
  //   );
  // });

  // 更新 Fraud Report 逻辑
  const handleUpdateFraudReport = async id => {
    setUpdatingFraud(true);
    try {
      await updateFraudReport(id);
      loadFraudReports();
      alert('Fraud report updated successfully');
    } catch (err) {
      alert('Update failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingFraud(false);
    }
  };

  // 生成报告功能
  const handleGenerateReport = async (transactionId) => {
    setGeneratingReportId(transactionId);
    try {
      await createFraudReport({ transaction_id: transactionId });
      alert('Fraud report generated successfully');
      // 可选：自动切换到 Fraud Reports Tab 并刷新
      setShowFraudReports(true);
      loadFraudReports();
    } catch (err) {
      alert('Generate failed: ' + (err.message || 'Unknown error'));
    } finally {
      setGeneratingReportId(null);
    }
  };

  // Fraud report search handler
  const handleFraudReportSearch = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    setSearchError('');
    setSearchLoading(true);
    try {
      let result;
      if (searchType === 'report') {
        result = await getFraudReport(searchId);
      } else {
        result = await getFraudReportByTransaction(searchId);
      }
      setSearchResult(result);
    } catch (err) {
      setSearchError(err?.message || 'Not found or error occurred');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="fraud-reporting-container">
      <div className="fraud-header">
        <h2>Fraud Report Management</h2>
        <div className="fraud-tabs">
          <button 
            className={!showFraudReports ? 'active' : ''} 
            onClick={() => setShowFraudReports(false)}
          >
            Transactions
          </button>
          <button 
            className={showFraudReports ? 'active' : ''} 
            onClick={() => setShowFraudReports(true)}
          >
            Fraud Reports
          </button>
        </div>
        {/* 删除顶部的search-input搜索框 */}
      </div>
      
      {!showFraudReports ? (
        // 交易列表
        <div className="fraud-table-wrapper">
          {loading ? <div className="loading">Loading...</div> : error ? <div className="error">{error}</div> : (
            <table className="fraud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* 直接遍历transactions，不再本地过滤 */}
                {transactions.map(tx => (
                  <tr key={tx.id} className={tx.isFraud ? 'fraud-row' : ''}>
                    <td>{tx.id}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.nameOrig}</td>
                    <td>{tx.nameDest}</td>
                    <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleShowReport(tx.id)}>View Report</button>
                      <button onClick={() => handleGenerateReport(tx.id)} disabled={generatingReportId === tx.id}>
                        {generatingReportId === tx.id ? 'Generating...' : 'Generate Report'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        // 欺诈报告列表
        <div className="fraud-table-wrapper">
          {/* 搜索区域样式调整：居中、宽度加大、统一高度 */}
          <form 
            style={{ 
              display: 'flex', 
              gap: 16, 
              alignItems: 'center', 
              marginBottom: 24, 
              justifyContent: 'center', 
              width: '100%',
            }} 
            onSubmit={handleFraudReportSearch}
          >
            <select 
              value={searchType} 
              onChange={e => setSearchType(e.target.value)} 
              style={{ 
                padding: '10px 18px', 
                borderRadius: 6, 
                border: '1px solid #ccc', 
                fontSize: '1.08rem', 
                width: 180, 
                height: 44, 
                boxSizing: 'border-box',
              }}
            >
              <option value="report">By Report ID</option>
              <option value="transaction">By Transaction ID</option>
            </select>
            <input
              type="number"
              min="1"
              placeholder={searchType === 'report' ? 'Enter Report ID' : 'Enter Transaction ID'}
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              style={{ 
                padding: '10px 18px', 
                borderRadius: 6, 
                border: '1px solid #ccc', 
                fontSize: '1.08rem', 
                width: 260, 
                height: 44, 
                boxSizing: 'border-box',
              }}
              required
            />
            <button 
              type="submit" 
              style={{ 
                padding: '10px 22px', // 与输入框一致
                borderRadius: 6, 
                border: 'none', 
                background: '#3f51b5', 
                color: '#fff', 
                fontSize: '1.08rem', 
                cursor: 'pointer', 
                height: 44, 
                minWidth: 80, 
                maxWidth: 120, 
                width: 100, 
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
              }} 
              disabled={searchLoading || !searchId}
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            {/* 新增Clear按钮，仅在有输入或结果时显示 */}
            {(!!searchId || !!searchResult || !!searchError) && (
              <button
                type="button"
                onClick={() => {
                  setSearchId('');
                  setSearchResult(null);
                  setSearchError('');
                }}
                style={{
                  padding: '10px 22px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#bdbdbd',
                  color: '#fff',
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                  height: 44,
                  minWidth: 80,
                  maxWidth: 120,
                  width: 100,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  verticalAlign: 'middle',
                  marginLeft: 4,
                }}
              >
                Clear
              </button>
            )}
          </form>
          {searchError && <div className="error" style={{ marginBottom: 12 }}>{searchError}</div>}
          {searchResult && (
            <div className="fraud-report-info" style={{ marginBottom: 16 }}>
              <p><strong>Report ID:</strong> {searchResult.id}</p>
              <p><strong>Transaction ID:</strong> {searchResult.transaction_id}</p>
              <p><strong>Generated At:</strong> {searchResult.generated_at ? new Date(searchResult.generated_at).toLocaleString() : 'N/A'}</p>
              <p><strong>Updated At:</strong> {searchResult.updated_at ? new Date(searchResult.updated_at).toLocaleString() : 'N/A'}</p>
              <div className="fraud-report-content"><h4>Report Content:</h4><pre>{searchResult.report}</pre></div>
            </div>
          )}
          {fraudReportsLoading ? <div className="loading">Loading...</div> : fraudReportsError ? <div className="error">{fraudReportsError}</div> : (
            <>
              <table className="fraud-table">
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Transaction ID</th>
                    <th>Report Content</th>
                    <th>Generated At</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fraudReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.transaction_id}</td>
                      <td>
                        <div className="report-content-preview">
                          {report.report && report.report.length > 100 
                            ? report.report.substring(0, 100) + '...' 
                            : report.report}
                        </div>
                      </td>
                      <td>{report.generated_at ? new Date(report.generated_at).toLocaleString() : ''}</td>
                      <td>{report.updated_at ? new Date(report.updated_at).toLocaleString() : ''}</td>
                      <td>
                        <button onClick={() => handleShowFraudReport(report.id)}>View</button>
                        <button onClick={() => handleUpdateFraudReport(report.id)}>Update</button>
                        <button onClick={() => handleDeleteFraudReport(report.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      {/* Pagination */}
      <div className="fraud-pagination">
        {!showFraudReports ? (
          <>
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page}</span>
            <button disabled={page * size >= total} onClick={() => setPage(page + 1)}>Next</button>
          </>
        ) : (
          <>
            <button disabled={fraudReportPage <= 1} onClick={() => setFraudReportPage(fraudReportPage - 1)}>Previous</button>
            <span>Page {fraudReportPage}</span>
            <button disabled={fraudReportPage * fraudReportSize >= fraudReportTotal} onClick={() => setFraudReportPage(fraudReportPage + 1)}>Next</button>
          </>
        )}
      </div>
      {/* Bottom Actions */}
      <div className="fraud-actions-bottom">
        {/* 不显示 New Transaction 和 Import CSV 按钮 */}
        {showFraudReports ? (
          <div>
            <span>Fraud Reports Management</span>
          </div>
        ) : null}
      </div>
      {/* Create/Edit Dialog */}
      {showDialog && (
        <div className="fraud-dialog-backdrop" onClick={() => setShowDialog(false)}>
          <div className="fraud-dialog" onClick={e => e.stopPropagation()}>
            <h3>{dialogMode === 'create' ? 'New Transaction' : 'Edit Transaction'}</h3>
            <form onSubmit={handleDialogSubmit} className="fraud-dialog-form">
              <label>Type:<input name="type" value={formData.type} onChange={handleDialogChange} required /></label>
              <label>Amount:<input name="amount" type="number" value={formData.amount} onChange={handleDialogChange} required /></label>
              <label>Sender:<input name="nameOrig" value={formData.nameOrig} onChange={handleDialogChange} required /></label>
              <label>Sender Old Balance:<input name="oldBalanceOrig" type="number" value={formData.oldBalanceOrig} onChange={handleDialogChange} required /></label>
              <label>Sender New Balance:<input name="newBalanceOrig" type="number" value={formData.newBalanceOrig} onChange={handleDialogChange} required /></label>
              <label>Receiver:<input name="nameDest" value={formData.nameDest} onChange={handleDialogChange} required /></label>
              <label>Receiver Old Balance:<input name="oldBalanceDest" type="number" value={formData.oldBalanceDest} onChange={handleDialogChange} required /></label>
              <label>Receiver New Balance:<input name="newBalanceDest" type="number" value={formData.newBalanceDest} onChange={handleDialogChange} required /></label>
              <div className="fraud-dialog-actions">
                <button type="submit" className="equal-width-btn">Save</button>
                <button type="button" className="equal-width-btn" onClick={() => setShowDialog(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 新建 Fraud Report 弹窗 */}
      {showCreateFraudDialog && (
        <div className="fraud-dialog-backdrop" onClick={() => setShowCreateFraudDialog(false)}>
          <div className="fraud-dialog" onClick={e => e.stopPropagation()}>
            <h3>New Fraud Report</h3>
            <form onSubmit={async e => {
              e.preventDefault();
              setCreatingFraud(true);
              try {
                await createFraudReport({ transaction_id: Number(newFraudTransactionId) });
                setShowCreateFraudDialog(false);
                setNewFraudTransactionId('');
                loadFraudReports();
                alert('Fraud report created successfully');
              } catch (err) {
                alert('Create failed: ' + (err.message || 'Unknown error'));
              } finally {
                setCreatingFraud(false);
              }
            }} className="fraud-dialog-form">
              <label>Transaction ID:
                <input name="transaction_id" type="number" value={newFraudTransactionId} onChange={e => setNewFraudTransactionId(e.target.value)} required />
              </label>
              <div className="fraud-dialog-actions">
                <button type="submit" className="equal-width-btn" disabled={creatingFraud}>{creatingFraud ? 'Creating...' : 'Create'}</button>
                <button type="button" className="equal-width-btn" onClick={() => setShowCreateFraudDialog(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Fraud Report Dialog */}
      {fraudReport && (
        <div className="fraud-dialog-backdrop" onClick={() => setFraudReport(null)}>
          <div className="fraud-dialog" onClick={e => e.stopPropagation()}>
            <h3>Fraud Report</h3>
            {reportLoading ? <div className="loading">Loading...</div> : fraudReport.error ? <div className="error">{fraudReport.error}</div> : (
              <div>
                <div className="fraud-report-info">
                  <p><strong>Report ID:</strong> {fraudReport.id}</p>
                  <p><strong>Transaction ID:</strong> {fraudReport.transaction_id}</p>
                  <p><strong>Generated At:</strong> {fraudReport.generated_at ? new Date(fraudReport.generated_at).toLocaleString() : 'N/A'}</p>
                  <p><strong>Updated At:</strong> {fraudReport.updated_at ? new Date(fraudReport.updated_at).toLocaleString() : 'N/A'}</p>
                </div>
                <div className="fraud-report-content">
                  <h4>Report Content:</h4>
                  <pre>{fraudReport.report}</pre>
                </div>
              </div>
            )}
            <div className="fraud-dialog-actions">
              <button className="equal-width-btn" onClick={() => setFraudReport(null)}>Close</button>
              {!fraudReport.error && (
                <button className="equal-width-btn" onClick={() => handleUpdateFraudReport(fraudReport.id)} disabled={updatingFraud}>{updatingFraud ? 'Updating...' : 'Update'}</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudReporting;