import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const AIEngagementSection: React.FC<{
  lottieAnimationPath?: string;
}> = ({ lottieAnimationPath = "./" }) => {
  return (
    <section
      className="relative w-full py-6 px-3 xs:py-8 xs:px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-24"
      style={{ backgroundColor: "#F78764" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 xs:gap-6">
        {/* Lottie Animation */}
        <div className="w-full md:w-1/3 mr-20 flex justify-center items-center relative mt-4 xs:mt-6 sm:mt-8 md:mt-0 order-2 md:order-1">
          <div className="relative w-[150px] h-[195px] xs:w-[180px] xs:h-[230px] sm:w-[250px] sm:h-[325px] md:w-[300px] md:h-[390px] lg:w-[350px] lg:h-[455px]">
            {/* Background blur effects */}
            <div
              className="absolute inset-0 w-full h-full rounded-full blur-2xl"
              style={{ backgroundColor: "rgba(235, 235, 211, 0.1)" }}
            ></div>
            <div
              className="absolute inset-0 w-[80%] h-[80%] mx-auto my-auto rounded-full blur-xl"
              style={{ backgroundColor: "rgba(235, 235, 211, 0.2)" }}
            ></div>

            {/* Lottie Animation */}
            <DotLottieReact
              src={lottieAnimationPath}
              autoplay
              loop
              className="w-full h-full z-10 relative"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-2/3 text-center md:text-left order-1 md:order-2">
          <h2
            className="text-lg xs:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 xs:mb-3 sm:mb-4"
            style={{
              color: "#EBEBD3",
              fontFamily: "Avenir LT Std, sans-serif",
            }}
          >
            AI Engagement: Never Miss a Moment
          </h2>
          <p
            className="text-xs xs:text-sm sm:text-lg md:text-xl mb-3 xs:mb-4 sm:mb-6"
            style={{
              color: "#EBEBD3",
              fontFamily: "Avenir LT Std, sans-serif",
            }}
          >
            Your audience expects instant interaction. We are always on, always
            growing.
          </p>

          <div className="space-y-1 xs:space-y-2 sm:space-y-4 mb-3 xs:mb-4 sm:mb-6">
            <div className="flex items-center justify-center md:justify-start space-x-1 xs:space-x-2 sm:space-x-3">
              <div
                className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EBEBD3" }}
              >
                <svg
                  className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 text-[#F78764]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span
                className="text-[10px] xs:text-xs sm:text-base"
                style={{
                  color: "#EBEBD3",
                  fontFamily: "Avenir LT Std, sans-serif",
                }}
              >
                Automated DMs & Comment Replies – Engage in real time, even when
                you’re offline.
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-1 xs:space-x-2 sm:space-x-3">
              <div
                className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EBEBD3" }}
              >
                <svg
                  className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 text-[#F78764]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span
                className="text-[10px] xs:text-xs sm:text-base"
                style={{
                  color: "#EBEBD3",
                  fontFamily: "Avenir LT Std, sans-serif",
                }}
              >
                AI Chatbots – Build meaningful relationships effortlessly.
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-1 xs:space-x-2 sm:space-x-3">
              <div
                className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EBEBD3" }}
              >
                <svg
                  className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 text-[#F78764]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span
                className="text-[10px] xs:text-xs sm:text-base"
                style={{
                  color: "#EBEBD3",
                  fontFamily: "Avenir LT Std, sans-serif",
                }}
              >
                Smart Sequences – Guide your audience from interaction to
                conversion.
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-1 xs:space-x-2 sm:space-x-3">
              <div
                className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EBEBD3" }}
              >
                <svg
                  className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 text-[#F78764]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span
                className="text-[10px] xs:text-xs sm:text-base"
                style={{
                  color: "#EBEBD3",
                  fontFamily: "Avenir LT Std, sans-serif",
                }}
              >
                Engagement Analytics – Understand what drives your audience to
                take action.
              </span>
            </div>
          </div>

          <p
            className="text-sm xs:text-base sm:text-xl md:text-2xl font-semibold mb-3 xs:mb-4 sm:mb-6 italic"
            style={{
              color: "#EBEBD3",
              fontFamily: "Sanista Swashed, cursive",
            }}
          >
            More Conversations. More Conversions. More Influence.
          </p>

          <button
            className="flex items-center justify-center space-x-1 px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 mx-auto md:mx-0"
            style={{ backgroundColor: "#126AD4", color: "#FFFFFF" }}
          >
            <span
              className="text-xs xs:text-sm sm:text-lg"
              style={{ fontFamily: "Avenir LT Std, sans-serif" }}
            >
              Activate AI Engagement
            </span>
            <svg
              className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5"
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
    </section>
  );
};

export default AIEngagementSection;
