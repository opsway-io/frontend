import { Box, Button, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const AccessRestrictedPage: FunctionComponent = () => {
  return (
    <Box component="main" sx={{ width: "100%", textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "lg",
            bgcolor: "neutral.softBg",
            color: "text.secondary",
          }}
        >
          <IoLockClosedOutline size={22} />
        </Box>

        <Typography level="h3">Restricted access</Typography>

        <Typography
          level="body-md"
          textColor="text.secondary"
          sx={{ maxWidth: 400 }}
        >
          You do not have permission to access this page, please contact your
          administrator.
        </Typography>

        <Button
          component={NavLink}
          to="/"
          variant="outlined"
          color="neutral"
          sx={{ mt: 1 }}
        >
          Take me home
        </Button>
      </Stack>
    </Box>
  );
};

export default AccessRestrictedPage;
