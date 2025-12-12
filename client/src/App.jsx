import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Billing from "./Billing";
import Products from "./Products";
import SalesReport from "./SalesReport";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const renderPage = () => {
    if (currentPage === "login") return <Login onLoginSuccess={handleLoginSuccess} />;
    if (currentPage === "billing") return <Billing />;
    if (currentPage === "products") return isLoggedIn ? <Products /> : <Login onLoginSuccess={handleLoginSuccess} />;
    if (currentPage === "sales") return <SalesReport />;

    return (
      <div className="menu">
        <button className="card" onClick={() => setCurrentPage("billing")}>
          Billing
        </button>
        <button className="card" onClick={() => setCurrentPage("products")}>
          Products
        </button>
        <button className="card" onClick={() => setCurrentPage("sales")}>
          Sales Report
        </button>
        <button className="card" onClick={() => setCurrentPage("login")}>
          {isLoggedIn ? "Admin Panel" : "Login"}
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <header className="header">
        <h1>POS Billing & Sales Manager</h1>
        {currentPage !== "home" && (
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => setCurrentPage("home")}>
              ← Back to Home
            </button>
            {isLoggedIn && (
              <button className="nav-btn logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        )}
      </header>

      <div className="content">
        {renderPage()}
      </div>

      <footer className="footer">
        <p>© 2025 POS Billing System</p>
      </footer>
    </div>
  );
}

export default App;
