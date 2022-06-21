import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../../stores/authentication";
import useUser from "../../stores/user";

interface LoginFormProps {}

const LoginForm: FunctionComponent<LoginFormProps> = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const logIn = useAuthentication(state => state.logIn);
    const setUser = useUser(state => state.setUser);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        const { success, user } = await logIn("admin@opsway.io", "admin");
        setLoading(false);

        if (!success) {
            return;
        }

        setUser(user);

        navigate("/monitors", {
            replace: true,
        });
    };

    return (
        <form
            style={{
                width: "400px",
            }}
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}
        >
            <Stack spacing={2}>
                <FormControl disabled={loading}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput id="email" type={"text"} autoFocus required label="email" />
                </FormControl>

                <FormControl disabled={loading}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={(_) => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>

                <LoadingButton
                    color="primary"
                    variant="contained"
                    size="large"
                    type="submit"
                    onClick={() => handleLogin()}
                    loading={loading}
                >
                    Login
                </LoadingButton>
            </Stack>
        </form>
    );
};

export default LoginForm;
