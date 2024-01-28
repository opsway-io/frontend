import { FunctionComponent, useState } from "react";
import { Stack } from "@mui/material";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { LoadingButton } from "@mui/lab";
import env from "../../../env";

const SocialLoginForm: FunctionComponent = () => {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  return (
    <form>
      <Stack spacing={2}>
        <LoadingButton
          variant="outlined"
          startIcon={<BsGithub />}
          component="a"
          href={`${env.API_BASE_URL}/v1/auth/github`}
          onClick={() => setGithubLoading(true)}
          loading={githubLoading}
        >
          GitHub
        </LoadingButton>

        <LoadingButton
          variant="outlined"
          startIcon={<FcGoogle />}
          component="a"
          href={`${env.API_BASE_URL}/v1/auth/google`}
          onClick={() => setGoogleLoading(true)}
          loading={googleLoading}
        >
          Google
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default SocialLoginForm;
