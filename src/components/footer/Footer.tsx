import { APP_NAME } from "@/constants/appConfig";
import React from "react";

function Footer() {
  return (
    <footer className="width-container">
      <div>
        <p>Copyright by {APP_NAME} 2025. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
