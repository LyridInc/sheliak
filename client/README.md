# Sheliak Authentication Example

# File descriptions

## _app.js
1. This file contains the header and the bottom section which is rendered for all pages amongst '/login.js', '/register.js', '/forgotpw.js' files. 
2. Any further implementations of pages which requires the header and bottom section will require changes in this javascript file. 
3. As of now, it adds Sheliak icon and bottom app description.

## next.config.js
1. Modules and configurations for localhostings. Might need to change for deployment. 
2. Also sets up secret key for server runtime environment.
3. Additional setup for svg modules needed to run logo on the top right of render inside _app.js

## register.jsx
1. Registration page. Once onsubmit is sent, it calls fetch-wrapper.js and accesses its register function. 
2. It then packages form data, packages it, then sends Sheliak's register api. Try/Catch implemented to see errors.
3. Also renders the mid section for this project and form collections.


## login.jsx
1. Login page. Once onsubmit is sent, it calls fetch-wrapper.js and accesses its login function.
2. It then packages form data, packages it, then sends Sheliak's login api. Try/Catch implemented to see errors.
3. Also renders the mid section for this project and form collections.

## forgotpw.jsx
1. Forgot Password page. Once onsubmit is sent, it calls fetch-wrapper.js and accesses its forgotpw function.
2. It then packages form data, packages it, then sends Sheliak's api. Try/Catch implemented to see errors.
3. Also renders the mid section for this project and form collections.
4. ```Further implementation needed```

## user.service.js
1. Many of the calls here access fetch-wrapper.js and uses its interface to make calls.
2. Listed: login, register, forgotpw, logout, getAll. All of these calls upon the methods inside the fetch-wrapper.js

## fetch-wrapper.js
1. Wrapper file for a list of multiple interfaces which allows redirection of calls.
2. Listed: _delete, put, post, get methods. The remaining methods can be implemented in future iterations.

## api-handler.js
1. Async method for processing methods.

## error-handler.js
1. Method to return errors.

# Possible future implementation

## Redirection
1. Current iterations will throw a react error when login is incorrect. Needed to redirect to an invalid login screen OR just return error login.
2. Possible files which will help with implementation. Possible modification to files: login.jsx under the onSubmit method.

## Registration page success||fail status page
1. When a user is able to register, a quick status update and redirection toward the main page is needed.
2. As of Feb, 8, 2022 - successful registration will just login into the main page.

## Forgot Password
1. Forgot password is hooked up. Needs further implementation of the forgotpw method inside user.service.js.
2. Success||fail status should be implemented.

## Dashboard
1. Future instructions...

```
Next.js 12 project - Sheliak Authentication Example

Code example modified from Next.js sample from Jason Watmore - available at https://jasonwatmore.com/post/2021/08/04/next-js-11-jwt-authentication-tutorial-with-example-app

Code example modified by Roderic Kong under Lyrid.Inc
```