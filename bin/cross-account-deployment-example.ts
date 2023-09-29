#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {
  CrossAccountDeploymentExampleStack,
  CrossAccountDeploymentExampleStackProps,
} from '../lib/cross-account-deployment-example-stack';

const app = new cdk.App();

const envSet: CrossAccountDeploymentExampleStackProps[] = [
  // Add your configuration of deployment target account
  {
    env: { account: '<target-account>', region: 'us-east-1' },
    someProp: 'foo',
  }
];

// note:
//   This is a very naive implementation because this is for showing example.
//   This may not so efficient approach if you would like to deployment same stack to multiple accounts
envSet.forEach((stackProps, i) => {
  new CrossAccountDeploymentExampleStack(app, `CrossAccountDeploymentExampleStack${i}`, stackProps);
});
