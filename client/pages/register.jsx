import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService } from 'services';
import Link from 'next/link';

export default Register;

function Register() {
    const router = useRouter();
    // this state is used to show errors in registration
    const [registerError, setRegisterError] = useState(null);
    // email sent
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        // redirect to home if already logged in
        if (userService.userValue && typeof(userService.userValue) == 'string') {
            router.push('/');
        }
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ email, firstName, lastName, password }) {        
        return userService.register(email, firstName, lastName, password)
            .then(() => {
                // get return url from query parameters or default to '/'
                // const returnUrl = router.query.returnUrl || '/';
                // router.push(returnUrl);
                
                // by this point email has been sent
                setEmailSent(true);
            })
            .catch(error => {
                // error.message is a json object containing the errors
                if (error.message == 'backend') setRegisterError({'backend': 
                    [{code: 'Backend Problem', message: 'Something went wrong with the backend'}]});
                else setRegisterError(JSON.parse(error.message));
            });
    }

    // onClick function for button on error page
    function onRegisterClick() {
        // navigate back to login page
        setRegisterError(null);
    }

    // the element to display for when error
    var errorElement = 
    <div className='col-md-6 offset-md-3 mt-5'>
        <div className='card'>
            <h4 className="card-header">Invalid Registration</h4>
            <div className='card-body'>
                <h6>Error(s):</h6>
                <ul>
                    {/* Show Errors */
                    registerError && Object.values(registerError).map(value => 
                    <li key={value[0].code}><h6>{value[0].message}</h6></li>
                    )}
                </ul>
                <button onClick={onRegisterClick} className='btn btn-primary'>
                    Try again
                </button>
            </div>
        </div>
    </div>;

    // onClick function for button on email sent page
    function onEmailClick() {
        // go back to login
        router.push('/login');
    }

    // the email sent screen
    const emailElement =
    <div className='col-md-6 offset-md-3 mt-5'>
        <div className='card'>
            <h4 className="card-header">Email Sent</h4>
            <div className='card-body'>
                <h6>Check your email and verify your account</h6>
                <button onClick={onEmailClick} className='btn btn-primary'>
                    Go back to login page
                </button>
            </div>
        </div>
    </div>;

    // the actual registration form
    const registerForm =
    <div>
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">Sheliak Authentification Register Example</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="firstName" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Register
                        </button>
                    </form>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <button className="btn btn-primary">
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <a className='link-color' style={{ textDecoration: 'none' }}>
                                Cancel
                            </a>
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    </div>;

    return(emailSent ? emailElement : registerError ? errorElement : registerForm);
}
