const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudfront = require("@aws-cdk/aws-cloudfront");

class CdkDeployStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    //create bucket
    const testBucket = new s3.Bucket(this, "testing-bucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    //distribute to cloundFront
    new cloudfront.Distribution(this, "MyDistribution", {
      defaultBehavior: { origin: cloudfront.Origin.fromBucket(testBucket) },
    });

    //create pipeline
    const pipeline = new codepipeline.Pipeline(this, "testPipeline", {
      pipelineName: "SourcePipeline",
    });

    //source from GitHub. Setup Github webhook
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: "Retrieve_Source",
      owner: "{GITHUB REPO OWNER}",
      repo: "{GITHUB REPO}",
      oauthToken: "{GITHUB OAUTH TOKEN}",
      output: sourceOutput,
      branch: "master",
      trigger: codepipelineActions.GitHubTrigger.WEBHOOK,
    });

    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    //Deploy to created S3 bucket
    const deployAction = new codepipelineActions.S3DeployAction({
      actionName: "S3Deploy",
      //stage: deployStage,
      bucket: testBucket,
      input: sourceOutput,
    });

    const deployStage = pipeline.addStage({
      stageName: "Deploy",
      actions: [deployAction],
    });
  }
}

module.exports = { CdkDeployStack };
