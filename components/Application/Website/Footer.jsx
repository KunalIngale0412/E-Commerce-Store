import React from "react";
import logo from "@/public/assets/images/logo-black.png";
import Image from "next/image";
import Link from "next/link";
import {
  USER_DASHBOARD,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
  WEBSITE_SHOP,
} from "@/routes/WebsiteRoute";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineYoutube } from "react-icons/ai";
import { IoLogoInstagram } from "react-icons/io";
import { MdOutlineWhatsapp } from "react-icons/md";
import { CiFacebook } from "react-icons/ci";
import { SlSocialTwitter } from "react-icons/sl";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4">
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Image
            src={logo}
            width={390}
            height={160}
            alt="Logo"
            className="w-36 mb-2"
          />
          <p className="text-gray-500 text-sm">
            E-store is your trusted destination for quality and convenience.
            From fashion to essentials, we bring everything you need right to
            your doorstep. Shop smart, live better — only at E-store.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-4">Categories</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={`${WEBSITE_SHOP}?category=t-shirts`}>T-shirt</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={`${WEBSITE_SHOP}?category=hoodies`}>Hoodies</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={`${WEBSITE_SHOP}?category=oversized`}>Oversized</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={`${WEBSITE_SHOP}?category=full-sleeves`}>Full Sleeves</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={`${WEBSITE_SHOP}?category=polo`}>Polo</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-4">Userfull Links</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_HOME}>Home</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_SHOP}>Shop</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="/about-us">About</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-4">Help Center</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_REGISTER}>Register</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href={USER_DASHBOARD}>My Account</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li className="mb-2 text-gray-500">
              <Link href="terms-and-conditions">Terms and Conditions</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-4">Contact Us</h4>
          <ul>
            <li className="mb-2 text-gray-500 flex gap-2 items-center">
              <IoLocationOutline size={20} />
              <span className="text-sm">
                E-store market Thane, India 400602
              </span>
            </li>
            <li className="mb-2 text-gray-500 flex gap-2 items-center">
              <MdOutlinePhone size={20} />
              <Link href="tel:+91-94837 2615" className="hover:text-primary text-sm">
                +91-94837 2615
              </Link>
            </li>
            <li className="mb-2 text-gray-500 flex gap-2 items-center">
              <MdOutlineEmail size={20} />
              <Link
                href="mailto:nikhil.verma27@gmail.com"
                className="hover:text-primary text-sm "
              >
                nikhil.verma27@gmail.com
              </Link>
            </li>
          </ul>

          <div className="flex gap-5 mt-5">
              <Link href=""><AiOutlineYoutube className="text-primary" size={28} /></Link>
              <Link href=""><IoLogoInstagram className="text-primary" size={28} /></Link>
              <Link href=""><MdOutlineWhatsapp className="text-primary" size={28} /></Link>
              <Link href=""><CiFacebook className="text-primary" size={28} /></Link>
              <Link href=""><SlSocialTwitter className="text-primary" size={28} /></Link>
          </div>
        </div>
      </div>

      <div className="py-5 bg-gray-100">
        <p className="text-center">© 2026 Estore. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
