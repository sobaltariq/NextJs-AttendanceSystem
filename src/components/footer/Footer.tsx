import { APP_NAME } from "@/constants/appConfig";
import React from "react";

function Footer() {
  return (
    <footer>
      <div className="width-container">
        <p>Copyright by {APP_NAME} 2025. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
