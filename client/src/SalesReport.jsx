import "./SalesReport.css";

export default function SalesReport() {
  const todayDate = new Date().toLocaleDateString();

  return (
    <div className="sales-report-container">
      <h2>Sales Report</h2>
      <div className="report-content">
        <div className="report-card">
          <h3>Total Sales</h3>
          <p className="metric">₹0.00</p>
          <small>Today</small>
        </div>
        <div className="report-card">
          <h3>Total Invoices</h3>
          <p className="metric">0</p>
          <small>Today</small>
        </div>
        <div className="report-card">
          <h3>Average Sale</h3>
          <p className="metric">₹0.00</p>
          <small>Per Invoice</small>
        </div>
        <div className="report-card">
          <h3>Products Sold</h3>
          <p className="metric">0</p>
          <small>Total Items</small>
        </div>
      </div>

      <div className="report-details">
        <h3>Date: {todayDate}</h3>
        <p className="note">
          Sales report data will be updated as you create invoices. Complete
          invoicing functionality is coming soon!
        </p>
      </div>
    </div>
  );
}
