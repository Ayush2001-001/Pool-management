"use client";
import Link from "next/link";



export default function Page() {

  return (
    <div className="container">
      <div className="appBar">
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
        <div className="link1">
          <Link href="/signIn" className="href">SIGN IN</Link>
        </div>
      </div>
     
      
      <div className="sideBar"></div>
    </div>
  );
}
