const fs = require('fs').promises;
const dotenv = require('dotenv');
const { Octokit } = require('octokit');
const axios = require('axios');

dotenv.config();

// GitHub API client (both REST and GraphQL)
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

// ZenHub API client
const zhApi = axios.create({
  baseURL: 'https://api.zenhub.com/',
  headers: {
    'X-Authentication-Token': process.env.ZENHUB_API_TOKEN
  },
  adapter: zhRateLimitingAdapter(axios.defaults.adapter)
});

// Special handling for ZenHub REST API rate limiting
// (see https://github.com/ZenHubIO/API#api-rate-limit)
function zhRateLimitingAdapter(adapter) {
  return async (config) => {
    let response;
    let status = 403;
    while (status === 403) {
      try {
        response = await adapter(config);
        status = response.status;
      } catch (e) {
        if (e.isAxiosError && e.response.status === 403) {
          const resetAtMs = e.response.headers['x-ratelimit-reset'] * 1000;
          const sentAtMs = new Date(e.response.headers['date']).getTime();
          const timeoutMs = resetAtMs - sentAtMs;
          console.log(`timeout until ZenHub API request rate reset: ${timeoutMs} ms`);
          await new Promise((r) => setTimeout(r, timeoutMs));
        } else {
          throw e;
        }
      }
    }

    return response;
  };
}

async function getOriginalZhPipelinesFromTheLog(logfilePath) {
  const pipelineByIssueNumber = new Map();
  const log = await fs.readFile(logfilePath, 'utf-8');
  const re = /^vaadin-[a-zA-Z-]+#\d+.*\n\s+transferred to ---> web-components#(\d+)\n\s+labels: \[.*\]\n\s+pipelines: \[(.*)\]\n/gm;
  for (const match of log.matchAll(re)) {
    const wcIssueNumber = match[1];
    const pipelineInWorkspaceTuples = match[2].split(', ');
    for (const pipelineInWorkspaceTuple of pipelineInWorkspaceTuples) {
      const [pipeline, workspace] = pipelineInWorkspaceTuple.split(' in ');
      if (workspace === 'Components team workspace') {
        pipelineByIssueNumber.set(wcIssueNumber, pipeline);
      }
    }
  }
  return pipelineByIssueNumber;
}

async function getGitHubRepoByName(name) {
  const { data: repo } = await octokit.rest.repos.get({
    owner: 'vaadin',
    repo: name
  });
  return repo;
}

async function getZhWorkspaceByName(workspaceName, repo_id) {
  const { data: workspaces } = await zhApi.get(`/p2/repositories/${repo_id}/workspaces`);
  const idx = workspaces.findIndex((workspace) => workspace.name === workspaceName);
  if (idx > -1) {
    return workspaces[idx];
  } else {
    throw new Error(`cannot find a workspace called '${workspaceName}' for the repo ${repo_id}`);
  }
}

async function resolveZhPipelineIdByName(pipelineNameByIssueNumber, workspace_id, repo_id) {
  const {
    data: { pipelines }
  } = await zhApi.get(`/p2/workspaces/${workspace_id}/repositories/${repo_id}/board`);

  const idByName = new Map(pipelines.map((pipeline) => [pipeline.name, pipeline.id]));
  const pipelineByIssue = new Map();
  pipelines.forEach((pipeline) =>
    pipeline.issues.forEach((issue) => pipelineByIssue.set(issue.issue_number, pipeline.id))
  );

  const pipelineIdByIssueNumber = new Map();
  for (const [issue, pipelineName] of pipelineNameByIssueNumber.entries()) {
    pipelineIdByIssueNumber.set(issue, {
      original_id: idByName.get(pipelineName),
      current_id: pipelineByIssue.get(+issue)
    });
  }
  return pipelineIdByIssueNumber;
}

async function main() {
  const ghWebComponentsRepo = await getGitHubRepoByName('web-components');
  const zhDesignSystemWorkspace = await getZhWorkspaceByName('Design System', ghWebComponentsRepo.id);
  const pipelineNameByIssueNumber = await getOriginalZhPipelinesFromTheLog('transferIssues.ci.log');
  const pipelineIdByIssueNumber = await resolveZhPipelineIdByName(
    pipelineNameByIssueNumber,
    zhDesignSystemWorkspace.id,
    ghWebComponentsRepo.id
  );

  let totalMoved = 0;
  let totalInPlace = 0;
  let totalMissing = 0;
  let totalProcessed = 0;
  for (const [issue, pipeline] of pipelineIdByIssueNumber.entries()) {
    if (!pipeline.current_id) {
      console.log(`the issue #${issue} is not on the board any longer`);
      totalMissing += 1;
    } else if (pipeline.original_id === pipeline.current_id) {
      console.log(`the issue #${issue} is in the correct pipeline already`);
      totalInPlace += 1;
    } else {
      console.log(
        `moving the issue #${issue} to the ${pipelineNameByIssueNumber.get(issue)} pipeline (id: ${
          pipeline.original_id
        })`
      );
      await zhApi.post(
        `/p2/workspaces/${zhDesignSystemWorkspace.id}/repositories/${ghWebComponentsRepo.id}/issues/${issue}/moves`,
        {
          pipeline_id: pipeline.original_id,
          position: 'bottom'
        }
      );
      totalMoved += 1;
    }
    totalProcessed += 1;
  }

  console.log(
    `total processed: ${totalProcessed} (moved: ${totalMoved}, in place: ${totalInPlace}, missing: ${totalMissing})`
  );
}

main().catch(console.log);
