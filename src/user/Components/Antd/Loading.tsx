import { Spin } from "antd";

const Loading: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "white",
        zIndex: "100",
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
