import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import { useSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { postNameAvailable, postTeam } from "../../../api/endpoints/teams";
import useAuthenticationStore from "../../../hooks/authentication.store";
import TermsNotice from "../components/TermsNotice";

interface TeamRegistrationFormData {
  name: string;
  displayName: string;
}

/** react-hook-form validator: true when the slug is long enough and free. */
const isTeamNameAvailable = async (name: string) => {
  if (name.length < 3) {
    return false;
  }

  const response = await postNameAvailable(name);
  return response.available;
};

const TeamRegisterForm: FunctionComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentTeamId = useAuthenticationStore(
    (state) => state.setCurrentTeamID,
  );
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { isValid, errors },
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
    } catch {
      enqueueSnackbar("Failed to create team", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <FormControl error={!!errors.name} disabled={loading}>
        <FormLabel>Team slug</FormLabel>
        <Input
          placeholder="my-team"
          slotProps={{
            input: register("name", {
              required: true,
              minLength: 3,
              maxLength: 50,
              pattern: /^[a-z0-9-]+$/,
              validate: isTeamNameAvailable,
            }),
          }}
        />
        <FormHelperText>
          {errors.name?.type === "validate"
            ? "This slug is already taken."
            : "Used to uniquely identify your team. Lowercase letters, numbers and dashes, 3–50 characters."}
        </FormHelperText>
      </FormControl>

      <FormControl error={!!errors.displayName} disabled={loading}>
        <FormLabel>Display name</FormLabel>
        <Input
          placeholder="My Team"
          slotProps={{
            input: register("displayName", {
              required: true,
              minLength: 3,
              maxLength: 50,
            }),
          }}
        />
        <FormHelperText>
          Shown to users when they interact with your team. 3–50 characters.
        </FormHelperText>
      </FormControl>

      <TermsNotice />

      <Button
        size="md"
        fullWidth
        disabled={!isValid || loading}
        loading={loading}
        onClick={() => onSubmit(getValues())}
      >
        Create team
      </Button>

      <Button
        size="md"
        variant="outlined"
        color="neutral"
        fullWidth
        component={NavLink}
        to="/login/team/select"
        disabled={loading}
      >
        Go to team selection
      </Button>
    </Stack>
  );
};

export default TeamRegisterForm;
