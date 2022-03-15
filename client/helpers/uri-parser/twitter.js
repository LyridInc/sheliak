import { userService } from "services";

export function handleTwitterUri(href, router) {
    let url_truncate = href.split("%3F")[1];
    let param_list = url_truncate.split('%3D');
    let req_token = param_list[1].split('%26')[0];
    let verifier = param_list[2];
    return userService.getTwitterAccToken(req_token, verifier)
    .then(result => { 
        console.log(result);
        if (result) router.push('/');
    }).catch(error => {
        //console.log(error);
        throw error;
    });
}