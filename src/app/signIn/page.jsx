"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { Toast } from "primereact/toast";
import { Button, TextField, Box } from "@mui/material";

export default function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const cookies = useCookies();
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName && !password) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Username and password are required.",
        life: 2000,
      });
      return;
    }

    if (!userName) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Username is required.",
        life: 2000,
      });
      return;
    }

    if (!password) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Password is required.",
        life: 2000,
      });
      return;
    }

    try {
      const res = await fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          password: password,
          expiresInMins: 30,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        toast.current.show({
          
          variant:"filled",
          severity: "error",
          summary: "Login Failed",
          detail: data.message || "Invalid credentials",
          life: 2000,
        });
        return;
      }

      if (data.accessToken) {
        cookies.set("token", data.accessToken);
      }

      toast.current.show({
        variant:"filled",
        severity: "success",
        summary: "Success",
        detail: "Login successful!",
        life: 2000,
      });

      router.push("/home");
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Try again.");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Try again.",
        life: 2000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        <div className={Styles.container}>
          <h1 className={Styles.signIn}>Sign In</h1>

          <div className={Styles.card}>
            <TextField
              label="Username"
              className={Styles.cardInputType}
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </div>

          <div className={Styles.card1}>
            <TextField
              label="Password"
              className={Styles.cardInputType}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              text = {50}
            />
          </div>

          <div className={Styles.card4}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              className={Styles.cardButton}
            >
              SIGN IN
            </Button>
          </div>

          <div className={Styles.link}>
            <Link href="/signUp">Don't have an account? Sign Up</Link>
          </div>
        </div>
      </form>
    </>
  );
}
