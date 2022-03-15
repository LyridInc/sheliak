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
    getTwitterReqToken,
    getTwitterAccToken,
    socialLogin,
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

    // console.log(password1);
    // console.log(password2);

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
function getTwitterReqToken() {
    // Different flow for twitter
    const twitterReqQuery =
    `mutation socialAuthTwitterReq {
        socialAuthTwitterReq {
            authenticateUrl,
            requestOauthToken,
            requestOauthSecret,
        }
    }`;
    try {
        fetchWrapper.post(`${process.env.SHELIAK_URL}/graphql`, {
            query: twitterReqQuery, variables: {}
            }).then(data => {
                window.location.href = data.data.socialAuthTwitterReq.authenticateUrl;
                // console.log(data.data.socialAuthTwitterReq);
            });
    } catch (error) {
        console.log(error);
    }
}

function getTwitterAccToken(requestToken, verifier) {
    const twitterAccQuery =
    `mutation socialAuthTwitter($requestToken: String!, $verifier: String!) {
        socialAuthTwitter(requestToken: $requestToken, verifier: $verifier) {
            accessToken,
            accessTokenSecret,
        }
    }`;
    try {
        return fetchWrapper.post(`${process.env.SHELIAK_URL}/graphql`, 
        { 
            query: twitterAccQuery, 
            variables: {
                requestToken: requestToken,
                verifier: verifier
            }
        }).then(data => {
            if (!data.data) throw new Error('Error getting access token');
            if (!data.data.socialAuthTwitter) throw new Error('Error getting access token');
            if (!('accessToken' in data.data.socialAuthTwitter) || !('accessTokenSecret') in data.data.socialAuthTwitter) 
                throw new Error('Error getting access token');
            return socialLogin('twitter', data.data.socialAuthTwitter.accessToken, data.data.socialAuthTwitter.accessTokenSecret).then(
                data => { return data }
            ).catch(error => { throw error; });
        });
    } catch (error) {
        console.log(error);
    }
}

function socialLogin(provider, accessToken = null, accessTokenSecret = null) {
    const query = 
    `mutation socialAuth($accessToken: String!, $provider: String!) {
        socialAuth(
            accessToken: $accessToken,
            provider: $provider,
        ) {
            token,
            refreshToken
        }
    }`;
    let providerName;
    if (provider === 'google') providerName = 'google-oauth2';
    else providerName = provider;

    const variables = {
        accessToken: `${accessToken}&${accessTokenSecret}`,
        provider: providerName,
    };
    try {
        return fetchWrapper.post(`${process.env.SHELIAK_URL}/graphql`, {query: query, variables: variables})
        .then(data => {
            if (data.errors) {
                if (data.errors[0].message === "NOT_REGISTERED")
                    throw new Error('User email not yet registered');
                // Something went wrong with the backend
                throw new Error('Something went wrong with the backend');
            }
            userSubject.next(data);
            localStorage.setItem('user', data.data.socialAuth.token);
            return data;
        });
    } catch (error) {
        console.log(error);
    }
}