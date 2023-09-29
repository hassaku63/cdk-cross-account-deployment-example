#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();

const getGithubConnectionArn = (app: cdk.App): string => {
  const result = app.node.tryGetContext('GithubConnectionArn') as string;
  if (!result) {
    throw new Error('Context value GithubConnectionArn is required.');
  }
  return result;
}

new PipelineStack(app, 'PipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION, 
  },
  // Replace your own values
  githubRepositoryOwner: 'hassaku63',
  githubRepositoryName: 'cdk-cross-account-deployment-example',
  githubConnectionArn: getGithubConnectionArn(app),
  targetBranch: 'main',
});
