import { Box, Button, Paper, Tab, Tabs } from "@mui/material";
import { FunctionComponent } from "react";
import {
  FaArrowLeft,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
} from "react-icons/fa";
import useScreenMode from "../stores/screenMode";

interface TopBarProps {
  idk?: string;
}

const TopBar: FunctionComponent<TopBarProps> = () => {
  const screenStore = useScreenMode();

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "row",

        "& > *": {
          flex: 1,
        },
      }}
    >
      <Box>
        <Button
          sx={{
            margin: 2,
            marginTop: 1,
            marginBottom: 1,
          }}
          startIcon={<FaArrowLeft />}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={screenStore.screenMode}
          onChange={(_, v) => screenStore.setScreenMode(v)}
        >
          <Tab value="desktop" label={<FaDesktop />} />
          <Tab value="tablet" label={<FaTabletAlt />} />
          <Tab value="mobile" label={<FaMobileAlt />} />
        </Tabs>
      </Box>

      <Box />
    </Paper>
  );
};

export default TopBar;
