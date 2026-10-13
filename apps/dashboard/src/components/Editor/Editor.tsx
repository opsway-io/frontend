import MonacoEditor, { EditorProps } from "@monaco-editor/react";
import { FunctionComponent, useState } from "react";
import { Box, Button, CircularProgress, Sheet, Typography } from "@mui/joy";
import type { editor as MonacoEditorApi } from "monaco-editor";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { humanizeBytes } from "../../utilities/data";

const Editor: FunctionComponent<EditorProps> = ({
  height = "300px",
  defaultLanguage = "text",
  theme = "vs-dark",
  options = {
    minimap: {
      enabled: false,
    },
  },
  ...props
}) => {
  const [editor, setEditor] = useState<MonacoEditorApi.IStandaloneCodeEditor>();
  const [size, setSize] = useState<number>(0);

  const updateSize = (instance = editor) => {
    setSize(instance?.getModel()?.getValue().length ?? 0);
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        overflow: "hidden",
        borderRadius: "md",
        // Monaco's vs-dark background so the frame blends with the editor
        bgcolor: "#1e1e1e",
      }}
    >
      <Box sx={{ py: 1.5, px: 0.5 }}>
        <MonacoEditor
          {...props}
          height={height}
          defaultLanguage={defaultLanguage}
          theme={theme}
          options={options}
          onMount={(instance, m) => {
            setEditor(instance);
            updateSize(instance);
            props.onMount?.(instance, m);
          }}
          loading={<CircularProgress size="sm" />}
          onChange={(value, ev) => {
            updateSize();

            props.onChange?.(value, ev);
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
          py: 0.5,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.level1",
        }}
      >
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          startDecorator={<HiOutlineCommandLine />}
          sx={{ mr: "auto" }}
          onClick={() => {
            editor?.getAction("editor.action.formatDocument")?.run();
          }}
        >
          Format document
        </Button>

        <Typography level="body-xs" textColor="text.tertiary" sx={{ pr: 1 }}>
          {humanizeBytes(size)}
        </Typography>
      </Box>
    </Sheet>
  );
};

export default Editor;
