const path = require("path");

module.exports = {
  eslint: {
    // directories that eslint will run on
    // you can also list files (must give the file extension)
    dirs: ['api', 'app', 'pages', '__tests__', 'middleware.js']
  },
  generateBuildId: async () => {
    // placeholder build id for development
    return "0.0.1";
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, "node_modules", "@uswds", "uswds", "packages"),
    ],
  },
}
