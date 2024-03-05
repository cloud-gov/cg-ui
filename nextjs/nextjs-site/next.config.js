module.exports = {
  eslint: {
    // directories that eslint will run on
    // you can also list files (must give the file extension)
    dirs: ['api', 'app', 'pages', '__tests__', 'middleware.js']
  },
  generateBuildId: async () => {
    // this is a placeholder
    return "0.0.1";
  }
}
