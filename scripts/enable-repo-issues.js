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

      if (!repo.has_issues) {
        console.log(`Enabling issues on the repo ${repo.full_name}...`);
        if (DRY_RUN) {
          // do nothing
        } else {
          await octokit.rest.repos.update({
            owner: 'vaadin',
            repo: repo.name,
            has_issues: true
          });
        }
        totalReposUpdated += 1;
      } else {
        console.log(`Skipping the repo ${repo.full_name} because issues are already enabled there`);
      }

      totalReposProcessed += 1;
    })
  );

  console.log(`total repos processed: ${totalReposProcessed}`);
  console.log(`total repos updated: ${totalReposUpdated}`);
  console.timeEnd(`repos`);
}

main().catch(console.log);
