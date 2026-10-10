"use client";
import dynamic from "next/dynamic";
export default dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => (
    <div className="scene-loading">
      <span className="loading-line" />
    </div>
  ),
});
