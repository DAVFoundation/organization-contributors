const config = {
  github_token : process.env.GITHUB_TOKEN,
  intervalValue: 86400000, // 1 day
};

module.exports = key => {
  if (key in config) {
    return config[key];
  } else {
    throw `The given key "${key}" to config was invalid`;
  }
};
