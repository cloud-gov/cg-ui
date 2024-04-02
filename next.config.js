const path = require('path');

module.exports = {
  generateBuildId: async () => {
    // placeholder build id for development
    return '0.0.1';
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'node_modules', '@uswds', 'uswds', 'packages'),
    ],
  },
};
