import type { Connect } from 'vite';
import dotenv from 'dotenv';
import VercelApiClient from './VercelApiClient.js';

dotenv.config({ quiet: true });

export interface Response {
  envs: {
    /** 환경변수 키 */
    key: string;
    /** 환경 별 환경변수 값 */
    [environment: string]: string;
  }[];
  /** 환경 */
  targets: string[];
}

function createBranchPreviewIdentifier(gitBranch: string): string {
  return `preview(${gitBranch})`;
}

const handler: Connect.SimpleHandleFunction = async (_, res) => {
  try {
    const projectId = process.env.VERCEL_PROJECT_ID;
    const apiToken = process.env.VERCEL_API_TOKEN;

    if (!projectId || !apiToken) {
      console.error(
        'Missing required environment variables: VERCEL_PROJECT_ID and VERCEL_API_TOKEN',
      );
      res.statusCode = 500;
      res.end();
      return;
    }

    const vercelApiClient = new VercelApiClient(projectId, apiToken);

    const { envs } = await vercelApiClient.getEnvs();

    const defaultTargets = ['development', 'production', 'preview'];
    const previewBranches = [
      ...new Set(
        envs
          .filter((env) => 'gitBranch' in env)
          .map((env) => createBranchPreviewIdentifier(env.gitBranch)),
      ),
    ].sort();
    const targets = [...defaultTargets, ...previewBranches];

    const getEnvResponsePromises = envs.map((env) =>
      vercelApiClient.getEnv(env.id),
    );
    const getEnvResponses = await Promise.all(getEnvResponsePromises);
    const decryptedValueRecord = getEnvResponses.reduce<Record<string, string>>(
      (acc, env) => {
        acc[env.id] = env.value;
        return acc;
      },
      {},
    );

    const responseEnvMap = new Map<string, Response['envs'][number]>();
    envs.forEach((env) => {
      let responseEnv = responseEnvMap.get(env.key);
      if (!responseEnv) {
        responseEnv = { key: env.key };
        responseEnvMap.set(env.key, responseEnv);
      }

      if ('gitBranch' in env) {
        const branchPreviewIdentifier = createBranchPreviewIdentifier(
          env.gitBranch,
        );
        responseEnv[branchPreviewIdentifier] = decryptedValueRecord[env.id];
      } else {
        env.target.forEach((target) => {
          responseEnv[target] = decryptedValueRecord[env.id];
        });
      }
    });

    const responseEnvs = [...responseEnvMap.values()]
      .map((row) => row)
      .sort((a, b) => a.key.localeCompare(b.key));

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ envs: responseEnvs, targets }));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end();
  }
};

export default handler;
