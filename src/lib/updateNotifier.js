const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 86400000, // 1 day
});
notifier.notify();
