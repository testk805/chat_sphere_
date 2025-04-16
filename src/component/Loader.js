import React from "react";

export default function Loader() {
  return (
    <div>
      <div className="global_loader">
        <div className="cube-wrapper">
          <div className="cube-folding">
            <span className="leaf1"></span>
            <span className="leaf2"></span>
            <span className="leaf3"></span>
            <span className="leaf4"></span>
          </div>
          <span className="loading" data-name="Loading">
            Loading
          </span>
        </div>
      </div>
    </div>
  );
}
