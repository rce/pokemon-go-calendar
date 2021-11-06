import cdk = require("@aws-cdk/core")
import iam = require("@aws-cdk/aws-iam")

async function main() {
  const app = new cdk.App()
  new Stack(app)
  app.synth()
}

class Stack extends cdk.Stack {
  constructor(scope: cdk.Construct) {
    super(scope, "ContinuousDelivery", {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      }
    })

    const { role } = new GithubActionsAccessRole(this, 'GithubActionsAccessRole', {
      roleName: "GithubActionsAccessRole",
      githubRepositories: ["rce/pokemon-go-calendar"],
    })

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"))
  }
}

type GithubActionsAccessRoleProps = {
  roleName: string
  githubRepositories: string[]
}

class GithubActionsAccessRole extends cdk.Construct {
  role: iam.Role
  constructor(scope: cdk.Construct, id: string, props: GithubActionsAccessRoleProps) {
    super(scope, id)
    const githubConnectProvider = new iam.OpenIdConnectProvider(this, "OpenIdConnectProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
      thumbprints: ["a031c46782e6e6c662c2c87c76da9aa62ccabd8e"],
    })

    const condition = {
      "ForAnyValue:StringLike": {
        "token.actions.githubusercontent.com:sub": props.githubRepositories.map(repo => `repo:${repo}:*`)
      }
    }
    this.role = new iam.Role(this, "Role", {
      roleName: props.roleName,
      assumedBy: new iam.FederatedPrincipal(githubConnectProvider.openIdConnectProviderArn, condition, "sts:AssumeRoleWithWebIdentity"),
    })
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
