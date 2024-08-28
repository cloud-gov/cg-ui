# USWDS

Our team keeps custom CSS/SASS to a minimum and takes a [utilities-first](https://designsystem.digital.gov/utilities/) approach.

When adding styles, work through this order:
1. Can [USWDS inline utility classes](https://designsystem.digital.gov/utilities/) be used?
  - Ex: `.border-left-2`
1. If not, check if [USWDS theme settings](https://designsystem.digital.gov/documentation/settings/) would be appropriate to change:
  - Ex: `$theme-banner-background-color: 'blue-warm-80'`
1. If not, can you create a custom utility class and / or use [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/)?
  - Ex: `background-color: color('mint-cool-60v')`
  - Ex: `.minw-305 { min-width: calc(units(3) + units(.5)); }`
1. If not, add custom CSS/SASS

The global SASS entrypoint is [assets/stylesheets/styles.scss](../../src/assets/stylesheets/styles.scss). USWDS theme settings are configured at the top of that file.

## Compiling

By default, NextJS has a way of compiling SASS, as well as Autoprefixer. This eliminates the need to use tools like uswds-compile or Gulp.

SASS compilation configs can be found in [next.config.js](../../next.config.js)

In order to control when we upgrade USWDS, the `@uswds/uswds` npm package has been installed using the `--save-exact` flag.

## Images

Nextjs has a top-level [public folder](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets) where static assets can be stored. Assets stored here can be used as `src` urls by removing the `/public` prefix.

```
// Folder: /public/img/uswds/icon.png

<img src="/img/uswds/icon.png" />

// Folder: /public/js/uswds/uswds.min.js

<Script src="/js/uswds/uswds.min.js" />
```

## JavaScript

Because interactivity will be handled through React, USWDS JavaScript is not used.

## Updating USWDS

After a USWDS npm package update, copy the following files from `node_modules/@uswds/uswds/dist/` to `/public`:

```
/public
  /img
    /uswds
      - [any images from uswds that you need]
```

For ease of updating, use the same file names. (This process could be converted to a script down the road.)
