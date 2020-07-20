#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkDeployStack } = require('../lib/cdk-deploy-stack');

const app = new cdk.App();
new CdkDeployStack(app, 'CdkDeployStack');
