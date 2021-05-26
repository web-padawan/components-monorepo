const fs = require('fs').promises;
const dotenv = require('dotenv');
const { Octokit } = require('octokit');

dotenv.config();

// if DRY_RUN then no actual changes are made
const DRY_RUN = process.env.PRODUCTION_RUN !== 'true';
console.log(
  DRY_RUN
    ? `PRODUCTION_RUN is not set to 'true', no actuall changes will be made`
    : `PRODUCTION_RUN is set to 'true', making changes for real`
);

// stop after processing REPO_LIMIT repos
const REPO_LIMIT = +process.env.REPO_LIMIT || Number.MAX_SAFE_INTEGER;

// GitHub API client (both REST and GraphQL)
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

async function getSourceReposList() {
  const packages = await fs.readdir('packages');

  const repos = await Promise.all(
    packages.map(async (package) => {
      try {
        const { data: repo } = await octokit.rest.repos.get({
          owner: 'vaadin',
          repo: package
        });
        return repo;
      } catch (e) {
        if (!!e.constructor && e.constructor.name === 'RequestError' && e.status === 404) {
          console.log(`Skipped the package ${package} as it has no separate repo`);
          return;
        } else {
          throw e;
        }
      }
    })
  );

  return repos.filter((repo) => !!repo); // remove skipped packages from the list
}

async function main() {
  const {
    data: { login }
  } = await octokit.rest.users.getAuthenticated();
  console.log(`Logged-in to GitHub as ${login}`);

  console.time('repos');
  let totalReposProcessed = 0;
  let totalReposUpdated = 0;

  const repos = await getSourceReposList();
  await Promise.all(
    repos.map(async (repo) => {
      if (totalReposProcessed >= REPO_LIMIT) {
        console.log(`Skipping the repo ${repo.full_name} because the REPO_LIMIT (${REPO_LIMIT}) is reached`);
        return;
      }
      totalReposProcessed += 1;

      // FIXME: returns _all_ open PRs regardless of the `head`
      const { data: existingPulls } = await octokit.rest.pulls.list({
        owner: 'vaadin',
        repo: repo.name,
        head: 'vl/disable-issues-and-direct-to-monorepo',
        base: 'master'
      });

      if (existingPulls.length === 0) {
        let pull;
        console.log(`Creating a 'disable issues' PR on the repo ${repo.full_name}...`);
        if (DRY_RUN) {
          // do nothing
          pull = { html_url: 'dummy' };
        } else {
          const response = await octokit.rest.pulls.create({
            owner: 'vaadin',
            repo: repo.name,
            head: 'vl/disable-issues-and-direct-to-monorepo',
            base: 'master',
            title: 'chore: disable issues and direct ppl to web-components repo [skip ci]',
            body: `## Description

All component-related issues (for any version of the component) should be opened either in \`the web-components\` monorepo (if it's reproducible with TypeScript and HTML, without Vaadin Flow / Java), or in the \`flow-components\` monorepo (if it's about the Java API). This repository remains open only to be able to release fixes for the versions of this web component used with Vaadin 10, 14 and Vaadin 19 for as long as they are maintained.

In order to make this clear for users, this PR
  - updates the README to make the role of this repo and its relationship with the the \`web-components\` monorepo very clear
  - disables new issues in this repo: any attempt to create a new issue here would direct users either to the \`web-components\` or to the \`flow-components\` monorepo

Related to: https://github.com/vaadin/components-team-tasks/issues/584

## Type of change

- [ ] Bugfix
- [ ] Feature
- [x] Internal change

## Checklist

- [x] I have read the contribution guide: https://vaadin.com/docs/latest/guide/contributing/overview/
- [x] I have added a description following the guideline.
- [x] The issue is created in the corresponding repository and I have referenced it.
- [ ] I have added tests to ensure my change is effective and works as intended.
- [ ] New and existing tests are passing locally with my change.
- [x] I have performed self-review and corrected misspellings.`
          });
          pull = response.data;
        }
        console.log(`\tcreated a PR: ${pull.html_url}`);
        totalReposUpdated += 1;
      } else {
        console.log(`Skipping the repo ${repo.full_name} because a 'disable issues' PR already exists there`);
      }
    })
  );

  console.log(`total repos processed: ${totalReposProcessed}`);
  console.log(`total repos updated: ${totalReposUpdated}`);
  console.timeEnd(`repos`);
}

main().catch(console.log);
