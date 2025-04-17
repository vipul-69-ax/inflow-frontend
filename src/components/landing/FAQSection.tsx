// components/FAQComponent.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "What services does your platform provide?",
    answer:
      "Our platform offers comprehensive digital solutions including AI-powered chatbots, social media management, analytics tracking, and personalized customer engagement tools designed to streamline your business communication.",
  },
  {
    question: "Who are your main customers?",
    answer:
      "We serve a diverse range of businesses, from small startups to large enterprises across various industries including e-commerce, tech, healthcare, education, and professional services.",
  },
  {
    question: "How does Inflowchat help me grow my brand?",
    answer:
      "Inflowchat provides intelligent customer interaction tools, real-time analytics, and AI-driven insights that help you understand your audience, improve customer engagement, and ultimately drive brand growth and customer retention.",
  },
  {
    question: "What features does Inflowchat offer?",
    answer:
      "Key features include AI chatbot, social media monitoring, bio link customization, customer support automation, real-time analytics, engagement tracking, and personalized communication strategies.",
  },
  {
    question: "What makes Inflowchat different from competitors?",
    answer:
      "Our unique AI-powered approach, comprehensive integration capabilities, intuitive user interface, and data-driven insights set us apart from traditional customer engagement platforms.",
  },
  {
    question: "Can I customize my Bio Link page?",
    answer:
      "Yes, our platform offers full customization of Bio Link pages, allowing you to create a personalized, branded landing page that maximizes your social media impact.",
  },
  {
    question: "How does social media monitoring help me?",
    answer:
      "Social media monitoring provides real-time insights into brand mentions, customer sentiment, engagement rates, and helps you quickly respond to customer feedback and trends.",
  },
  {
    question: "What is AI-powered engagement, and how does it work?",
    answer:
      "AI-powered engagement uses machine learning algorithms to analyze customer interactions, predict user behavior, personalize communication, and provide intelligent, context-aware responses.",
  },
  {
    question: "Can I use the chatbot to automate customer support?",
    answer:
      "Absolutely! Our AI chatbot can handle common queries, provide 24/7 support, route complex issues to human agents, and significantly reduce response times.",
  },
  {
    question: "Can I track my analytics and measure my success?",
    answer:
      "Our comprehensive analytics dashboard provides detailed metrics on customer interactions, engagement rates, conversion tracking, and actionable insights to improve your business performance.",
  },
];

const FAQComponent: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="relative w-full py-6 px-3 xs:py-8 xs:px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 lg:py-24"
      style={{
        background: "#000000",
      }}
    >
      {/* Blue glows */}
      <div
        className="absolute top-0 right-0 rounded-full opacity-20 w-[150px] h-[150px] xs:w-[200px] xs:h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 rounded-full opacity-20 w-[150px] h-[150px] xs:w-[200px] xs:h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px]"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 100%)",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <h2
          className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-medium mb-6 xs:mb-8 sm:mb-12 text-center"
          style={{ color: "#FFFFFF", fontFamily: "Avenir LT Std, sans-serif" }}
        >
          Frequently asked questions
        </h2>

        <div className="space-y-2 xs:space-y-3 sm:space-y-4 ">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-[#F5F7FA]  bg-opacity-10 rounded-lg overflow-hidden"
            >
              <button
                className="w-full cursor-pointer flex justify-between items-center p-3 xs:p-4 sm:p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span
                  className="text-sm xs:text-base sm:text-lg md:text-xl"
                  style={{
                    color: "#000000",
                    fontFamily: "Avenir LT Std, sans-serif",
                  }}
                >
                  {faq.question}
                </span>
                <svg
                  className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-90" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="#000000"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 xs:px-4 sm:px-6 pb-4"
                  >
                    <p
                      className="text-xs xs:text-sm sm:text-base"
                      style={{
                        color: "#000000",
                        fontFamily: "Avenir LT Std, sans-serif",
                      }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQComponent;
