const config = {
  api_token : process.env.GITHUB_TOKEN,
};

module.exports = key => {
  if (key in config) {
    return config[key];
  } else {
    throw `The given key "${key}" to config was invalid`;
  }
};
