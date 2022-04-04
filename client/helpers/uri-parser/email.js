
export function handleMailUri(href) {
    let url_truncate = href.split("%2F");
    let final_token = false;
    if(url_truncate[2] != null)
        final_token = url_truncate[2].replace("%3A", ":").replace("%3A", ":");
    return final_token;
}