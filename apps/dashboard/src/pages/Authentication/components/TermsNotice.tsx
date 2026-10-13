import { Link, Typography } from "@mui/joy";
import { FunctionComponent } from "react";

/** "By clicking the button below…" consent line shown under sign-up forms. */
const TermsNotice: FunctionComponent = () => (
  <Typography
    level="body-xs"
    textColor="text.tertiary"
    sx={{ textAlign: "center", px: 2 }}
  >
    By clicking the button below, you agree to our{" "}
    <Link href="#" fontWeight="md" textColor="text.secondary">
      Terms of Service
    </Link>
    {" and "}
    <Link href="#" fontWeight="md" textColor="text.secondary">
      Privacy Policy
    </Link>
    .
  </Typography>
);

export default TermsNotice;
