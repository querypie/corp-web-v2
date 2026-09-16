import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

function assertCommitSha(sha) {
  if (typeof sha !== 'string' || !/^[a-f0-9]{40}$/.test(sha)) {
    throw new Error('A full Git commit SHA is required to update release');
  }
}

export function writeProductionDeploymentOutput(deployment, outputPath) {
  if (deployment.target !== 'production' || deployment.status !== 'READY' || !deployment.aliasAssigned) {
    throw new Error('Only a READY Production deployment with assigned domains can update release');
  }
  const sha = deployment.gitSource?.sha;
  assertCommitSha(sha);
  appendFileSync(outputPath, `deployment_sha=${sha}\n`);
  console.log(`Production deployment commit: ${sha}`);
}

export function updateReleaseBranch(sha, { cwd = process.cwd() } = {}) {
  assertCommitSha(sha);
  const git = (...args) => {
    console.log(`git ${args.join(' ')}`);
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  };
  const ref = 'refs/heads/release';
  const previousSha = git('ls-remote', '--exit-code', 'origin', ref).split(/\s+/)[0];
  assertCommitSha(previousSha);
  git('fetch', '--no-tags', 'origin', sha);
  // An explicit lease permits rollbacks but rejects a concurrent change to release.
  git('push', `--force-with-lease=${ref}:${previousSha}`, 'origin', `${sha}:${ref}`);
  console.log(`release updated: ${previousSha} -> ${sha}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    updateReleaseBranch(process.env.DEPLOYED_SHA);
  } catch (error) {
    console.error('Production may already be deployed, but release synchronization failed. Compare the current Vercel Production SHA with release before retrying.');
    console.error(error.message);
    process.exitCode = 1;
  }
}
