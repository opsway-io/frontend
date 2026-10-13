import {
  Box,
  Button,
  CircularProgress,
  Slider,
  Stack,
  Typography,
} from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { MdOutlineZoomOutMap } from "react-icons/md";
import cropImage from "../../utilities/image";
import { DialogContent } from "../Dialog/Dialog";
import AvatarDropzone from "./AvatarDropzone";

interface AvatarCropFormProps {
  onUpload: (image: Blob) => Promise<unknown>;
  onUploaded: () => void;
}

const AvatarCropForm: FunctionComponent<AvatarCropFormProps> = ({
  onUpload,
  onUploaded,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area>();

  const handleCropAndSubmit = async () => {
    if (!image || !croppedArea) {
      return;
    }

    setLoading(true);

    const croppedImage = await cropImage(image, croppedArea);

    if (!croppedImage) {
      enqueueSnackbar("Failed to crop image", { variant: "error" });
      setLoading(false);
      return;
    }

    try {
      await onUpload(croppedImage);
      onUploaded();
    } catch {
      enqueueSnackbar("Failed to upload image", { variant: "error" });
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (loading) {
      return <CircularProgress size="md" color="neutral" />;
    }

    if (!image) {
      return (
        <AvatarDropzone
          onLoadStart={() => setLoading(true)}
          onLoaded={(dataUrl) => {
            setImage(dataUrl);
            setLoading(false);
          }}
          onLoadFailed={() => setLoading(false)}
        />
      );
    }

    return (
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onCropComplete={(_, croppedAreaPixels) =>
          setCroppedArea(croppedAreaPixels)
        }
        onZoomChange={setZoom}
        style={{
          containerStyle: {
            width: "100%",
            height: "100%",
            position: "relative",
          },
        }}
      />
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "md",
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "background.level1",
        }}
      >
        {renderPreview()}
      </Box>

      <DialogContent>
        {image ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component={MdOutlineZoomOutMap}
                sx={{ fontSize: 20, color: "text.secondary", flexShrink: 0 }}
              />
              <Slider
                aria-label="Zoom"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                color="neutral"
                onChange={(_, value) => setZoom(value as number)}
              />
            </Stack>

            <Button fullWidth onClick={handleCropAndSubmit} loading={loading}>
              Crop and submit
            </Button>
          </Stack>
        ) : (
          <Typography
            level="body-xs"
            textColor="text.tertiary"
            textAlign="center"
          >
            Your avatar must be a PNG or JPG file and max 2MB.
          </Typography>
        )}
      </DialogContent>
    </>
  );
};

export default AvatarCropForm;
