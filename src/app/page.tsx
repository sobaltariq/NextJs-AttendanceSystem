"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useMessageModal } from "../components/modal/providers/MessageModalProvider";

export default function Home() {
  const { showMessageModal } = useMessageModal();
  return (
    <div className="width-container">
      <section className="dashboard-page">
        <button
          onClick={() =>
            showMessageModal(
              "success",
              "Operation completed successfully!",
              5000
            )
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Show Success Message
        </button>
        <button
          onClick={() =>
            showMessageModal("error", "Operation completed successfully!", 5000)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Show Error Message
        </button>
        <button
          onClick={() =>
            showMessageModal(
              "warning",
              "Operation completed successfully!",
              5000
            )
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Show Warning Message
        </button>
      </section>
    </div>
  );
}
