"use client";
import React from "react";
import "@/styles/layouts/header.scss";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import MyApi from "@/api/MyApi";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const logoutHandler: () => Promise<void> = async () => {
    try {
      const response = await MyApi.post("users/logout", {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { success } = response.data;
      if (success) {
        dispatch(logout());
        router.push("/login");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.msg ||
        err.response?.data?.error ||
        "Register Error";
      console.log("Error Response:", errorMessage);
    }
  };

  return (
    <header className="width-container">
      <nav>
        <ul>
          {isLoggedIn && (
            <>
              <li>Dashboard</li>
              <li>Apply Leave</li>
              <li>Profile</li>
              <li>Chat</li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
