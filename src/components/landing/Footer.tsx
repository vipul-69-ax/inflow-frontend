// components/FooterComponent.tsx
import React from "react";
import logo from "/images/logo/Original LOGO.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const FooterComponent: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 px-4 sm:px-8 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Navigation Links - Line 1 */}
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "About us",
              "Services",
              "Privacy Policy",
              "Terms and conditions",
              "Contact Us",
            ].map((link, index) => (
              <a
                key={index}
                href="#"
                className="text-sm sm:text-base transition-all duration-300 hover:text-[#ff6600] hover:underline"
                style={{
                  color: "#000000",
                  fontFamily: "Avenir LT Std, sans-serif",
                  fontWeight: 500,
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Logo + Social Icons - Line 2 */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <img
              src={logo}
              alt="Inflow Logo"
              className="h-16 sm:h-20 object-contain"
            />
          </div>

          {/* Social Media Icons */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <span
              className="text-sm sm:text-base"
              style={{
                color: "#000000",
                fontFamily: "Avenir LT Std, sans-serif",
                fontWeight: 500,
              }}
            >
              Follow us on:
            </span>
            <div className="flex gap-3">
              {[
                { name: "Facebook", icon: <FaFacebookF /> },
                { name: "Instagram", icon: <FaInstagram /> },
                { name: "LinkedIn", icon: <FaLinkedinIn /> },
                { name: "YouTube", icon: <FaYoutube /> },
                { name: "X", icon: <FaXTwitter /> },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition-transform duration-300"
                >
                  <span className="text-[16px] sm:text-[18px]">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright - Line 3 */}
        <div className="w-full text-center mt-4">
          <p
            className="text-xs sm:text-sm text-gray-500"
            style={{ fontFamily: "Avenir LT Std, sans-serif" }}
          >
            © 2025 inflow.chat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
