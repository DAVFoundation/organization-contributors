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
  .option('-o, --organization <s>', 'Name of the GitHub organization (required)')
  .option('-t, --token <s>', 'GitHub token (optional)')
  .option('-c, --count <n>', 'Maximum number of top users to return (optional, defaults: 10)')
  .option('-e, --exclude <path>', 'Exclude user/repo file path (optional)')
  .option('-w, --write <path>', 'Write output to the .json file (optional)')
  .parse(process.argv);

if (!process.argv.slice(2).length || !program.organization ) {
  program.help();
}

var token = process.token || process.env.GIT_TOKEN;

if (token){
  gh.authenticate(token);
}else{
  console.log('No github token provided. Making unauthenticated requests to Github API.');
}

gh.getOrgContributors(program.organization, program.count || 10, program.exclude || null)
  .then(contributors => {
    if (program.write) {
      writeFile(program.write, JSON.stringify(contributors), 'utf8', () => console.log(`Output written to `, program.write));
    } else {
      console.log(contributors);
    }
  })

console.log(`${pkg.name} v${pkg.version} - ${pkg.description}` + EOL);
