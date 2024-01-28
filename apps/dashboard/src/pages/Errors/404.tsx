import { keyframes, Stack, styled, Typography } from "@mui/material";
import { FunctionComponent } from "react";

const Container = styled("main")(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const NotFoundView: FunctionComponent = () => {
  return (
    <Container>
      <Stack spacing={4}>
        <Stack>
          <Typography variant="h4">Looks like you're lost</Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Typography variant="h5" color="text.secondary">
              page not found
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                animation: `${keyframes({
                  "0%": {
                    opacity: 1,
                  },
                  "50%": {
                    opacity: 0,
                  },
                })} 1s step-start infinite`,
              }}
            >
              _
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 400,
          }}
        >
          The page you are looking for does not exist. You may have mistyped the
          address or the page may have moved.
        </Typography>
      </Stack>
    </Container>
  );
};

export default NotFoundView;
