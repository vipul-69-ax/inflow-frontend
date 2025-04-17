// components/HeroSection.tsx
import Navbar from "@/components/landing/Navbar";
import { useEffect } from "react";
import "../../globals.css";

const HeroSection = ({ onPress }: { onPress: () => void }) => {
  // for heading typing
  useEffect(() => {
    const typingElement = document.getElementById("typing-effect");
    typingElement?.addEventListener("animationend", () => {
      const lineElement = document.getElementById("typing-line");
      lineElement?.classList.remove("hidden");
    });
  }, []);

  return (
    <div className="bg-white">
      <Navbar />

      <section className="relative w-full py-6 px-3 xs:py-8 xs:px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-24 bg-white">
        {/* Background Gradient Overlay */}
        <div
          className="absolute top-0 right-0 w-[50%] h-full hidden md:block"
          style={{
            background:
              "radial-gradient(circle at top right, #FFD7B5 0%, transparent 70%)",
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center">
          {/* Left Side: Text and Button */}
          <div className="flex-1 text-center md:text-left mb-6 xs:mb-8 sm:mb-10 md:mb-0">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span
                id="typing-effect"
                style={{
                  color: "#FF4E88",
                  fontFamily: "'Sansita Swashed', cursive",
                }}
              >
                Inflow Your Reach &nbsp;&nbsp;
              </span>
            </h1>

            <p
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 xs:mb-6 sm:mb-8"
              style={{
                color: "#083D77",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              MORE
            </p>
            {/* Subheadline */}
            <p
              className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-4 xs:mb-6 sm:mb-8"
              style={{
                color: "#083D77",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              .Reach .Fans .Growth
            </p>

            {/* Button */}
            <div
              onClick={onPress}
              className="inline-flex items-center px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3 rounded-tl-lg cursor-pointer rounded-bl-lg rounded-br-lg text-sm xs:text-base sm:text-lg text-white hover:opacity-90 transition-opacity duration-300"
              style={{
                backgroundColor: "#126AD4",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              Start your 15-day free trial
              <svg
                className="w-4 h-4 xs:w-5 xs:h-5 ml-1 xs:ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Right Side: Mobile and Icons (Using the Second Image) */}
          <div className="relative w-150 h-[60vh] ">
            {/* Main hero graphic - part of normal flow */}
            <img
              src="/images/home-hero-assets/Hero Graphic.png"
              alt="Main"
              className="h-120 absolute left-40"
            />

            {/* Positioned graphics - absolute to this div */}
            <img
              src="/images/home-hero-assets/Graphic 01.png"
              alt="Graphic 01"
              className="h-40 absolute top-[10%] left-[30%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/Graphic 02.png"
              alt="Graphic 02"
              className="h-30 absolute top-[3%] left-[70%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/Graphic 05.png"
              alt="Graphic 05"
              className="h-40 absolute top-[55%] left-[50%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/Graphic 04.png"
              alt="Graphic 04"
              className="h-8 absolute top-[87%] left-[35%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/Graphic 03.png"
              alt="Graphic 03"
              className="h-8 absolute top-[93%] left-[54%] hover:scale-110 transition-transform"
            />

            {/* Social icons - absolute inside this section */}
            <img
              src="/images/home-hero-assets/social 01.png"
              alt="Social 01"
              className="h-18 absolute top-[-10%] right-[57%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/social 02.png"
              alt="Social 02"
              className="h-18 absolute top-[15%] right-[75%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/social 03.png"
              alt="Social 03"
              className="h-18 absolute top-[45%] right-[85%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/social 04.png"
              alt="Social 04"
              className="h-18 absolute top-[75%] right-[80%] hover:scale-110 transition-transform"
            />
            <img
              src="/images/home-hero-assets/social 05.png"
              alt="Social 05"
              className="h-18 absolute top-[100%] right-[70%] hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
