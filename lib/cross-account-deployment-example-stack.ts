import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface CrossAccountDeploymentExampleStackProps extends cdk.StackProps {
  someProp: string;
}

export class CrossAccountDeploymentExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CrossAccountDeploymentExampleStackProps) {
    super(scope, id, props);

    new cdk.CfnOutput(this, 'SomeProp', {
      value: props.someProp,
    });
  }
}
