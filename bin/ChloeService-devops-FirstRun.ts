#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import Environment from '../lib/Environment';
// import ChloeServiceStack from '../lib/ChloeServiceStack';
// import ChloeServiceCICD from '../lib/ChloeServiceCICD';
import ChloeServiceCICD from '../lib/ChloeServiceCICD-FirstRun';

const app = new cdk.App();

// const ppdStack = new ChloeServiceStack(
//   app,
//   `${ChloeServiceStack.STACK_NAME}${Environment.PPD}`,
//   {
//   //   env: { region: 'us-east-1' },
//     appEnv: Environment.PPD,
//   },
// );

// const prdStack = new ChloeServiceStack(
//   app,
//   `${ChloeServiceStack.STACK_NAME}${Environment.PRD}`,
//   {
//   //   env: { region: 'us-east-1' },
//     appEnv: Environment.PRD,
//   },
// );

// eslint-disable-next-line no-new
new ChloeServiceCICD(
  app,
  'ChloeServiceCICDStack',
  // {
  //   ppdStack: {
  //     lambdaCode: ppdStack.chloeFuncHandlerCode,
  //     apiURL: ppdStack.httpApi.url!,
  //   },
  //   prdStack: {
  //     lambdaCode: prdStack.chloeFuncHandlerCode,
  //     apiURL: prdStack.httpApi.url!,
  //   },
  // },
);

app.synth();