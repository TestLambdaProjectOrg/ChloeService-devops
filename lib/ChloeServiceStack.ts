import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { CfnParametersCode, Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import Environment from './Environment';

interface ChloeServiceStackProps extends cdk.StackProps {
  appEnv: Environment;
}

class ChloeServiceStack extends cdk.Stack {
  public static readonly STACK_NAME = 'ChloeServiceStack';

  public readonly cfnOutputAPI: cdk.CfnOutput;

  private readonly appEnv: Environment;

  public httpApi: HttpApi;

  public chloeFuncHandlerCode: CfnParametersCode;

  constructor(
    scope: cdk.Construct, 
    id: string, 
    props: ChloeServiceStackProps
  ) {
    super(scope, id, props);

    this.appEnv = props.appEnv;

    this.chloeFuncHandlerCode = Code.fromCfnParameters();
    
    const chloeFunc = new Function(
      this,
      `ChloeFuncHandler${this.appEnv}`,
      {
        runtime: Runtime.GO_1_X,
        handler: 'chloefunc',
        code: this.chloeFuncHandlerCode,
        environment: {
          APP_ENV: this.appEnv,
        },
      },
    );
    
    const chloeFuncIntegration = new LambdaProxyIntegration({
      handler: chloeFunc,
    });

    this.httpApi = new HttpApi(this, `ChloeServiceHttpAPI${this.appEnv}`, {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
      },
      apiName: 'chloe-service-api',
      createDefaultStage: true,
    });

    this.httpApi.addRoutes({
      path: '/',
      methods: [
        HttpMethod.GET,
      ],
      integration: chloeFuncIntegration,
    });

    this.cfnOutputAPI = new cdk.CfnOutput(
      this,
      `ChloeServiceAPI${this.appEnv}`, {
        value: this.httpApi.url!,
        exportName: `ChloeServiceAPIEndpoint${this.appEnv}`,
      },
    );
  }
}

export default ChloeServiceStack;
