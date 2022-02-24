import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;

const userSubject = new BehaviorSubject(process.browser && localStorage.getItem('user'));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    register,
    forgotpw,
    resetpassword,
    logout,
    getAll,
    // Social Logins
    twitterLogin,
};

function login(email, password) {

    // create data to connect with Sheliak
    const TOKEN_AUTH =
        `mutation tokenAuth($email:String!, $password:String!) {
            tokenAuth(email: $email, password: $password) {
                success,
                errors,
                token,
                refreshToken,
                user {
                    id,
                    email,
                    verified,
                }
            }
        }`
    const VARIABLES = {
        email: email,
        password: password
    }

    // connect to Sheliak
    
    return fetchWrapper.post( `${process.env.SHELIAK_URL}/graphql`, {query: TOKEN_AUTH, variables: VARIABLES})
        .then(data => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(data);
            localStorage.setItem('user', data.data.tokenAuth.token);
            
            return data;
        });
}

function register(email, firstName, lastName, password){
    
    // create data to connect with Sheliak
    const NEWREG =     
    `mutation register(
        $email: String!,
        $password: String!,
        $middleName: String,
        $lastName: String,
        $mobileNumber: String,
        $firstName: String!
    ) {
        register(
            email: $email,
            middleName: $middleName,
            lastName: $lastName,
            mobileNumber: $mobileNumber,
            firstName: $firstName,
            password1: $password,
            password2: $password,
        ) {
            success,
            errors,
            token,
            refreshToken,
        }
    }`
    
    const NEWACC = {
        email: email,
        firstName: firstName,
        middleName: "",
        lastName: lastName,
        mobileNumber: "",
        password: password
    };
    
    
    try{
        return fetchWrapper.post(`${process.env.SHELIAK_URL}/graphql`, {query: NEWREG, variables: NEWACC})
        .then(data => {

            // Once successful, logs in.
            //userSubject.next(data);
            if (data.errors) {
                // Something went wrong with the backend
                throw new Error('backend');
            }
            if (!data.data.register.success) {
                // Throw errors when there is an error
                // Stringifies the JSON object so that error messages can be relayed
                throw new Error(JSON.stringify(data.data.register.errors));
            }
            return data;
        });
    }
    catch (error){
        console.log(error);
    }
    
}

function forgotpw(email){
    // create data to connect with Sheliak
    const FORGOTPW = 
    `mutation sendPasswordResetEmail($email:String!) {
        sendPasswordResetEmail(email: $email) {
            success,
            errors
        }
    }`
    const PW_EMAIL = {
        email: email
    };
    
    try{
        return fetchWrapper.post( `${process.env.SHELIAK_URL}/graphql`, {query: FORGOTPW, variables: PW_EMAIL})
        .then(data => {

            // Once successful, logs in.
            // Will add error for already made accounts.
            // userSubject.next(data);
            console.log(data);
            
            return data;
        });
    }
    catch (error){
        console.log(error);
    }
}

function resetpassword(token, password1, password2){
    // create data to connect with Sheliak
    const PWRESET = 
    `mutation passwordReset($token:String!, $newPassword1:String!, $newPassword2:String!) {
        passwordReset(token: $token, newPassword1: $newPassword1, newPassword2: $newPassword2) {
            success,
            errors
        }
    }`

    console.log(password1);
    console.log(password2);

    const PWDUPLE = {
        token: token,
        newPassword1: password1,
        newPassword2: password2
    };
    
    try{
        return fetchWrapper.post( `${process.env.SHELIAK_URL}/graphql`, {query: PWRESET, variables: PWDUPLE})
        .then(data => {

            // Once successful, logs in.
            // Will add error for already made accounts.
            // userSubject.next(data);
            console.log(data);
            
            return data;
        });
    }
    catch (error){
        console.log(error);
    }
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

// Social Logins
function twitterLogin(accessToken) {
    const query = 
    `mutation socialAuth($accessToken: String!, $provider: String!) {
        socialAuth(
            accessToken: $accessToken,
            provider: $provider,
        )
    }`;
    const variables = {
        accessToken: accessToken,
        provider: 'twitter',
    };
    try {
        return fetchWrapper.post(`${process.env.SHELIAK_URL}/graphql`, {query: query, variables: variables})
    } catch (error) {
        console.log(error);
    }
}