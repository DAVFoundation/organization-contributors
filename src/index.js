const program = require('commander');
require('./lib/updateNotifier');
const { EOL } = require('os');
var pkg = require('../package.json');
var conifg = require('./lib/config');
var gh = require('./lib/github');

program.on('--help', () => {
  console.log(`
  Example:
  -  organization
  $ ${pkg.name} -o davfoundation -t "abcdef" -c 10

  Find out more at ${pkg.homepage}`);
});

// Configure the CLI
program
  .version(pkg.version)
  .description(`${pkg.name} v${pkg.version} - ${pkg.description}`)
  .option('-o, --organization <s>', 'Name of the organization')
  .option('-t, --token <s>', 'GitHub token')
  .option('-c, --count <n>', 'total no of top users')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

gh.authenticate(program.token);
gh.getOrgContributors(program.organization, program.count)
  .then(contributors => {
    console.log(contributors);
  })

console.log(`${pkg.name} v${pkg.version} - ${pkg.description}` + EOL);
