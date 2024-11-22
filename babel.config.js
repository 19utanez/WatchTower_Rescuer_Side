module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Required for Expo projects
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        allowlist: ['SERVER_URL', 'GOOGLE_MAPS_API_KEY'], // Add both variables here
      }]
    ]
  };
};
