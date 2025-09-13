"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { Button, Box, Drawer, Avatar, Typography, Paper, AppBar, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { getAllData } from "../features/slice";
import Styles from "./page.module.css";

// function ButtonComponent({label="Button", color="red",className,onClick,disabled=false,height="30px",width="100px"}){
//   return(
//     <button className={className} onClick={onClick} disabled={disabled}  style={{color:color,height:height,width:width}}>{label}</button>
//   )
// }

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  // Hamburger menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    const token = cookies.get("token");

    if (token) {
      setIsSignIn(true);
      fetch("https://dummyjson.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User Profile Data:", data);
          setUserData(data);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [cookies]);

  useEffect(() => {
    dispatch(getAllData());
  }, []);

  // const sortTableData = (data) => {
  //   return data.filter((post)=>post.description.length>200)
  // }

  // const memosizedTableData =  useMemo((data)=>sortTableData(data));

  const handleLogout = () => {
    cookies.remove("token");
    setIsSignIn(false);
    router.push("/signIn");
  };
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.app);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "title",
      headerName: "Title",
      width: 300,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            display: "block",
            lineHeight: "1.3",
            maxHeight: "2.6em",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "body",
      headerName: "Body",
      width: 400,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            display: "block",
            lineHeight: "1.8",
            maxHeight: "2.6em",
            textOverflow: "ellipsis",
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  const rows =
    users?.map((item) => ({
      id: item.id,
      title: item.title,
      body: item.body,
    })) || [];

  return (
    <div className={Styles.container}>
      <AppBar position="fixed" sx={{ background: 'cadetblue' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          </Box>
          {isSignIn && (
            <IconButton color="inherit" onClick={() => setShowDropdown(true)}>
              <Avatar src="/profile.svg" alt="profile" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem component={Link} href="/about" onClick={handleMenuClose}>About</MenuItem>
        <MenuItem component={Link} href="/service" onClick={handleMenuClose}>Service</MenuItem>
        <MenuItem component={Link} href="/blog" onClick={handleMenuClose}>Blog</MenuItem>
        <MenuItem component={Link} href="/contact" onClick={handleMenuClose}>Contact</MenuItem>
        {!isSignIn && (
          <MenuItem component={Link} href="/signIn" onClick={handleMenuClose}>SIGN IN</MenuItem>
        )}
      </Menu>
      <Drawer
        anchor="left"
        open={showDropdown}
        onClose={() => setShowDropdown(false)}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          {userData ? (
            <>
              <Box display="flex" flexDirection="column" alignItems="center" marginBottom={5}>
                <Avatar src={userData.image} />
                <Typography variant="h6"> Name:{userData.firstName} {userData.lastName}</Typography>
                <Typography variant="h7">{userData.email}</Typography>
                <Typography variant="h7">Gender: {userData.gender}</Typography>
              </Box>
              <Button onClick={handleLogout} variant="contained" fullWidth>
                Logout
              </Button>
            </>
          ) : (
            <Typography>Loading profile...</Typography>
          )}
        </Box>
      </Drawer>

      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h3 style={{ color: "red" }}>{error}</h3>
      ) : rows.length > 0 ? (
        <Paper sx={{ height: 700, width: "81%", marginTop: 9, marginLeft:30 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            // checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
      ) : (
        <h3>No data found.</h3>
      )}
    </div>
  );
}
