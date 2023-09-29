# README

This repository shows an example of the CDK project configured cross-account deployment.

This is part of the session "Configure cross-account deployment using CDK" at CDK Day 2023.

## overview

Directory structure as follows

```plain
.
├── bin
├── lib  # define your stacks
└── deployment  # pipeline definition
    ├── bin
    └── lib
```

`bin/` and `lib/` are general CDK project layout that you would like to deploy.

`CrossAccountDeploymentStack` stack resource is defined in this example. It is deployed to the "target" account by pipeline (that is defined in `deployment`).

The directories and files Under the `deployment/` also has single CDK project layout, but it is used for the pipeline definition. Each CDK Apps is separated because it is deployed to the different accounts: the pipeline's account and the target account.

## Deployment

Prerequisites:

- 2 AWS Accounts (pipeline account and target account)
- GitHub connection v2 has been created in the pipeline account

(1) bootstrap for pipeline account

```bash
# execute with pipeline account credential
$ npx cdk npx cdk bootstrap \
    -a 'npx ts-node --prefer-ts-exts deployment/bin/pipeline.ts' \
    -c "GithubConnectionArn=xxx"
```

(2) bootstrap for target account

Trust the principal (=pipeline account).

```bash
# execute with target account credential
$ npx cdk bootstrap \
    --trust <pipeline-account> \
    --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
    aws://<pipeline-account>/us-east-1
```

(3) deploy pipeline

```bash
# execute with pipeline account credential
$ npx cdk deploy \
    -a 'npx ts-node --prefer-ts-exts deployment/bin/pipeline.ts' \
    -c "GithubConnectionArn=arn:aws:codestar-connections:<region>:<pipeline-account>:connection/<id>"
```

(4) change the code 

replace the following values to match your environment.

1. Repository and owner in the PipelineStack
2. StackProps values that are passed to CrossAccountDeploymentExampleStack

(5) trigger the pipeline

Push this code into main branch on your repository.

The pipeline will be triggered then starts deploying CrossAccountDeploymentExampleStack to target account.
