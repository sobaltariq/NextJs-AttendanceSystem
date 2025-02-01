"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Image from "next/image";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initializeAuthState } from "@/redux/features/auth/authSlice";
import { setAppMainLoader } from "@/redux/features/globalSlicer";
import { usePathname } from "next/navigation";

const AllDataWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { appMainLoader } = useSelector((state: RootState) => state.global);

  const dispatch = useDispatch();

  const pathname = usePathname();

  // to set initial logged in state data into redux
  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  useEffect(() => {
    const setLoader = async () => {
      if (appMainLoader) {
        dispatch(setAppMainLoader(false));
      }
    };
    setLoader();
  }, [dispatch, appMainLoader]);

  if (appMainLoader) {
    return (
      <div className="app-loader">
        <Image
          src="/assets/loader.svg"
          alt="Loading"
          height={100}
          width={100}
          priority
        />
      </div>
    );
  } else {
    return (
      <>
        {pathname !== "/login" && pathname !== "/register" && <Header />}
        <main className="app-container">{children}</main>
      </>
    );
  }
};

export default AllDataWrapper;
