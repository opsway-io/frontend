import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import TopBar from "./components/topbar";
import LeftBar from "./components/leftbar";
import Editor from "./components/editor";
import { DndContext } from "@dnd-kit/core";
import RightBar from "./components/rightbar";

const Builder: FunctionComponent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
        gap: 1,
        padding: 1,
        backgroundColor: "background.default",
      }}
    >
      <TopBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          flex: 1,
        }}
      >
        <DndContext onDragEnd={(e) => console.log(e)}>
          <LeftBar />
          <Editor />
          <RightBar />
        </DndContext>
      </Box>
    </Box>
  );
};

export default Builder;
