import React from "react";

function LoadingPlaceholder(props) {
  const loaderStyle = {
    position: "relative",
    backgroundColor: "#eee",
    width: "100%",
    overflow: "hidden",
    ...props.extraStyles,
  };

  const loaderSwiperStyles = {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    animation: "loaderSwipeAnim 1s cubic-bezier(0.4,0.0,0.2,1) infinite",
    background:
      "linear-gradient(to right, #eeeeee 10%, #dddddd 50%, #eeeeee 90%)",
  };

  return (
    <div style={loaderStyle}>
      <div style={loaderSwiperStyles}></div>
    </div>
  );
}

export default LoadingPlaceholder;
