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
          style={{ color: "#FFF", fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Plans we offer
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-10 py-12">
          {/* FREE PLAN */}
          <div
            className="p-4 sm:p-8 rounded-3xl shadow-2xl transition-transform transform hover:scale-105 flex flex-col"
            style={{
              backgroundImage:
                "radial-gradient(119.18% 118.7% at 92.72% 23.01%, #AFAFAF 0%, #4D4D4D 55.5%, #333 79%, #1A1A1A 100%)",
            }}
          >
            <div
              className="mb-6 rounded-2xl px-6 py-6 shadow-lg text-center"
              style={{
                backgroundImage:
                  "radial-gradient(563.25% 134.76% at 53.05% 50%, #AFAFAF 0%, #4D4D4D 55.5%, #333 79%, rgba(26, 26, 26, 0.00) 100%)",
              }}
            >
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                FREE
              </h3>
            </div>

            <div
              className="flex flex-col justify-between flex-grow text-white text-left px-4"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
              }}
            >
              <div className="space-y-6 mb-8">
                {/* Biolink */}
                <div>
                  <p className="font-semibold text-white mb-1">Biolink</p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>Basic Designs</li>
                    <li>Unlimited Links</li>
                  </ul>
                </div>

                {/* Schedule & Monitoring */}
                <div>
                  <p className="font-semibold text-white mb-1">
                    Schedule & Monitoring
                  </p>
                  <p className="mb-1">
                    Monitor Social media accounts to stay on top of trends
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>1 Channel</li>
                  </ul>
                  <p className="mt-2">
                    Target potential users interested in your content.
                  </p>
                  <ul className="ml-6 list-disc space-y-1 mt-1">
                    <li>10 Schedule post per channel</li>
                    <li>10 accounts monitoring</li>
                  </ul>
                </div>

                {/* Chatbot */}
                <div>
                  <p className="font-semibold text-white">Chatbot</p>
                </div>
              </div>

              <div className=" px-2">
                <button
                  className="flex items-center cursor-pointer justify-center px-6 py-3 rounded-full w-full text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, #3E87E0 0%, #1D6AC9 100%)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "60px",
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

          {/* PRO PLAN */}
          <div
            className="p-6 sm:p-8 rounded-3xl shadow-2xl transition-transform transform hover:scale-105 flex flex-col"
            style={{
              backgroundImage:
                "radial-gradient(119.18% 118.7% at 92.72% 23.01%, #D58A9D 0%, #5D3C44 55.5%, #38283E 79%, #14171F 100%)",
            }}
          >
            <div
              className="mb-6 rounded-2xl px-6 py-6 shadow-lg text-center"
              style={{
                backgroundImage:
                  "radial-gradient(151.26% 118.6% at 52.59% 39.47%, #D58A9D 0%, #5D3C44 55.5%, #38283E 79%, rgba(20, 23, 31, 0.00) 100%)",
              }}
            >
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                PRO
              </h3>
              <p className="text-white text-lg sm:text-xl font-semibold">
                35 USD per month
              </p>
            </div>

            <div className="flex flex-col text-white flex-grow text-left">
              <p className="sm:text-md mb-4">
                Elevate your online presence with customization and growth
                features
              </p>

              <p className="mb-1 font-semibold">Everything in free, plus:</p>

              <div className="space-y-4 mb-6 px-2">
                <div className="flex items-start space-x-3 text-sm sm:text-base">
                  <span>
                    <strong>Biolink :</strong>&nbsp;&nbsp;&#8226;
                  </span>
                  <span>Classic designs</span>
                </div>
                <div className="flex items-start space-x-3 text-sm sm:text-base">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8226;</span>
                  <span>
                    Scheduled links to appear and disappear at specific times
                  </span>
                </div>
                <div className="flex items-start space-x-3 text-sm sm:text-base">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&#8226;</span>
                  <span>
                    Animations, buttons and font styles to match your
                    identity/brand
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-6 px-2">
                <p className="font-semibold">Schedule & Monitoring</p>
                <p className="text-sm sm:text-base">
                  Monitor Social media accounts to stay on top of trends
                </p>
                <p className="text-sm sm:text-base">&#8226; 5 channels</p>
                <p className="text-sm sm:text-base">
                  Unlimited scheduled post per channel
                </p>
                <p className="text-sm sm:text-base">50 accounts monitoring</p>
              </div>

              <div className="space-y-1 px-2 mb-8">
                <p className="font-semibold">Chatbot</p>
                <p className="text-sm sm:text-base">2 Scenarios for total</p>
              </div>

              <div className="mt-auto px-2">
                <button
                  className="flex items-center cursor-pointer justify-center px-6 py-3 rounded-full w-full text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, #E03E67 0%, #C91D48 100%)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "60px",
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

          {/* GURU PLAN */}
          <div
            className="p-6 sm:p-8 rounded-3xl text-white shadow-2xl transition-transform transform hover:scale-105 flex flex-col"
            style={{
              backgroundImage:
                "radial-gradient(119.18% 118.7% at 92.72% 23.01%, #D5C58A 0%, #5D563C 55.5%, #3E282E 79%, #1C141F 100%)",
            }}
          >
            <div
              className="mb-6 rounded-2xl px-6 py-6 shadow-lg text-left"
              style={{
                backgroundImage:
                  "radial-gradient(256.41% 109.45% at 55.95% 43.42%, #D5C58A 0%, #5D563C 55.5%, #3E282E 79%, rgba(28, 20, 31, 0.00) 100%)",
              }}
            >
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                GURU
              </h3>
              <p className="text-white text-lg sm:text-xl font-semibold">
                49 USD per month
              </p>
            </div>

            <div className="flex flex-col justify-between flex-grow text-left">
              <p className="text-white text-base sm:text-lg mb-6 px-2">
                Supercharged
              </p>
              <p className="px-2">Everything in pro, plus:</p>

              <div className="space-y-4 mb-8 px-2">
                {["Biolink: Customer service any time anywhere"].map(
                  (feature, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-3 text-sm sm:text-base text-white"
                    >
                      <span className="mt-1">&#8226;</span>
                      <span>{feature}</span>
                    </div>
                  )
                )}

                <p className="text-sm sm:text-base">
                  &#8226; Schedule & Monitoring
                </p>
                <p className="text-sm sm:text-base font-semibold">
                  &#8226; All Features
                </p>

                <p className="text-sm sm:text-base font-semibold mt-2">
                  Chatbot
                </p>
                <p className="text-sm sm:text-base">
                  &#8226; 3 Scenarios for total
                </p>
              </div>

              <div className="mt-auto px-2">
                <button
                  className="flex items-center cursor-pointer justify-center px-6 py-3 rounded-full w-full text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(180deg, #E0BD3E 0%, #C9A31D 100%)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    borderRadius: "60px",
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
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
