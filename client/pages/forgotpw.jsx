import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService } from 'services';
import Link from 'next/link';

export default ForgotPw;

function ForgotPw() {
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (userService.userValue && typeof(userService.userValue) == 'string') {
            router.push('/');
        }
    }, []);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ email }) {      
        return userService.forgotpw(email)
            .then(() => {
                // get return url from query parameters or default to '/'
                const returnUrl = router.query.returnUrl || '/';
                router.push(returnUrl);
            })
            .catch(error => {
                setError('apiError', { message: error });
            });
    }

    return(
        <div>
            <div className="col-md-6 offset-md-3 mt-5">
                <div className="card">
                    <h4 className="card-header">Forgot Password?</h4>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label>Email</label>
                                <input name="firstName" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </div>
                            <button disabled={formState.isSubmitting} className="btn btn-primary">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Forgot Password
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
        </div>
    );
}
