import React from "react";

function LoadingPlaceholder(props) {
  const loaderStyle = {
    ...props.extraStyles,
  };

  return (
    <div style={loaderStyle} className="placeholderLoading">
      <div className="loadingSwiper"></div>
    </div>
  );
}

export default LoadingPlaceholder;
