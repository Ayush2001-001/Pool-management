"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { Button, Box , Drawer, Avatar, Typography} from "@mui/material";
import "./home.css";


export default function Home() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    const token = cookies.get("token");

    if (token) {
      setIsSignIn(true);
      fetch("https://dummyjson.com/auth/me",
         {
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

  const handleLogout = () => {
    cookies.remove("token");
    setIsSignIn(false);
    router.push("/signIn");
  };
  

  return (
    <div className="container">


      <div className="about">
        <Link href="/about" className="href">About</Link>
      </div>
      <div className="service">
        <Link href="/service" className="href">Service</Link>
      </div>
      <div className="blog">
        <Link href="/blog" className="href">Blog</Link>
      </div>
      <div className="contact">
        <Link href="/contact" className="href">Contact</Link>
      </div>

      {!isSignIn && (
        <div className="authLinks">
          <Link href="/signIn">SIGN IN</Link>
        </div>
      )}

      
      {isSignIn && (
  <>
    <div className="profileContainer">
      <span onClick={() => setShowDropdown(true)} style={{ cursor: "pointer" }}>
        <img src="/profile.svg" alt="profile" height={45} />
      </span>
    </div>

    <Drawer anchor="left" open={showDropdown} onClose={() => setShowDropdown(false)}>
      <Box
      sx={{ width: 250, padding: 2 }}>
        {userData ? (
          <>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={5}>
              <Avatar
                src={userData.image}
              />
              <Typography variant="h6"> Name:{userData.firstName} {userData.lastName}</Typography>
              <Typography variant="h7">{userData.email}</Typography>
              <Typography variant="h7">Gender: {userData.gender}</Typography>
            </Box>
            <Button
              onClick={handleLogout}
              variant="contained"
              fullWidth
            >
              Logout
            </Button>
          </>)
         : 
         ( <Typography>Loading profile...</Typography>  )}
       </Box>
    </Drawer>
  </>
)}

 </div>
  );
}
