import {
  CircularProgress,
  TextField,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { FaCheck } from "react-icons/fa";

type EditableInputProps = {
  onSave?: () => void;
  onValidate?: (value: string) => boolean;
  savedIndicatorDuration?: number;
} & TextFieldProps;

const EditableInput: FunctionComponent<EditableInputProps> = (props) => {
  const { onSave, onValidate, savedIndicatorDuration, ...textFieldProps } =
    props;

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [valid, setValid] = useState(true);

  let timeoutInstance: ReturnType<typeof setTimeout>;

  const handleBlur = () => {
    if (!hasChanged) {
      return;
    }

    if (!valid) {
      return;
    }

    setLoading(true);

    onSave?.();

    setLoading(false);
    setSaved(true);
    setHasChanged(false);

    if (timeoutInstance) {
      clearTimeout(timeoutInstance);
    }

    timeoutInstance = setTimeout(() => {
      setSaved(false);
    }, savedIndicatorDuration);
  };

  const handleValidate = (value: string) => {
    const isValid = props.onValidate?.(value) ?? true;

    setValid(isValid);
  };

  return (
    <TextField
      {...textFieldProps}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleBlur();
        }
      }}
      onChange={(e) => {
        setHasChanged(true);
        handleValidate(e.target.value);
        textFieldProps.onChange?.(e);
      }}
      disabled={loading}
      InputProps={{
        endAdornment: (
          <EditableInputIndicator loading={loading} saved={saved} />
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: valid ? (saved ? "success.main" : null) : "error.main",
        },
      }}
    />
  );
};

EditableInput.defaultProps = {
  savedIndicatorDuration: 2000,
};

interface EditableInputIndicatorProps {
  loading?: boolean;
  saved?: boolean;
}

const EditableInputIndicator: FunctionComponent<EditableInputIndicatorProps> = (
  props
) => {
  const theme = useTheme();

  if (props.loading) {
    return <CircularProgress size={16} />;
  }

  if (props.saved) {
    return <FaCheck color={theme.palette.success.main} size={16} />;
  }

  return null;
};

export default EditableInput;
