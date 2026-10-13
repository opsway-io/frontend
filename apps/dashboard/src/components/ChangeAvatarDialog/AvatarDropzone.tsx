import { Box, Button, Divider, Stack, Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudDone, IoCloudOffline, IoCloudUpload } from "react-icons/io5";

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

interface AvatarDropzoneProps {
  onLoadStart: () => void;
  /** Called with the selected image as a data URL. */
  onLoaded: (dataUrl: string) => void;
  onLoadFailed: () => void;
}

const AvatarDropzone: FunctionComponent<AvatarDropzoneProps> = ({
  onLoadStart,
  onLoaded,
  onLoadFailed,
}) => {
  const fail = (message: string) => {
    enqueueSnackbar(message, { variant: "error" });
    onLoadFailed();
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    maxFiles: 1,
    accept: { image: ACCEPTED_FILE_TYPES },
    onDrop(acceptedFiles) {
      if (acceptedFiles.length !== 1) {
        return;
      }

      onLoadStart();

      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        fail("File is too big");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => onLoaded(reader.result as string));
      reader.addEventListener("error", () => fail("Failed to upload file"));
      reader.addEventListener("abort", () => fail("File upload aborted"));
      reader.readAsDataURL(file);
    },
  });

  const dragColor = isDragAccept
    ? "success.500"
    : isDragReject
      ? "danger.500"
      : undefined;

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        color: "text.secondary",
        borderRadius: "md",
        outline: dragColor ? "1px dashed" : "none",
        outlineColor: dragColor,
        outlineOffset: "-1px",
      }}
    >
      <input {...getInputProps()} />
      <Stack spacing={2} alignItems="center" sx={{ width: 240 }}>
        {isDragReject && <IoCloudOffline size={56} />}

        {isDragAccept && <IoCloudDone size={56} />}

        {!isDragActive && (
          <>
            <IoCloudUpload size={56} />

            <Typography level="body-sm" textColor="text.secondary">
              Drag and drop your avatar here
            </Typography>

            <Divider sx={{ width: "100%" }}>or</Divider>

            <Button variant="outlined" color="neutral" fullWidth>
              Select file
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default AvatarDropzone;
