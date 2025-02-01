"use client";
import React from "react";
import "@/styles/layouts/header.scss";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import MyApi from "@/api/MyApi";
import { NavigationLink } from "../buttons/CustomButtons";

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
              <li className={`link ${pathname === "/" ? "active" : ""}`}>
                <NavigationLink link="/" label="Home" />
              </li>
              <li className={`link ${pathname === "/profile" ? "active" : ""}`}>
                <NavigationLink link="/profile" label="Profile" />
              </li>
              <li>
                <p className="primary-link" onClick={logoutHandler}>
                  Logout
                </p>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
