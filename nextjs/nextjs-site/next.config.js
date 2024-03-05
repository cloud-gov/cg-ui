module.exports = {
  eslint: {
    // directories that eslint will run on
    // you can also list files (must give the file extension)
    dirs: ['api', 'app', 'pages', '__tests__', 'middleware.js']
  },
  generateBuildId: async () => {
    // placeholder during development
    return "0.0.1";
  }
}
