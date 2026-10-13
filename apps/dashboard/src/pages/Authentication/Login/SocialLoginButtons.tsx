import { FunctionComponent, useState } from "react";
import { Box, Button } from "@mui/joy";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import env from "../../../env";

const SocialLoginButtons: FunctionComponent = () => {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1.5,
      }}
    >
      <Button
        variant="outlined"
        color="neutral"
        size="md"
        startDecorator={<BsGithub />}
        component="a"
        href={`${env.API_BASE_URL}/v1/auth/github`}
        onClick={() => setGithubLoading(true)}
        loading={githubLoading}
      >
        GitHub
      </Button>

      <Button
        variant="outlined"
        color="neutral"
        size="md"
        startDecorator={<FcGoogle />}
        component="a"
        href={`${env.API_BASE_URL}/v1/auth/google`}
        onClick={() => setGoogleLoading(true)}
        loading={googleLoading}
      >
        Google
      </Button>
    </Box>
  );
};

export default SocialLoginButtons;
