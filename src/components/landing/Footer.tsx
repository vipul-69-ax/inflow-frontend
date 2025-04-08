// components/FooterComponent.tsx
import React from "react";
import logo from "/images/logo/inflow-logo.png"; // Importing the logo from assets

const FooterComponent: React.FC = () => {
  return (
    <footer
      className="w-full py-6 px-3 xs:py-8 xs:px-4 sm:py-10 sm:px-6 md:py-14 md:px-8 lg:py-20 border-t border-gray-200"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Navigation Links and Social Media Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 xs:mb-8 sm:mb-10 md:mb-14">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 xs:gap-6 sm:gap-8 mb-6 xs:mb-8 md:mb-0">
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
                className="text-sm xs:text-base sm:text-lg hover:text-gray-600 transition-colors duration-300"
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

          {/* Social Media Icons */}
          <div className="flex flex-col items-center gap-3 xs:gap-4">
            <span
              className="text-sm xs:text-base sm:text-lg"
              style={{
                color: "#000000",
                fontFamily: "Avenir LT Std, sans-serif",
                fontWeight: 500,
              }}
            >
              Follow us on:
            </span>
            <div className="flex gap-2 xs:gap-3">
              {[
                {
                  name: "Facebook",
                  icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
                },
                {
                  name: "Instagram",
                  icon: "M16 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0016 2zm0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8zm0-14a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z",
                },
                {
                  name: "LinkedIn",
                  icon: "M20 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V4a2 2 0 00-2-2zM8 19H5v-9h3v9zm-1.5-10.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM19 19h-3v-5a2 2 0 00-4 0v5h-3v-9h3v1a3 3 0 016 0v8z",
                },
                {
                  name: "YouTube",
                  icon: "M22.54 6.42a2.78 2.78 0 00-1.94-1.94C19.29 4 12 4 12 4s-7.29 0-8.6.48A2.78 2.78 0 001.46 6.42C1 7.73 1 12 1 12s0 4.27.46 5.58a2.78 2.78 0 001.94 1.94C4.71 20 12 20 12 20s7.29 0 8.6-.48a2.78 2.78 0 001.94-1.94C23 16.27 23 12 23 12s0-4.27-.46-5.58zM10 15V9l6 3-6 3z",
                },
                {
                  name: "X",
                  icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-[#000000] hover:scale-110 transition-transform duration-300"
                >
                  <svg
                    className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5"
                    fill="#000000"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Logo and Copyright */}
        <div className="flex flex-col items-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Inflow Logo"
            className="h-8 xs:h-10 sm:h-12 mb-4 xs:mb-6"
          />

          {/* Copyright */}
          <p
            className="text-xs xs:text-sm sm:text-base"
            style={{
              color: "#4B5563", // Lighter gray for contrast
              fontFamily: "Avenir LT Std, sans-serif",
            }}
          >
            © 2025 inflow.chat ALL rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
