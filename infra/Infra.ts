import cdk = require("@aws-cdk/core")
import lambda = require("@aws-cdk/aws-lambda")
import route53 = require("@aws-cdk/aws-route53")
import targets = require("@aws-cdk/aws-route53-targets")
import apigateway = require("@aws-cdk/aws-apigateway")
import certificatemanager = require("@aws-cdk/aws-certificatemanager")

const DOMAIN_NAME = "pogo.rce.fi"

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
      zoneName: DOMAIN_NAME,
    })

    const certificate = new certificatemanager.DnsValidatedCertificate(this, "Sertti", {
      domainName: DOMAIN_NAME,
      hostedZone,
    })

    const backendLambda = new lambda.Function(this, "BackendFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      memorySize: 128,
      code: lambda.Code.fromAsset("./src"),
    })

    const api = new apigateway.RestApi(this, "BackendAPI", {
      domainName: { domainName: DOMAIN_NAME, certificate },
      deployOptions: {
        stageName: "api",
      },
      binaryMediaTypes: ["*/*"],
      defaultIntegration: new apigateway.LambdaIntegration(backendLambda, {
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH
      })
    })

    api.root.addMethod("GET")

    new route53.ARecord(this, "Denssi", {
      zone: hostedZone,
      recordName: DOMAIN_NAME,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api))
    })
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
