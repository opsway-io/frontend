import { Button, keyframes, Stack, styled, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

const Container = styled("main")(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const AccessRestrictedView: FunctionComponent = () => {
  return (
    <Container>
      <Stack spacing={4}>
        <Typography variant="h4">Restricted access</Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: 400,
          }}
        >
          You do not have permission to access this page, please contact your
          administrator.
        </Typography>

        <Button component={NavLink} to="/" variant="outlined" color="secondary">
          Take me home
        </Button>
      </Stack>
    </Container>
  );
};

export default AccessRestrictedView;
