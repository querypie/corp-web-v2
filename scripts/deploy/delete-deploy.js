import { Vercel } from '@vercel/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const teamId = process.env.VERCEL_TEAM_ID;
const branch = process.env.BRANCH;

async function deleteDeployments() {
  try {
    const listResponse = await vercel.deployments.getDeployments({
      teamId,
      branch,
    });

    const targetDeployments = listResponse.deployments.filter(
      ({ name, target }) => name === 'corp-web-v2' && target === null,
    );

    for (const target of targetDeployments) {
      const deletedDeployment = await vercel.deployments.deleteDeployment({
        id: target.uid,
        teamId,
      });

      console.log(`Deployment deleted: ID ${deletedDeployment.uid} and status ${deletedDeployment.state}`);
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

(async () => {
  try {
    await deleteDeployments();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
})();
