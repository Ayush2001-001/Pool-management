"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { Toast } from "primereact/toast";
import { Button,TextField,FormControl,  InputLabel, Select,MenuItem,} from "@mui/material";
import Classes from "./page.module.css";


export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");

  const cookies = useCookies();
  const router = useRouter();
  const toast = useRef(null);

  const handleSignUp = (e) => {
    e.preventDefault();

    if (!userName || !password) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing Fields",
        detail: "Please enter both username and password.",
        life: 3000,
      });
      return;
    }

    cookies.set("user", JSON.stringify({ userName, password, role }));

    toast.current?.show({
      severity: "success",
      summary: "Account Created",
      detail: "Sign-up successful! Redirecting...",
      life: 1000,
    });

    setTimeout(() => {
      router.push("/signIn");
    }, 500);
  };

  return (
    <>
      <Toast ref={toast} />

      <form onSubmit={handleSignUp}>
        <div className={Classes.container}>
          <h1 className={Classes.header}>Sign Up</h1>

          <div className={Classes.card}>
            <TextField
              label="Username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              variant="outlined"
              fullWidth
              className={Classes.cardInputType}
              required
            />
          </div>

          <div className={Classes.cardBody}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              className={Classes.cardInputType}
              required
            />
          </div>

          <div className={Classes.drop}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="user-role-label">User Role</InputLabel>
              <Select
                labelId="user-role-label"
                id="user-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="User Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="guest">Guest</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className={Classes.button}>
            <Button
              variant="contained"
              size="large"
              type="submit"
              fullWidth
              className={Classes.cardButton}
            >
              SIGN UP
            </Button>
          </div>

          <div className={Classes.link}>
            <Link href="/signIn">Already have an account? Sign In</Link>
          </div>
        </div>
      </form>
    </>
  );
}
