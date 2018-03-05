const program = require('commander');
require('./lib/updateNotifier');
const { EOL } = require('os');
var pkg = require('../package.json');
var conifg = require('./lib/config');
var gh = require('./lib/github');
var { writeFile } = require('fs');

program.on('--help', () => {
  console.log(`
  Example:
  -  organization
  $ ${pkg.name} -o davfoundation -t "abcdef" -c 10 -e exclude.json -w output.json

  Find out more at ${pkg.homepage}`);
});

// Configure the CLI
program
  .version(pkg.version)
  .description(`${pkg.name} v${pkg.version} - ${pkg.description}`)
  .option('-o, --organization <s>', 'Name of the GitHub organization')
  .option('-t, --token <s>', 'GitHub token')
  .option('-c, --count <n>', 'total no of top users')
  .option('-e, --exclude <s>', 'exclude user/repo file path')
  .option('-w, --write <s>', 'write output to the .json file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

gh.authenticate(program.token);
gh.getOrgContributors(program.organization, program.count, program.exclude)
  .then(contributors => {
    if (program.write) {
      writeFile(program.write, JSON.stringify(contributors), 'utf8', () => console.log(`Output written to `, program.write));
    } else {
      console.log(contributors);
    }
  })

console.log(`${pkg.name} v${pkg.version} - ${pkg.description}` + EOL);
