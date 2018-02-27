const program = require('commander');
require('./lib/updateNotifier');
const {EOL} = require('os');
var pkg = require('../package.json');

program.on('--help', () => {
  console.log(`
  Example:
  -  organization
  $ ${pkg.name} -o davfoundation

  Find out more at ${pkg.homepage}`);
});

// Configure the CLI
program
  .version(pkg.version)
  .description(`${pkg.name} v${pkg.version} - ${pkg.description}`)
  .option('-o, --organization <s>', 'Name of the organization')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

if (program.organization) {
  console.log(program.organization)
}

console.log(`${pkg.name} v${pkg.version} - ${pkg.description}` + EOL);
