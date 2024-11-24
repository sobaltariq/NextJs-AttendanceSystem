import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="">
      <main className="">
        <h1 style={{ fontFamily: "var(--font-chillax)" }}>Home</h1>
        <h2>{process.env.REACT_APP_BASE_URL}</h2>
      </main>
    </div>
  );
}
