import {
  alpha,
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Divider,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { IoCloudDone, IoCloudOffline, IoCloudUpload } from "react-icons/io5";
import { Dialog } from "../../../../components/Dialog";
import { useDropzone } from "react-dropzone";
import { enqueueSnackbar } from "notistack";
import { MdOutlineZoomOutMap } from "react-icons/md";
import cropImage from "../../../../utilities/image";
import * as TeamAPI from "../../../../api/endpoints/teams";

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

interface ChangeTeamAvatarModalProps {
  teamId?: string | number;
  open: boolean;
  onClose?: (ok: boolean) => void;
}

const ChangeTeamAvatarModal: FunctionComponent<ChangeTeamAvatarModalProps> = (
  props,
) => {
  // Image selection

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, isDragActive, isDragReject, isDragAccept } =
    useDropzone({
      maxFiles: 1,
      accept: {
        image: ACCEPTED_FILE_TYPES,
      },
      onDrop(acceptedFiles) {
        if (acceptedFiles.length !== 1) {
          return;
        }

        setLoading(true);

        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
          enqueueSnackbar("File is too big", { variant: "error" });
          return;
        }

        const reader = new FileReader();

        reader.onload = () => {
          setImage(reader.result as string);
          setLoading(false);
        };

        reader.onerror = () => {
          enqueueSnackbar("Failed to upload file", { variant: "error" });
          setLoading(false);
        };

        reader.onabort = () => {
          enqueueSnackbar("File upload aborted", { variant: "error" });
          setLoading(false);
        };

        reader.readAsDataURL(file);
      },
    });

  // Image cropping

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Image upload

  const handleCropAndSubmit = async () => {
    if (!props.teamId || !image || !croppedAreaPixels) {
      return;
    }

    setLoading(true);

    const croppedImage = await cropImage(image, croppedAreaPixels);

    if (!croppedImage) {
      enqueueSnackbar("Failed to crop image", { variant: "error" });
      return;
    }

    try {
      await TeamAPI.updateAvatar(props.teamId, croppedImage);
    } catch (error) {
      enqueueSnackbar("Failed to upload image", { variant: "error" });
    } finally {
      props.onClose?.(true);
    }
  };

  // Reset state when modal is closed / opened

  useEffect(() => {
    setImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setLoading(false);
  }, [props.open]);

  return (
    <Dialog
      title="Change team avatar"
      open={props.open}
      onClose={() => props.onClose?.(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 500,
          width: "100%",
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.3),
        }}
      >
        {!loading && !image && (
          <Box
            {...getRootProps()}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "calc(100% - 4px)",
              height: "100%",
            }}
          >
            <Stack spacing={2} alignItems="center">
              {isDragReject && <IoCloudOffline size={72} />}

              {isDragAccept && <IoCloudDone size={72} />}

              {!isDragActive && (
                <>
                  <IoCloudUpload size={72} />

                  <Typography variant="body2">
                    Drag and drop your avatar here
                  </Typography>

                  <Divider flexItem>or</Divider>

                  <Button variant="outlined" color="primary" fullWidth>
                    Select file
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}

        {loading && <CircularProgress />}

        {!loading && image && (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                position: "relative",
              },
            }}
          />
        )}
      </Box>

      <DialogContent
        sx={{
          textAlign: "center",
        }}
      >
        {image && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <MdOutlineZoomOutMap size={24} />
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, v) => setZoom(v as number)}
              />
            </Stack>

            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleCropAndSubmit}
            >
              Crop and submit
            </Button>
          </Stack>
        )}

        {!image && (
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ marginTop: 2 }}
          >
            Your avatar must be a PNG or JPG file and max 2MB.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTeamAvatarModal;
