import { Box, IconButton, Sheet, Tooltip, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useEffect, useState } from "react";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";

interface CodeSnippetProps {
  code: string;
  label?: string;
  /** Snackbar message shown after copying. */
  copyMessage?: string;
}

/**
 * Read-only code / embed snippet in a rounded monospace sheet with a copy
 * button.
 */
const CodeSnippet: FunctionComponent<CodeSnippetProps> = ({
  code,
  label,
  copyMessage = "Copied to clipboard",
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    enqueueSnackbar(copyMessage, { variant: "success" });
  };

  return (
    <Box>
      {label && (
        <Typography
          level="body-xs"
          fontWeight={500}
          textColor="text.secondary"
          sx={{ mb: 0.75 }}
        >
          {label}
        </Typography>
      )}
      <Sheet
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          p: 0.75,
          pl: 1.5,
          borderRadius: "md",
          bgcolor: "background.level1",
        }}
      >
        <Box
          component="pre"
          sx={{
            m: 0,
            py: 0.5,
            flex: 1,
            minWidth: 0,
            fontFamily: "code",
            fontSize: "sm",
            lineHeight: 1.6,
            color: "text.primary",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {code}
        </Box>
        <Tooltip title={copied ? "Copied" : "Copy"}>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            aria-label="Copy to clipboard"
            onClick={copy}
          >
            {copied ? <IoCheckmark /> : <IoCopyOutline />}
          </IconButton>
        </Tooltip>
      </Sheet>
    </Box>
  );
};

export default CodeSnippet;
