import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { updateReleaseBranch, writeProductionDeploymentOutput } from './release.js';

const deployedSha = 'a'.repeat(40);
const readyDeployment = {
  target: 'production',
  status: 'READY',
  aliasAssigned: true,
  gitSource: { sha: deployedSha },
};

function temporaryDirectory(t) {
  const directory = mkdtempSync(path.join(tmpdir(), 'production-release-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

test('outputs the deployed SHA, independent of the workflow or moving source branch', t => {
  const output = path.join(temporaryDirectory(t), 'output');
  writeProductionDeploymentOutput({
    ...readyDeployment,
    gitSource: { sha: deployedSha, ref: 'main' },
    meta: { githubCommitSha: 'b'.repeat(40) },
  }, output);
  assert.equal(readFileSync(output, 'utf8'), `deployment_sha=${deployedSha}\n`);
});

for (const status of ['ERROR', 'CANCELED', 'BUILDING']) {
  test(`${status} deployments cannot publish a release SHA`, t => {
    const output = path.join(temporaryDirectory(t), 'output');
    assert.throws(() => writeProductionDeploymentOutput({ ...readyDeployment, status }, output));
    assert.equal(existsSync(output), false);
  });
}

test('rejects Preview, unassigned domains and missing or invalid deployed SHA', t => {
  const output = path.join(temporaryDirectory(t), 'output');
  for (const change of [
    { target: null },
    { target: 'staging' },
    { aliasAssigned: false },
    { gitSource: undefined },
    { gitSource: { sha: 'main' } },
    { gitSource: { sha: `${deployedSha}\nother=value` } },
  ]) {
    assert.throws(() => writeProductionDeploymentOutput({ ...readyDeployment, ...change }, output));
    assert.equal(existsSync(output), false);
  }
});

function gitFixture(t) {
  const directory = temporaryDirectory(t);
  const remote = path.join(directory, 'origin.git');
  const cwd = path.join(directory, 'checkout');
  const run = (at, ...args) => execFileSync('git', args, {
    cwd: at,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Release test',
      GIT_AUTHOR_EMAIL: 'release@example.test',
      GIT_COMMITTER_NAME: 'Release test',
      GIT_COMMITTER_EMAIL: 'release@example.test',
    },
  }).trim();
  run(directory, 'init', '--bare', remote);
  run(directory, 'init', '--initial-branch=main', cwd);
  const git = (...args) => run(cwd, ...args);
  git('remote', 'add', 'origin', remote);
  git('-c', 'commit.gpgSign=false', 'commit', '--allow-empty', '-m', 'Initial production');
  const initialSha = git('rev-parse', 'HEAD');
  git('-c', 'commit.gpgSign=false', 'commit', '--allow-empty', '-m', 'Next production');
  const nextSha = git('rev-parse', 'HEAD');
  git('-c', 'commit.gpgSign=false', 'commit', '--allow-empty', '-m', 'Newer main');
  const mainSha = git('rev-parse', 'HEAD');
  git('push', 'origin', 'main', `${initialSha}:refs/heads/release`);
  const remoteSha = branch => run(remote, 'rev-parse', `refs/heads/${branch}`);
  return { cwd, remote, git, initialSha, nextSha, mainSha, remoteSha };
}

test('tracks the deployed commit and supports rollback without moving main or checkout', t => {
  const fixture = gitFixture(t);
  updateReleaseBranch(fixture.nextSha, fixture);
  assert.equal(fixture.remoteSha('release'), fixture.nextSha);
  updateReleaseBranch(fixture.initialSha, fixture);
  assert.equal(fixture.remoteSha('release'), fixture.initialSha);
  assert.equal(fixture.remoteSha('main'), fixture.mainSha);
  assert.equal(fixture.git('rev-parse', 'HEAD'), fixture.mainSha);
});

test('invalid or unavailable commit leaves release unchanged', t => {
  const fixture = gitFixture(t);
  for (const sha of [undefined, 'main', '--all', '0'.repeat(40)]) {
    assert.throws(() => updateReleaseBranch(sha, fixture));
    assert.equal(fixture.remoteSha('release'), fixture.initialSha);
  }
});

test('does not overwrite a concurrent release update', t => {
  const fixture = gitFixture(t);
  const hook = path.join(fixture.cwd, '.git', 'hooks', 'pre-push');
  // Change the remote after ls-remote but before the actual push writes its ref.
  writeFileSync(hook, `#!/usr/bin/env node
require('node:child_process').execFileSync('git', ${JSON.stringify([
    '--git-dir', fixture.remote, 'update-ref', 'refs/heads/release', fixture.mainSha,
  ])});
`);
  chmodSync(hook, 0o755);
  assert.throws(() => updateReleaseBranch(fixture.nextSha, fixture));
  assert.equal(fixture.remoteSha('release'), fixture.mainSha);
});
