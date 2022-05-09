import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Button,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthentication from "../../stores/authentication";

interface LoginFormProps {}

const LoginForm: FunctionComponent<LoginFormProps> = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const authentication = useAuthentication();
    const navigate = useNavigate();

    const handleLogin = async () => {
        authentication.logIn("admin", "admin");
        navigate("/monitors", {
            replace: true,
        });
    };

    return (
        <form
            style={{
                width: "300px",
            }}
        >
            <Stack spacing={2}>
                <FormControl disabled={loading}>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <OutlinedInput id="username" type={"text"} autoFocus required label="Username" />
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

                <Button color="primary" variant="contained" size="large" type="submit" onClick={() => handleLogin()}>
                    Login
                </Button>
            </Stack>
        </form>
    );
};

export default LoginForm;
