"use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  // const router = useRouter();
  // useEffect(() => {
  //   router.replace("/");
  // }, [router]);
  
  return (
    <div className="container">
      <div className="search">
        <input
        className="search-type"
         type="text"
         placeholder="search"
         size={25}
        />
       </div>
      <div className=" about">
        <Link href="About" className="href"> About</Link>
      </div>
      <div className="service">
        <Link href="service" className="href">Service</Link>
      </div>
      <div className="blog">
        <Link href="blog" className="href">Blog</Link>
      </div>
      <div className="contact">
        <Link href="contact" className="href"> Contact</Link>
      </div>
      
      <div className="link1">
        <Link href="signIn" className="href">SIGN IN</Link>
      </div>
      
    </div>
  );
}


