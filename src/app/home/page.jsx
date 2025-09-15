"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { Button,Box, Drawer,Avatar,  Typography,Paper,AppBar,Toolbar,IconButton,Menu,MenuItem,TextField,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { getAllData, deleteUser, editUser } from "../features/slice";
import Styles from "./page.module.css";

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.app);

  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      setIsSignIn(true);
      fetch("https://dummyjson.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [cookies]);

  
  useEffect(() => {
    dispatch(getAllData());
  }, [dispatch]);

  const handleLogout = () => {
    cookies.remove("token");
    setIsSignIn(false);
    router.push("/signIn");
  };

 
  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const handleEdit = (id) => {
    const item = users.find((u) => u.id === id);
    setEditingId(id);
    setNewTitle(item?.title || "");
    setNewBody(item?.body || "");
  };

  const handleSave = () => {
    if (newTitle.trim() === "" || newBody.trim() === "") {
      alert("Title and Body can't be empty");
      return;
    }
    dispatch(editUser({ id: editingId, newTitle, newBody }));
    setEditingId(null);
    setNewTitle("");
    setNewBody("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewTitle("");
    setNewBody("");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "title",
      headerName: "Title",
      width: 300,
      renderCell: (params) =>
        editingId === params.row.id ? (
          <TextField
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            size="small"
            fullWidth/> ):(  <div>{params.value}</div> ),
           },

    {
      field: "body",
      headerName: "Body",
      width: 400,
      renderCell: (params) =>
        editingId === params.row.id ? (
          <TextField
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            size="small"
            fullWidth
            multiline/>) : ( <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "2.8",
              maxHeight: "2.6em",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          > {params.value}</div>),
          },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) =>
        editingId === params.row.id ? (
          <>
            <Button onClick={handleSave} size="small" variant="contained" color="primary">
              Save
            </Button>
            <Button
              onClick={handleCancelEdit}
              size="small"
              variant="outlined"
              color="secondary"
              style={{ marginLeft: 8 }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </>
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
     
      <AppBar position="fixed" sx={{ background: "cadetblue" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {isSignIn && (
            <IconButton color="inherit" onClick={() => setShowDropdown(true)}>
              <Avatar src="/profile.svg" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={() => setAnchorEl(null)}>
        <MenuItem component={Link} href="/about">
          About
        </MenuItem>
        <MenuItem component={Link} href="/service">
          Service
        </MenuItem>
        <MenuItem component={Link} href="/blog">
          Blog
        </MenuItem>
        <MenuItem component={Link} href="/contact">
          Contact
        </MenuItem>
        {!isSignIn && <MenuItem component={Link} href="/signIn">Sign In</MenuItem>}
      </Menu>

      <Drawer anchor="left" open={showDropdown} onClose={() => setShowDropdown(false)}>
        <Box sx={{ width: 250, padding: 2 }}>
          {userData ? (
            <>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar src={userData.image} />
                <Typography variant="h6">
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography variant="body2">{userData.email}</Typography>
                <Typography variant="body2">Gender: {userData.gender}</Typography>
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

      <Box sx={{ marginTop: 9, marginLeft: 30 }}>
        {loading ? (
          <Typography variant="h5">Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Paper sx={{ height: 700, width: "81%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              disableRowSelectionOnClick
              sx={{ border: 0 }}
            />
          </Paper>
        )}
      </Box>
    </div>
  );
}
