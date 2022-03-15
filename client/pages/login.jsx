import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Link from 'next/link';
import SocialButton from 'components/Buttons/SocialButton';
import { userService } from "services";
import { handleTwitterUri, handleMailUri } from 'helpers/uri-parser';

export default Login;

function Login() {
    const router = useRouter();
    const [loginError, setLoginError] = useState(false);
    const [socialLoginError, setSocialLoginError] = useState(null);

    // State doesn't work: [Error in _app.js] too many state rendered, currently using a bool flag
    // const [passwordResetToken, setpasswordResetToken] = useState(false);
    let token_flag = false;
    // flag to check if it is a password reset or registration
    // reset -> activate = false
    // registration -> activate = true
    let activate = false;
    // flag to check if we are dealing with a twitter callback url
    let twitter = false;
    
    // obtain token from password reset - Jank-Style * Encode/Decode doesn't work *
    // will try to make into api
    try{
        activate = window.location.href.includes('activate');
        twitter = window.location.href.includes('twitter-auth');
        if (twitter) {
            handleTwitterUri(window.location.href, router).catch(error => {
                router.replace(`/login?social-error=${error.message}`, undefined, {shallow: true});
            });
        } else {
            let final_token = handleMailUri(window.location.href);
            if (final_token) {
                localStorage.setItem('reset_token', String(final_token));
                token_flag = true;
            } else localStorage.removeItem('reset_token');
        }
    }
    catch(e){
        console.error(e);
    }
    
    useEffect(() => {
        // redirect to home if already logged in
        if (userService.userValue && typeof(userService.userValue) == 'string') {
            //console.log(userService.userValue);
            router.push('/');
        }
        // redirect if password reset token is detected or login if we are at forgot password
        else if(token_flag == true) {
            if (activate) router.push('/login');
            else if (twitterAcc) router.push('/');
            else router.push('/reset');
        }
        // checks if social auth returns an error
        if (window.location.href.includes('social-error')) 
            setSocialLoginError(window.location.href.split('=')[1]);
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ email, password }) {
        return userService.login(email, password)
            .then(() => {
                // get return url from query parameters or default to '/'
                router.push('/');
            })
            .catch(error => {
                // navigate to error page
                setLoginError(true);
            });
    }

    // onClick function for button on error page
    function onClick() {
        // navigate back to login page
        setLoginError(false);
        setSocialLoginError(null);
    }

    // the element to display for when error with login
    const errorElement = 
    <div className='col-md-6 offset-md-3 mt-5'>
        <div className='card'>
            <h4 className="card-header">Invalid Login</h4>
            <div className='card-body'>
                <button onClick={onClick} className='btn btn-primary'>
                    Try again
                </button>
            </div>
        </div>
    </div>;

    // the element to display for when social login error
    const socialErrorElement =
    <div className='col-md-6 offset-md-3 mt-5'>
        <div className='card'>
            <h4 className="card-header">Invalid Login</h4>
            <div className='card-body'>
                <h6>{socialLoginError && socialLoginError.replaceAll('%20', ' ')}</h6>
                <button onClick={onClick} className='btn btn-primary'>
                    Try again
                </button>
            </div>
        </div>
    </div>;

    // the actual login form
    const loginForm =
    <div className="col-md-6 offset-md-3 mt-5">
        <div className="card">
            <h4 className="card-header">Sheliak Authentification Login Example</h4>
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <button disabled={formState.isSubmitting} className="btn btn-primary">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Login
                    </button>
                    {errors.apiError &&
                        <div className="alert alert-danger mt-3 mb-0">{errors.apiError?.message}</div>
                    }
                </form>
            </div>
        </div>
        <div className="card">
            <div className='card-body'>
                {/* <SocialButton
                    btn="fb"
                    provider='facebook'
                    version="v9.0"
                    appId={process.env.FACEBOOK_APP_ID}
                    // onLoginSuccess={handleSocialLogin}
                    // onLoginFailure={handleSocialLoginFailure}
                />
                <SocialButton
                    btn="google"
                    provider='google'
                    appId={process.env.GOOGLE_APP_ID}
                    // onLoginSuccess={handleSocialLogin}
                    // onLoginFailure={handleSocialLoginFailure}
                />
                <SocialButton
                    btn="github"
                    provider='github'
                    appId={process.env.GITHUB_APP_ID}
                    // onLoginSuccess={handleSocialLogin}
                    // onLoginFailure={handleSocialLoginFailure}
                    // key={'git_' + key.toString()}
                    // gatekeeper={sheliakcallback}
                    // redirect={githubcallback}
                /> */}
                <SocialButton
                    btn="twitter"
                />
            </div>
        </div>
        <div className="card">
            <div className="card-body">
                <button className="btn btn-primary">
                    <Link href="/register" style={{ textDecoration: 'none' }}>
                        <a className='link-color' style={{ textDecoration: 'none' }}>
                            Register
                        </a>
                    </Link>
                </button>
                <button className="btn btn-primary" style={{ margin: '5px' }}>
                    <Link href="/forgotpw" style={{ textDecoration: 'none' }}>
                        <a className='link-color' style={{ textDecoration: 'none' }}>
                            Forgot Password
                        </a>
                    </Link>
                </button>
            </div>                
        </div>
    </div>;

    return (socialLoginError ? socialErrorElement : loginError ? errorElement : loginForm);
}
