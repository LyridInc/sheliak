import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService } from 'services';
import Link from 'next/link';

export default Reset;

function Reset() {
    const router = useRouter();
    // this state is used to show errors in registration
    const [passwordError, setPasswordError] = useState(null);
    
    // useEffect(() => {
    //     // redirect to home if already logged in
    //     if (userService.userValue && typeof(userService.userValue) == 'string') {
    //         router.push('/');
    //     }
    // }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        password1: Yup.string().required('Password is required')
            .min(8, "Password is too short - 8 characters minimum"),
        password2: Yup.string().oneOf([Yup.ref('password1'), null], "Password mismatch"),
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ password1, password2 }) {
        return userService.resetpassword(localStorage.getItem('reset_token'), password1, password2)
            .then(() => {
                // get return url from query parameters or default to '/'
                router.push('/login');
            })
            .catch(error => {
                // navigate to error page
                setPasswordError(true);
            });
    }

    // onClick function for button on error page
    function onClick() {
        // navigate back to login page
        setPasswordError(false);
    }

    // the element to display for when error
    const errorElement = 
    <div className='col-md-6 offset-md-3 mt-5'>
        <div className='card'>
            <h4 className="card-header">Password Resetted!</h4>
            <div className='card-body'>
                <button onClick={onClick} className='btn btn-primary'>
                    Back
                </button>
            </div>
        </div>
    </div>;

    // the actual reset form
    const resetForm =
    <div>
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">Sheliak Authentification Register Example</h4>
                <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input name="password1" type="password" {...register('password1')} className={`form-control ${errors.password1 ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password1?.message}</div>
                    </div>
                    <div className="form-group">
                        <label>Re-enter Password</label>
                        <input name="password2" type="password" {...register('password2')} className={`form-control ${errors.password2 ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password2?.message}</div>
                    </div>
                    <button disabled={formState.isSubmitting} className="btn btn-primary">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Reset
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
    return(passwordError ? errorElement : resetForm);
}
