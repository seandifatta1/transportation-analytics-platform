import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useCookies} from "react-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ThisWeek} from "../views/ThisWeek";
import {useEffect, useState} from "react";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export function Login() {

    const [signUp, setSignUp] = useState(false)

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const navigate = useNavigate()

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/`, {}, {
                withCredentials: true,
                headers: {
                    Cookie: document.cookie
                }
            }
        ).then(r => {

                if (r.status === 200) {
                    navigate("/Dashboard/ThisWeek")
                } else {
                    console.info("Nav issue")
                }

            }
        ).catch(e => {
            console.error(e)
        })
    }, []);

    const handleSubmit = (event) => {

        event.preventDefault();
        const data = new FormData(event.currentTarget);

        axios.post(`${process.env.REACT_APP_BASE_URL}/`, {
            email: data.get("email"),
            password: data.get("password")
        }, {withCredentials: true}).then(r => {

                if (r.status === 200) {
                    navigate("/Dashboard/ThisWeek")
                } else {
                    // erfserfserfsefrs
                    // navigate("/Dashboard/ThisWeek")
                }

            }
        ).catch(e => {
            console.error(e)
        })
    };

    return (
        <div data-cy="login">

            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                {signUp ? "Create Account" : "Sign In"}

                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    {/*<Link href="" variant="body2" onClick={() => { setSignUp(true)}}>*/}
                                    <Link href="/SignUp" variant="body2" onClick={() => {
                                        console.log("Sign up clicked")
                                    }}>
                                        {signUp ? "" : "Don't have an account? Sign Up"}
                                    </Link>
                                    {/*<Button> ERSFSR </Button>*/}
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    {/*<Copyright sx={{mt: 8, mb: 4}}/>*/}
                </Container>
            </ThemeProvider>
        </div>
    );
}

export function SignUp() {

    const [signUp, setSignUp] = useState(false)

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const navigate = useNavigate()


    const handleSubmit = (event) => {

        event.preventDefault();

        const data = new FormData(event.currentTarget);

        axios.post(`${process.env.REACT_APP_BASE_URL}/users`, {
            email: data.get("email"),
            password: data.get("password")
        }, {withCredentials: true}).then(r => {

                if (r.status === 200) {
                    navigate("/Dashboard/ThisWeek")
                } else {
                    // slightly change component to response to invalid, or creat new
                }

            }
        ).catch(e => {

        })

    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Create Account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            color="secondary"
                        >
                            Create Account

                        </Button>
                        {/*<Grid container>*/}
                        {/*    <Grid item xs>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            Forgot password?*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item>*/}
                        {/*        /!*<Link href="" variant="body2" onClick={() => { setSignUp(true)}}>*!/*/}
                        {/*        <Link href="#" variant="body2" onClick={() => { console.log("Sign up clicked")}}>*/}
                        {/*            {signUp ? "" : "Don't have an account? Sign Up"}*/}
                        {/*        </Link>*/}
                        {/*        /!*<Button> ERSFSR </Button>*!/*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </Box>
                </Box>
                {/*<Copyright sx={{mt: 8, mb: 4}}/>*/}
            </Container>
        </ThemeProvider>
    );
}