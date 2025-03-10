import { formatDate } from "@/components/utils/globalUse";
import React from "react";

function LeavePage() {
  const today = new Date();
  return (
    <div className="width-container">
      <section className="leave-page">
        <div className="apply-leave">
          <h2>Apply For Leave</h2>
          <p>today: {formatDate(today.toISOString())}</p>
        </div>
        <div className="leave-record">
          <h2>Leaves Record</h2>
        </div>
      </section>
    </div>
  );
}

export default LeavePage;
