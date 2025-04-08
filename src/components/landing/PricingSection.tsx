import React from "react";

const PricingSection: React.FC = () => {
  return (
    <section
      className="relative w-full py-10 px-4 sm:py-16 md:py-24"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center px-4">
        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4 text-center"
          style={{ color: "#FFFFFF", fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Get your offer today
        </h2>
        <p
          className="text-lg sm:text-xl md:text-2xl mb-10"
          style={{ color: "#A3A3A3", fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Plans we offer
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 justify-center">
          {/* Free Plan */}
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#2A2A3C" }}
          >
            <h3
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              FREE
            </h3>
            <p
              className="text-base sm:text-lg mb-6"
              style={{
                color: "#A3A3A3",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              Biolink
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-8 text-left">
              {[
                "Basic Designs",
                "Unlimited Links",
                "1 Channel",
                "Target potential users interested in your content",
                "10 Schedule post per channel",
                "10 accounts monitoring",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm sm:text-base"
                  style={{
                    color: "#A3A3A3",
                    fontFamily: "Avenir LT Std, sans-serif",
                  }}
                >
                  <span>·</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              className="flex items-center justify-center space-x-2 px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 w-full text-base sm:text-lg"
              style={{
                backgroundColor: "#083D77",
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              <span>Buy Now</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Pro Plan */}
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#3A2A44" }}
          >
            <h3
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              PRO
            </h3>
            <p
              className="text-xl sm:text-2xl font-semibold mb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              35 USD per month
            </p>
            <p
              className="text-base sm:text-lg mb-6"
              style={{
                color: "#A3A3A3",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              Elevate your online presence with customization and growth
              features
            </p>

            <div className="space-y-3 mb-8 text-left">
              {[
                "Biolink: Classic designs",
                "Scheduled links to appear and disappear at specific times",
                "Animation, buttons, and font styles to match your identity/brand",
                "5 channels",
                "Unlimited scheduled post per channel",
                "50 accounts monitoring",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm sm:text-base"
                  style={{
                    color: "#A3A3A3",
                    fontFamily: "Avenir LT Std, sans-serif",
                  }}
                >
                  <span>·</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              className="flex items-center justify-center space-x-2 px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 w-full text-base sm:text-lg"
              style={{
                backgroundColor: "#FF4E88",
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              <span>Buy Now</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Guru Plan */}
          <div
            className="p-6 sm:p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#3A2F2A" }}
          >
            <h3
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              GURU
            </h3>
            <p
              className="text-xl sm:text-2xl font-semibold mb-2"
              style={{
                color: "#FFFFFF",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              49 USD per month
            </p>
            <p
              className="text-base sm:text-lg mb-6"
              style={{
                color: "#A3A3A3",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              Supercharged
            </p>

            <div className="space-y-3 mb-8 text-left">
              {[
                "Biolink: Customer service any time anywhere",
                "ALL Features",
                "3 Chatbot Scenarios",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-sm sm:text-base"
                  style={{
                    color: "#A3A3A3",
                    fontFamily: "Avenir LT Std, sans-serif",
                  }}
                >
                  <span>·</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              className="flex items-center justify-center space-x-2 px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 w-full text-base sm:text-lg"
              style={{
                backgroundColor: "#FFD700",
                color: "#1A1A2E",
                fontFamily: "Avenir LT Std, sans-serif",
              }}
            >
              <span>Buy Now</span>
              <svg
                className="w-5 h-5 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
