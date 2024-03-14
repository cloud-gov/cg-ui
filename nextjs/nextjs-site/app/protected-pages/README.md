# Protected pages with iron session demo

Code adapted from [the app-router-client-component-router-handler-swr](https://github.com/vvo/iron-session/tree/main/examples/next/src/app/app-router-client-component-route-handler-swr) example.

This demo saves a username to a local cookie (you can view it in your browser as `iron-example-app-router-swr`), then demonstrates three different methods of checking if a user is logged in:

- client component
- via middleware
- server component

I do not understand all of the moving pieces well just yet.

## A couple notes on changes

I changed the directory name to something a little more straightforward and also converted `.ts` and `.tsx` to `.js` and `.jsx`. I also removed a couple components and styling that felt unnecessary to copy over for our purposes.

