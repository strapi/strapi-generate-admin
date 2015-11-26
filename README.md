# Strapi built-in admin panel

## Customization

The admin panel is developed with Angular.js, using the John PAPA styleguide.
You can customize the admin from `./api/admin/public` in your generated application.

To build the admin panel:
- You need to install `bower` and `gulp` with `$ npm install gulp bower -g`.
- Run `$ npm install` in this directory.
- Run `$ gulp serve`.
- Visit [http://localhost:3002](http://localhost:3002) from your web browser.
- When you are ready to use your customized admin panel, run `$ gulp dist`.
  That will update the files in the following folder: `./api/admin/public/dist`.
- Visit [http://localhost:1337/admin/](http://localhost:1337/admin/).

If you change the default port (1337) of your server, you will have to update
`./api/admin/public/config/config.json` and then run `$ npm install && gulp dist`
in `./api/admin/public`.

**NOTE:** You can create your own `admin` generator using the `.strapirc` file.
[Learn more how to use custom generators.](http://strapi.io/documentation/customization)

## Contribution

As you may imagine, we look forward to have new contributors for the admin panel.

If you detect any bug or if your need a new feature, feel free to post an issue on GitHub.

You also can directly develop new features or fix bugs. In order to do that,
fork the Strapi admin panel repository, make changes and then submit a pull request.

## Resources

- [Contributing guide](CONTRIBUTING.md)
- [MIT License](LICENSE.md)

## Links

- [Strapi website](http://strapi.io/)
- [Strapi news on Twitter](https://twitter.com/strapijs)
