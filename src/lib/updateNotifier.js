const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const intervalValue = require('./config');

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: intervalValue,
});
notifier.notify();
