const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable CSS processing to avoid lightningcss issues
config.transformer = {
  ...config.transformer,
  cssModules: false,
};

// Add resolver configuration for Radix UI
config.resolver = {
  ...config.resolver,
  alias: {
    '@radix-ui/react-dialog': '@radix-ui/react-dialog',
    '@radix-ui/react-slot': '@radix-ui/react-slot',
    '@radix-ui/react-primitive': '@radix-ui/react-primitive',
  },
};

module.exports = config;
