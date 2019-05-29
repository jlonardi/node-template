declare module 'node-postgres-named' {
  import { Client, PoolClient, ClientBase, QueryResult, QueryConfig } from 'pg';
  export function patch(client: Client | PoolClient): PatchedClient;
  export interface IQueryObject {
    [key: string]: string | number;
  }
  export class PatchedClient extends ClientBase {
    public query(
      queryTextOrConfig: string | QueryConfig,
      values?: IQueryObject | any
    ): Promise<QueryResult> | any;
    public release(err?: Error): void;
  }
}
