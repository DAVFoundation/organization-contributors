const octokit = require('@octokit/rest')()

module.exports.authenticate = (token) => octokit.authenticate({
  type: 'token',
  token,
})

const getRepos = async (org) => {
  let response = await octokit.repos.getForOrg({
    org: org,
    type: 'public',
  })
  let { data } = response;
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response)
    data = data.concat(response.data)
  }
  return data.map(x => x.name)
}

const getRepoContributors = async (owner, repo) => {
  contributors = {}
  let response = await octokit.repos.getContributors({
    owner: owner,
    repo: repo
  })
  let { data } = response;
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response)
    data = data.concat(response.data)
  }
  data.map(x => contributors[x.id] = x.contributions);
  return contributors
}

const getUserData = async (id) => {
  let { data } = await octokit.users.getById({ id });
  return {
    'user': data.login,
    'name': data.name,
    'avatar': data.avatar_url,
    'bio': data.bio
  }
}

module.exports.getOrgContributors = async (owner, top) => {

  var orgContributors = {}

  const repos = await getRepos(owner)

  for (const repo of repos) {
    const repoContributors = await getRepoContributors('davfoundation', repo)

    for (const [userid, contrib_count] of Object.entries(repoContributors)) {
      if (userid in orgContributors) {
        orgContributors[userid]['contrib_count'] += contrib_count
        orgContributors[userid]['repos'].push(repo)
      } else {
        orgContributors[userid] = {};
        orgContributors[userid]['contrib_count'] = contrib_count;
        orgContributors[userid]['repos'] = [];
        orgContributors[userid]['repos'].push(repo);
      }
    }
  }

  // breakdown the dict and sort it by contribution
  var contributors = Object.keys(orgContributors).map(function (key) {
    return { id: key, contrib_count: this[key]['contrib_count'], repos: this[key]['repos']  };
  }, orgContributors);
  contributors.sort(function (u1, u2) { return u2.contrib_count - u1.contrib_count; });

  const filtered = contributors.slice(0, top);
  const output = []
  for (const contributor of filtered) {
    // get user data
    let user = await getUserData(contributor.id);
    output.push({ ...user, ...contributor });
  }

  return output;
}