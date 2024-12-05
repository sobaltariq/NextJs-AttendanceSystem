import React from "react";
import "@/styles/layouts/header.scss";

function Header() {
  return (
    <header className="width-container">
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Apply Leave</li>
          <li>Profile</li>
          <li>Chat</li>
          <li>Logout</li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
