import React, { useState } from "react";

function ButtonEditor({ type ,selectedStyleId, setSelectedStyleId}) {
  const buttonNewStyles = [
    { id: "fill-square", bg_color: "black", text_color: "black", border_color: "black", border_radius: "rounded-none" },
    { id: "fill-rounded", bg_color: "black", text_color: "black", border_color: "black", border_radius: "rounded-lg" },
    { id: "fill-pill", bg_color: "black", text_color: "black", border_color: "black", border_radius: "rounded-full" },
    { id: "outline-square", bg_color: "transparent", text_color: "white", border_color: "black", border_radius: "rounded-none" },
    { id: "outline-rounded", bg_color: "transparent", text_color: "white", border_color: "black", border_radius: "rounded-lg" },
    { id: "outline-pill", bg_color: "transparent", text_color: "white", border_color: "black", border_radius: "rounded-full" },
    { id: "shadow-square", bg_color: "black", text_color: "white", border_color: "black", border_radius: "rounded-none" },
    { id: "shadow-rounded", bg_color: "black", text_color: "white", border_color: "black", border_radius: "rounded-lg" },
    { id: "shadow-pill", bg_color: "black", text_color: "white", border_color: "black", border_radius: "rounded-full" },
  ];

  //const [selectedStyleId, setSelectedStyleId] = useState("");

  const filteredStyles = buttonNewStyles.filter(style => style.id.startsWith(type));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredStyles.map((style) =>
        style.id.startsWith("shadow") ? (
          <div
            key={style.id}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedStyleId === style.id ? "border-purple-600" : "border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => setSelectedStyleId(style.id)}
          >
            {selectedStyleId === style.id && (
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
            <div className="relative mt-2 inline-block">
              <div className={`absolute bg-black w-full h-full top-1 left-1 ${style.border_radius}`}></div>
              <div className={`relative bg-white px-14 py-2 border border-black flex justify-center items-center ${style.border_radius}`}>
                <div className="text-white text-xs font-normal font-sans">Button</div>
              </div>
            </div>
          </div>
        ) : (
          <div
            key={style.id}
            className={`rounded-lg border-2 transition-all ${
              selectedStyleId === style.id ? "border-purple-600" : "border-gray-200 dark:border-gray-700"
            }`}
            style={{ backgroundColor: "white" }}
          >
            <div className={`relative p-4 cursor-pointer`} onClick={() => setSelectedStyleId(style.id)}>
              {selectedStyleId === style.id && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
              <div className="flex flex-col items-center">
                <div
                  className={`w-40 px-4 py-2 inline-flex justify-center items-center gap-2 border ${style.border_radius}`}
                  style={{
                    backgroundColor: style.bg_color,
                    color: style.text_color,
                    borderColor: style.border_color,
                  }}
                >
                    {/* <div className="w-8 h-8 bg-black rounded-sm"></div> */}
                  <div className="flex-1 text-center text-xs font-normal font-['Inter']">
                    Button
                  </div>

                  {/* <div className="flex flex-col justify-center items-center space-y-1 w-4">
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div> */}
              
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default ButtonEditor;