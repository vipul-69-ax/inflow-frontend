"use client"

import type React from "react"

type ButtonProps = {
  backgroundColor: string
  textColor: string
  borderRadiusClass: string
  buttonType: string
  title: string
  thumbnail?: React.ReactNode // Add thumbnail prop
  fontFamily?: string // Add fontFamily prop
}

function ButtonToShow({
  backgroundColor,
  textColor,
  borderRadiusClass,
  buttonType,
  title,
  thumbnail,
  fontFamily = "'Inter'", // Default font family
}: ButtonProps) {
  const buttonNewStyles = [
    { id: "fill-square", bg_color: "black", text_color: "black", border_color: "black", border_radius: "rounded-none" },
    { id: "fill-rounded", bg_color: "black", text_color: "black", border_color: "black", border_radius: "rounded-lg" },
    { id: "fill-pill", bg_color: "black", text_color: "black", border_color: "black", border_radius: "rounded-full" },
    {
      id: "outline-square",
      bg_color: "transparent",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-none",
    },
    {
      id: "outline-rounded",
      bg_color: "transparent",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-lg",
    },
    {
      id: "outline-pill",
      bg_color: "transparent",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-full",
    },
    {
      id: "hard-shadow-square",
      bg_color: "black",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-none",
    },
    {
      id: "hard-shadow-rounded",
      bg_color: "black",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-lg",
    },
    {
      id: "hard-shadow-pill",
      bg_color: "black",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-full",
    },
    {
      id: "soft-shadow-square",
      bg_color: "black",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-none",
    },
    {
      id: "soft-shadow-rounded",
      bg_color: "black",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-lg",
    },
    {
      id: "soft-shadow-pill",
      bg_color: "black",
      text_color: "white",
      border_color: "black",
      border_radius: "rounded-full",
    },
  ]

  const filteredStyles = buttonNewStyles.filter(
    (style) => style.id.startsWith(buttonType) && style.border_radius === borderRadiusClass,
  )

  // Update the animations object to include fill button animations and improve soft shadow
  const animations = {
    outline: {
      button: "transition-all duration-300 ease-in-out hover:transition-all hover:duration-300",
      hoverStyles: {
        backgroundColor: backgroundColor,
        color: getContrastColor(backgroundColor),
      },
      defaultStyles: {
        backgroundColor: "transparent",
        color: textColor,
        borderColor: backgroundColor,
      },
    },
    fill: {
      button: "transition-all duration-300 ease-in-out",
      hoverStyles: {
        backgroundColor: "transparent",
        color: backgroundColor,
      },
      defaultStyles: {
        backgroundColor: backgroundColor,
        color: textColor,
        borderColor: backgroundColor,
      },
    },
    hardShadow: {
      container: "group",
      shadow: "transition-all duration-200 ease-out group-hover:top-[2px] group-hover:left-[2px]",
      button: "transition-all duration-200 ease-out group-hover:translate-y-[1px] group-hover:translate-x-[1px]",
    },
    softShadow: {
      button:
        "transition-all duration-300 ease-in-out shadow-[0_6px_10px_0_rgba(0,0,0,0.25)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),0_0_30px_rgba(255,255,255,0.3)] hover:translate-y-[-4px]",
    },
  }

  // Render different button types
  const renderButton = (style: any) => {
    if (buttonType.startsWith("hard")) {
      return renderHardShadowButton(style)
    } else if (buttonType.startsWith("soft")) {
      return renderSoftShadowButton(style)
    } else if (buttonType.startsWith("outline")) {
      return renderOutlineButton(style)
    } else {
      return renderFillButton(style)
    }
  }

  // Render content with thumbnail and text
  const renderContent = () => (
    <>
      {thumbnail && <div className="flex-shrink-0 mr-3 flex items-center justify-center">{thumbnail}</div>}
      <div
        className="text-xs font-normal w-100 overflow-hidden"
        style={{
          color: textColor,
          fontFamily: fontFamily,
        }}
      >
        {title}
      </div>
    </>
  )

  // Render hard shadow button
  const renderHardShadowButton = (style: any) => (
    <div key={style.id} className="flex h-6 w-50 items-center justify-center">
      <div className={animations.hardShadow.container + " relative w-full"}>
        <div
          className={`absolute bg-black w-full h-full top-1 left-1 ${style.border_radius} ${animations.hardShadow.shadow}`}
        ></div>
        <div
          className={`relative bg-white py-2 px-3 border border-black flex justify-center items-center w-full ${style.border_radius} ${animations.hardShadow.button}`}
          style={{ backgroundColor: backgroundColor !== "transparent" ? backgroundColor : "white" }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  )

  // Replace the renderSoftShadowButton function with this updated version
  const renderSoftShadowButton = (style: any) => (
    <div key={style.id} className="flex h-6 w-50 items-center justify-center">
      <div className="relative w-full">
        <div
          className={`relative bg-white py-2 px-3 border border-black flex justify-center items-center w-full ${style.border_radius} ${animations.softShadow.button}`}
          style={{ backgroundColor: backgroundColor !== "transparent" ? backgroundColor : "white" }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  )
  

  // Render outline button
  const renderOutlineButton = (style: any) => (
    <div key={style.id} className="flex h-6 w-50 flex-col items-center">
      <div
        className={`w-full py-2 px-3 inline-flex justify-center items-center gap-2 border ${style.border_radius} ${animations.outline.button}`}
        style={{
          ...animations.outline.defaultStyles,
          borderColor: backgroundColor,
        }}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, animations.outline.hoverStyles)
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, animations.outline.defaultStyles)
        }}
      >
        {renderContent()}
      </div>
    </div>
  )

  // Replace the renderFillButton function with this updated version
  const renderFillButton = (style: any) => (
    <div key={style.id} className="flex h-6 w-50 flex-col items-center">
      <div
        className={`w-full py-2 px-3 inline-flex justify-center items-center gap-2 border ${style.border_radius} ${animations.fill.button}`}
        style={{
          ...animations.fill.defaultStyles,
        }}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, animations.fill.hoverStyles)
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, animations.fill.defaultStyles)
        }}
      >
        {renderContent()}
      </div>
    </div>
  )

  return <div className="w-full">{filteredStyles.map((style) => renderButton(style))}</div>
}

// Helper function to determine contrasting text color
function getContrastColor(hexColor: string): string {
  // Default to white if not a hex color
  if (!hexColor.startsWith("#")) {
    return hexColor === "white" ? "black" : "white"
  }

  // Convert hex to RGB
  const r = Number.parseInt(hexColor.slice(1, 3), 16)
  const g = Number.parseInt(hexColor.slice(3, 5), 16)
  const b = Number.parseInt(hexColor.slice(5, 7), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark ones
  return luminance > 0.5 ? "black" : "white"
}

export default ButtonToShow