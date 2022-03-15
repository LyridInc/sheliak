import React from 'react';
import SocialLogin from 'react-social-login';
import { FacebookLoginButton, GithubLoginButton, GoogleLoginButton, TwitterLoginButton } from "react-social-login-buttons";
import { userService } from 'services';

const SocialButton = (props) => {
    const {children, triggerLogin, btn, ...rest} = props;

    function twitterLogin() {
        userService.getTwitterReqToken();
    }

    const renderButton = (btn) => {
        switch (btn) {
            case "fb":
                return <FacebookLoginButton onClick={triggerLogin} {...rest}>
                        {children}
                    </FacebookLoginButton>;
            case "github":
                return <GithubLoginButton onClick={triggerLogin} {...rest}>
                        {children}
                    </GithubLoginButton>;
            case "google":
                return <GoogleLoginButton onClick={triggerLogin} {...rest}>
                        {children}
                    </GoogleLoginButton>;
            case "twitter":
                return (
                    <TwitterLoginButton onClick={twitterLogin} {...rest}>
                        {children}
                    </TwitterLoginButton>
                )
            default:
                return(
                    <div></div>
                );

        }
    }

    return (
        renderButton(btn)
    );
}

export default SocialButton;
