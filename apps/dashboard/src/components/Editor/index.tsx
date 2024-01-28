import { EditorProps as MonacoEditorProps } from "@monaco-editor/react";
import { FunctionComponent, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import * as monaco from "monaco-editor";
import { HiOutlineCommandLine } from "react-icons/hi2";
import { humanizeBytes } from "../../utilities/data";

const Wrapper = styled("div")(({ theme }) => ({
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#1e1e1e",
}));

interface EditorProps extends MonacoEditorProps {}

const Editor: FunctionComponent<EditorProps> = (props) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();
  const [size, setSize] = useState<number>(0);

  const updateSize = () => {
    const size = editor?.getModel()?.getValue().length;
    setSize(size ?? 0);
  };

  return (
    <Wrapper>
      <Box
        sx={{
          padding: 1,
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <MonacoEditor
          {...props}
          onMount={(editor) => {
            setEditor(editor);
            updateSize();
          }}
          loading={<CircularProgress />}
          onChange={(value, ev) => {
            updateSize();

            props.onChange?.(value, ev);
          }}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: "#252526",
          padding: 1,
          paddingRight: 2,
          paddingLeft: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="text"
            size="small"
            startIcon={<HiOutlineCommandLine />}
            sx={{
              marginRight: "auto",
            }}
            onClick={() => {
              editor?.getAction("editor.action.formatDocument").run();
            }}
          >
            Format Document
          </Button>

          <Typography variant="body1" color="text.secondary">
            {humanizeBytes(size)}
          </Typography>
        </Stack>
      </Box>
    </Wrapper>
  );
};

Editor.defaultProps = {
  height: "300px",
  defaultLanguage: "text",
  theme: "vs-dark",
  options: {
    minimap: {
      enabled: false,
    },
  },
};

export default Editor;
