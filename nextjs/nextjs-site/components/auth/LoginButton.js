import crypto from "crypto";

export function LoginButton() {
    const randomString = crypto.randomBytes(8).toString("hex");
    let loginUrl = new URL(process.env.UAA_AUTH_URL);
    let params = new URLSearchParams(loginUrl.search);
    params.set("client_id", process.env.OAUTH_CLIENT_ID);
    params.set("state", randomString);
    params.set("response_type", "code");

    return(
        <>
            <a href={loginUrl + "?" + params.toString()}>Log In</a>
        </>
    );
};
