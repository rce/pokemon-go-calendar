import cdk = require("@aws-cdk/core")
import lambda = require("@aws-cdk/aws-lambda")
import route53 = require("@aws-cdk/aws-route53")
import apigateway = require("@aws-cdk/aws-apigateway")

async function main() {
  const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }

  const app = new cdk.App()
  new Stack(app, "Stack", { env })
  app.synth()
}

class Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props)

    const hostedZone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: "pogo.rce.fi"
    })

    const backendLambda = new lambda.Function(this, "BackendFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.asset("./src"),
    })

    const api = new apigateway.RestApi(this, "BackendAPI", {
      deployOptions: {
        stageName: "api",
      },
      binaryMediaTypes: ["*/*"],
      defaultIntegration: new apigateway.LambdaIntegration(backendLambda, {
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH
      })
    })

    api.root.addMethod("GET")
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
