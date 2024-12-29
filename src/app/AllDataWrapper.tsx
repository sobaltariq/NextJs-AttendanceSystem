import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import React from "react";

const AllDataWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main className="app-container">{children}</main>
      <Footer />
    </>
  );
};

export default AllDataWrapper;
