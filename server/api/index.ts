import serverlessExpress from '@vendia/serverless-express';
import app from '../src/index' // Adjust path as per your structure

export const handler = serverlessExpress({ app });
