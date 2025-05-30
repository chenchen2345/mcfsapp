import React from 'react';

const FraudReporting = () => {
  return (
    <div className="fraud-reporting">
      <h1>Fraud Reporting</h1>
      <p>Please fill out the form below to report any fraudulent activity.</p>
      <form>
        <div>
          <label htmlFor="reporterName">Your Name:</label>
          <input type="text" id="reporterName" name="reporterName" required />
        </div>
        <div>
          <label htmlFor="reportDetails">Details of the Fraud:</label>
          <textarea id="reportDetails" name="reportDetails" required></textarea>
        </div>
        <div>
          <label htmlFor="reportDate">Date of Incident:</label>
          <input type="date" id="reportDate" name="reportDate" required />
        </div>
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default FraudReporting;