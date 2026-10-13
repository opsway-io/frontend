import { keyframes } from "@emotion/react";
import { Box, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";

const blink = keyframes({
  "0%": {
    opacity: 1,
  },
  "50%": {
    opacity: 0,
  },
});

const NotFoundPage: FunctionComponent = () => {
  return (
    <Box component="main" sx={{ width: "100%", textAlign: "center" }}>
      <Stack spacing={3} alignItems="center">
        <Stack spacing={0.5} alignItems="center">
          <Typography level="h3">Looks like you're lost</Typography>
          <Typography
            level="title-lg"
            textColor="text.secondary"
            sx={{ fontFamily: "code" }}
          >
            page not found
            <Box
              component="span"
              sx={{ animation: `${blink} 1s step-start infinite`, ml: 0.5 }}
            >
              _
            </Box>
          </Typography>
        </Stack>

        <Typography
          level="body-md"
          textColor="text.secondary"
          sx={{ maxWidth: 400 }}
        >
          The page you are looking for does not exist. You may have mistyped the
          address or the page may have moved.
        </Typography>
      </Stack>
    </Box>
  );
};

export default NotFoundPage;
