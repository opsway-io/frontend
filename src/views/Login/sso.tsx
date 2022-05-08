import { GitHub, Google } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { FunctionComponent } from "react";

interface SSOLoginProps {}

const SSOLogin: FunctionComponent<SSOLoginProps> = () => {
    return (
        <Stack sx={{
            width: "300px",
        }} spacing={2}>
            <Button variant="outlined" size="large" startIcon={<GitHub />}>Login with GitHub</Button>
            <Button variant="outlined" size="large" startIcon={<Google />}>Login with Google</Button>
        </Stack>
    );
};

export default SSOLogin;
