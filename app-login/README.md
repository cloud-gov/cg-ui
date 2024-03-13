# App login attempts

The subdirectories here contain applications that are supposed to authenticate with a local UAA instance. Unfortunately, I have not entirely been successful.

- :white_check_mark: express-manual
- :white_check_mark: nextauth
- :white_check_mark: passportjs

## express-manual

This example was adapted from the [cg-demos](https://github.com/cloud-gov/cg-demos/tree/master/cg-identity) repository. It uses an express server.

### Run it

```bash
npm install
npm start
```

Open `localhost:8000`

### Status

Currently functional but lacking session implementation of any kind.

Can be deployed to production Cloud to connect to openid via a service broker (note: this means it only authenticates a user, it does not grant them CF API access).

## nextauth

This examples comes from the [nextauthjs example application](https://github.com/nextauthjs/next-auth-example). It uses the "pages" router and nextjs. I did not configure a database.

### Run it

Copy `.env.local.example` to `.env.local` and add an auth secret.

```bash
npm install
npm run dev
```

Open `localhost:3000`

### Status

Functional but not well understood.

### Complications

I was unable to use the callback URL specified in both this repo's readme and the nextauth documention: `/api/auth/callback/[provider]`, for some reason. Instead, the application / nextauth appeared to be waiting on `/auth/callback/uaa` so I configured the `uaa.yml` file to use that callback.

I was also surprised that the nextauth custom provider configuration was unable to discover the endpoints using the `.well-known/openid-configuration` URL. I can visit the UAA server at that path and see all of the URLs such as the token and user info paths, but I didn't attempt to debug it, I just manually provided them to the configuration as well.

I believe due to the inability to discover information via `.well-known`, I had to add a bunch of information manually about the issuer and JWT alg used by UAA.

## Passportjs

This example comes from a [passportjs example app for auth0](https://github.com/passport/todos-express-auth0/tree/main). It uses an express server.

### Run it

Copy `.env.example` to `.env`

```bash
npm install
npm start
```

Open `localhost:3000`

Note: because it begins on port 3000 I hooked it up with the `nextjs_client` UAA client id and secret.

### Status

Working but just barely! Includes sessions managed with database.

### Complications

I opted to settle for getting the OpenIdConnect strategy running, rather than straight OAuth2 after a couple attempts that didn't get me anywhere.

Initially, the example repo got caught in loop on the `/auth/callback/uaa` path in `routes/auth.js` because `failureRedirect` was sending it to the `/login` path which said "you logged in already, here's the callback, it failed" etc.  I created a `/failure` path to display a message if something went wrong.

I also find the example implementation of the callback to be fairly fragile -- there aren't a lot of good ways to debug it without completely redoing it (see the commented out chunk above).

Another complication is that passportjs has VERY thin documentation for the `passport.authenticate` function. However, the source code itself is much better documented:

- [Middleware docs (sparse)](https://www.passportjs.org/concepts/authentication/middleware/)
- [PassportJS Source code](https://github.com/jaredhanson/passport/blob/master/lib/authenticator.js#L135)

You may also wish to refer to the "strategy" specific repository to track down errors.

- [Passport OpenIdConnect source code](https://github.com/jaredhanson/passport-openidconnect/blob/master/lib/strategy.js#L27)

At the moment, the app also doesn't log out correctly but I've decided that doesn't bother me for now.
