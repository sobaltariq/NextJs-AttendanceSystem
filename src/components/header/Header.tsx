"use client";
import React from "react";
import "@/styles/layouts/header.scss";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

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
              <li>Logout</li>
            </>
          )}

          {!isLoggedIn && (
            <>
              <li className="logged-out">
                <Link
                  href="/login"
                  className={`link ${pathname === "/login" ? "active" : ""}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`link ${pathname === "/register" ? "active" : ""}`}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
