import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const repositoryRootDir = path.join(__dirname, '../../');

export interface PipelineStackProps extends cdk.StackProps { 
  githubRepositoryOwner: string;
  githubRepositoryName: string;
  githubConnectionArn: string;
  targetBranch: string;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    console.log(props);

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'Source',
      output: sourceOutput,
      owner: props.githubRepositoryOwner,
      repo: props.githubRepositoryName,
      branch: props.targetBranch,
      connectionArn: props.githubConnectionArn,
      triggerOnPush: true,
    });

    const buildSpecPath = path.relative(
      repositoryRootDir,
      path.resolve(path.join(__dirname, '../', 'buildspec.yml')),
    );
    const project = new codebuild.PipelineProject(this, 'CrossAccountExample', {
      projectName: 'CrossAccountExample',
      buildSpec: codebuild.BuildSpec.fromSourceFilename(buildSpecPath),
      environment: {
        computeType: codebuild.ComputeType.LARGE,
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_5,
        privileged: true,
      },
      // environmentVariables: {},
    });
    project.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: ['*'],
      conditions: {
        // Only allow Deployment, Lookup, ImagePublishing, FilePublishing Role
        'ForAnyValue:StringEquals': {
          'iam:ResourceTag/aws-cdk:bootstrap-role': [
            'image-publishing',
            'file-publishing',
            'deploy',
            'lookup'
          ],
        },
      },
    }));

    const buildOutput = new codepipeline.Artifact();
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [ buildOutput ],
    });

    // Pipeline
    const pipeline = new codepipeline.Pipeline(this, 'CrossAccountExamplePipeline', {
      pipelineName: 'CrossAccountExamplePipeline',
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [ sourceAction ],
    });
    pipeline.addStage({
      stageName: 'Build',
      actions: [ buildAction ],
    });
  }
}