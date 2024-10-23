export type MongoError = {
  code?: number;
  keyValue?: Record<string, string>;
  statusCode?: number;
  message?: string;
} & Error;
