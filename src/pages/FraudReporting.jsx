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
      alert('操作失败: ' + (err.message || '未知错误'));
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('确定要删除该交易吗？')) return;
    try {
      await deleteTransaction(id);
      loadTransactions();
    } catch (err) {
      alert('删除失败: ' + (err.message || '未知错误'));
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
      alert('导入成功');
    } catch (err) {
      alert('导入失败: ' + (err.message || '未知错误'));
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
      setFraudReport({ error: err.message || '获取报告失败' });
    } finally {
      setReportLoading(false);
    }
  };

  const handleGenerateReport = async id => {
    setReportLoading(true);
    setFraudReport(null);
    try {
      const report = await generateFraudReport(id);
      setFraudReport(report);
      alert('报告生成成功');
    } catch (err) {
      setFraudReport({ error: err.message || '生成报告失败' });
    } finally {
      setReportLoading(false);
    }
  };

  const handleShowFraudReport = async id => {
    setReportLoading(true);
    setFraudReport(null);
    try {
      const report = await getFraudReport(id);
      setFraudReport(report);
    } catch (err) {
      setFraudReport({ error: err.message || '获取报告失败' });
    } finally {
      setReportLoading(false);
    }
  };

  const handleDeleteFraudReport = async id => {
    if (!window.confirm('确定要删除该欺诈报告吗？')) return;
    try {
      await deleteFraudReport(id);
      loadFraudReports();
      alert('删除成功');
    } catch (err) {
      alert('删除失败: ' + (err.message || '未知错误'));
    }
  };

  // 搜索功能（本地过滤）
  const filteredTransactions = transactions.filter(tx => {
    if (!search) return true;
    return (
      tx.nameOrig?.toLowerCase().includes(search.toLowerCase()) ||
      tx.nameDest?.toLowerCase().includes(search.toLowerCase()) ||
      String(tx.id).includes(search)
    );
  });

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
        <input className="search-input" placeholder="Search by account/name/ID" value={search} onChange={e => setSearch(e.target.value)} />
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
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className={tx.isFraud ? 'fraud-row' : ''}>
                    <td>{tx.id}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.nameOrig}</td>
                    <td>{tx.nameDest}</td>
                    <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}</td>
                    <td>
                      <button onClick={() => handleOpenDialog('edit', tx)}>Edit</button>
                      <button onClick={() => handleDelete(tx.id)}>Delete</button>
                      <button onClick={() => handleShowReport(tx.id)}>View Report</button>
                      <button onClick={() => handleGenerateReport(tx.id)}>Generate Report</button>
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
          {fraudReportsLoading ? <div className="loading">Loading...</div> : fraudReportsError ? <div className="error">{fraudReportsError}</div> : (
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
                      <button onClick={() => handleDeleteFraudReport(report.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        {!showFraudReports ? (
          <>
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
          </>
        ) : (
          <div>
            <span>Fraud Reports Management</span>
          </div>
        )}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudReporting;