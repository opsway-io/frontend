import { LoadingButton } from "@mui/lab";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { postNameAvailable, postTeam } from "../../../api/endpoints/teams";
import useAuthenticationStore from "../../../hooks/authentication.store";

interface TeamRegistrationFormData {
  name: string;
  displayName: string;
}

const TeamRegistrationForm: FunctionComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentTeamId = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { isValid },
    getValues,
  } = useForm<TeamRegistrationFormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      displayName: "",
    },
  });

  const onSubmit = async (data: TeamRegistrationFormData) => {
    try {
      setLoading(true);

      const team = await postTeam(data.name, data.displayName);

      setCurrentTeamId(team.id);

      navigate("/team");
    } catch (error) {
      enqueueSnackbar("Failed to create team", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkNameAvailable = async (name: string) => {
    if (name.length < 3) {
      return false;
    }

    const response = await postNameAvailable(name);
    return response.available;
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Team slug"
        {...register("name", {
          required: true,
          minLength: 3,
          maxLength: 50,
          pattern: /^[a-z0-9-]+$/,
          validate: checkNameAvailable,
        })}
        disabled={loading}
      />

      <Typography variant="caption" color="text.secondary">
        The team slug is used to uniquely identify your team. It can only
        contain lowercase letters, numbers, dashes and must be between 3 and 50
        characters long.
      </Typography>

      <TextField
        label="Display name for team"
        {...register("displayName", {
          required: true,
          minLength: 3,
          maxLength: 50,
        })}
        disabled={loading}
      />

      <Typography variant="caption" color="text.secondary">
        The display name is shown to users when they are interacting with your
        team. It can be anything you want it to be. As long as it's between 3
        and 50 characters long.
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{
          padding: 2,
        }}
      >
        By clicking the button below, you agree to our{" "}
        <Link
          href="#"
          sx={{
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Terms of Service
        </Link>
        {" and "}
        <Link
          href="#"
          sx={{
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Privacy Policy
        </Link>
        .
      </Typography>

      <LoadingButton
        variant="contained"
        color="success"
        size="large"
        disabled={!isValid || loading}
        loading={loading}
        onClick={() => onSubmit(getValues())}
      >
        Create team
      </LoadingButton>

      <Button
        variant="outlined"
        component={NavLink}
        to="/login/team/select"
        size="large"
        disabled={loading}
      >
        Go to team selection
      </Button>
    </Stack>
  );
};

export default TeamRegistrationForm;
