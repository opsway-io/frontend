import { Box } from "@mui/material";
import { FunctionComponent } from "react";
import { useDroppable } from "@dnd-kit/core";
import useScreenMode from "../stores/screenMode";

interface EditorProps {
  idk?: string;
}

const Editor: FunctionComponent<EditorProps> = () => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const screenModeStore = useScreenMode();

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        flex: 1,
        padding: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: screenModeStore.height,
          width: screenModeStore.width,
          border: (t) => `1px dotted ${t.palette.divider}`,
          transition: "width 0.2s ease-in-out, height 0.2s ease-in-out",
          ...{
            ...(isOver && {
              backgroundColor: "info.main",
            }),
          },
        }}
        ref={setNodeRef}
      >
        {/* <iframe src="https://status.opsway.io" frameBorder="0"
        
        style={{
          width: "100%",
          height: "100%",
        }}
        ></iframe> */}
      </Box>
    </Box>
  );
};

export default Editor;
