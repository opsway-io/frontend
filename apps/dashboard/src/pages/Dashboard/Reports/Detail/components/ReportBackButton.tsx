import { Button } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const ReportBackButton: FunctionComponent = () => (
  <Button
    component={Link}
    to="/reports"
    variant="plain"
    color="neutral"
    startDecorator={<IoChevronBack />}
  >
    Back
  </Button>
);

export default ReportBackButton;
