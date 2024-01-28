import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";

interface RightBarProps {
  idk?: string;
}

const RightBar: FunctionComponent<RightBarProps> = () => {
  return (
    <Paper
      sx={{
        width: 300,
        gap: 2,
      }}
      padding={2}
      component={Stack}
    >
      <Typography variant="h1" fontSize={18} fontWeight={800}>
        Properties
      </Typography>

      <ButtonGroup fullWidth>
        <Button>Page</Button>
        <Button variant="contained">Component</Button>
      </ButtonGroup>

      <Box
        sx={{
          border: (t) => `1px dotted ${t.palette.divider}`,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          color: "text.secondary",
          borderRadius: 1,
        }}
      >
        <Typography variant="h2" fontSize={12} fontWeight={800}>
          Select an element to edit its properties
        </Typography>
      </Box>
    </Paper>
  );
};

export default RightBar;
