import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#123c69",
          color: "white",
          display: "flex",
          fontSize: 17,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: 0,
          width: "100%",
        }}
      >
        LR
      </div>
    ),
    size,
  );
}
