import ky from 'ky';

interface DefaultVercelEnv {
  id: string;
  key: string;
  target: ('production' | 'preview' | 'development')[];
}

interface BranchOnlyVercelEnv {
  id: string;
  key: string;
  target: ['preview'];
  gitBranch: string;
}

type VercelEnv = DefaultVercelEnv | BranchOnlyVercelEnv;

interface GetEnvsResponse {
  envs: VercelEnv[];
}

interface GetEnvResponse {
  id: string;
  value: string;
}

export default class VercelApiClient {
  private projectId: string;
  private apiToken: string;

  constructor(projectId: string, apiToken: string) {
    this.projectId = projectId;
    this.apiToken = apiToken;
  }

  /**
   * 모든 환경변수를 조회한다. 모든 환경변수를 조회 시 환경변수 값은 암호화되어 반환된다.
   *
   * https://vercel.com/docs/rest-api/reference/endpoints/projects/retrieve-the-environment-variables-of-a-project-by-id-or-name
   */
  async getEnvs(): Promise<GetEnvsResponse> {
    return ky
      .get<GetEnvsResponse>(
        `https://api.vercel.com/v10/projects/${this.projectId}/env`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
          },
        },
      )
      .json();
  }

  /**
   * 단일 환경변수를 조회한다. 오직 단일 조회로만 환경변수 값을 알 수 있다.
   *
   * https://vercel.com/docs/rest-api/reference/endpoints/projects/retrieve-the-decrypted-value-of-an-environment-variable-of-a-project-by-id
   */
  async getEnv(id: string): Promise<GetEnvResponse> {
    return ky
      .get<GetEnvResponse>(
        `https://api.vercel.com/v1/projects/${this.projectId}/env/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
          },
        },
      )
      .json();
  }
}
