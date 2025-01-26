"use client";

import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Image from "next/image";
import React, { useEffect } from "react";

import LoadingImg from "../../public/assets/loader.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initializeAuthState } from "@/redux/features/auth/authSlice";
import { setAppMainLoader } from "@/redux/features/globalSlicer";
import { waitSec } from "@/components/utils/CommonWait";

const AllDataWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { appMainLoader } = useSelector((state: RootState) => state.global);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthState());
  }, [dispatch]);

  useEffect(() => {
    const setLoader = async () => {
      if (isLoggedIn) {
        dispatch(setAppMainLoader(false));
      }
      await waitSec(200);
      dispatch(setAppMainLoader(false));
    };
    setLoader();
  }, [dispatch, isLoggedIn]);

  if (appMainLoader) {
    return (
      <div className="app-loader">
        <Image
          src={LoadingImg}
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
        <Header />
        <main className="app-container">{children}</main>
        <Footer />
      </>
    );
  }
};

export default AllDataWrapper;
