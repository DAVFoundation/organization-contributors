const program = require('commander');
require('./lib/updateNotifier');
const { EOL } = require('os');
var pkg = require('../package.json');
var config = require('./lib/config');
var gh = require('./lib/github');
var { writeFile } = require('fs');

program.on('--help', () => {
  console.log(`
  Example:

  $ ${pkg.name} -o davfoundation -t "abcdef" -c 400 -e exclude.json -w output.json
  $ ${pkg.name} -o davfoundation -e exclude.json -w output.json
  $ ${pkg.name} -o davfoundation -t "opqrts" -w output.json

  Find out more at ${pkg.homepage}${EOL}`);
});

// Configure the CLI
program
  .version(pkg.version)
  .description(`${pkg.name} v${pkg.version} - ${pkg.description}`)
  .option(
    '-o, --organization <s>',
    'Name of the GitHub organization (required)',
  )
  .option('-t, --token <s>', 'GitHub token (optional)')
  .option(
    '-c, --count <n>',
    'Maximum number of top users to return (optional, defaults: 10)',
  )
  .option('-e, --exclude <path>', 'Exclude user/repo file path (optional)')
  .option(
    '-w, --write <path>',
    'Write output to the .json file (optional, defaults: terminal)',
  )
  .parse(process.argv);

if (!process.argv.slice(2).length || !program.organization) {
  program.help();
}

var token = program.token || config('github_token');

if (token) {
  gh.authenticate(token);
  console.log(`Authenticated with github.${EOL}`);
} else {
  console.log(`No github token provided.
  Making unauthenticated requests to Github API.${EOL}`);
}

gh.getOrgContributors(
  program.organization,
  program.count || 10,
  program.exclude || null,
).then(contributors => {
  process.stdout.clearLine();
  if (program.write) {
    writeFile(program.write, JSON.stringify(contributors), 'utf8', () =>
      console.log(`Output written to ${program.write}${EOL}`),
    );
  } else {
    console.log(contributors);
  }
});

process.on('exit', () => {
  console.log(`${EOL}${pkg.name} v${pkg.version} - ${pkg.description} ${EOL}`);
});
