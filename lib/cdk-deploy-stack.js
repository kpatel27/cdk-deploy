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
    const testBucket = new s3.Bucket(this, "testing-jade-20", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    //upload file to bucket
    new s3deploy.BucketDeployment(this, "cdk-deployment-jade-20", {
      sources: [s3deploy.Source.asset("./myApp")],
      destinationBucket: testBucket,
    });

    //distribute to cloundFront
    new cloudfront.Distribution(this, "MyDistribution", {
      defaultBehavior: { origin: cloudfront.Origin.fromBucket(testBucket) },
    });

    // const distribution = new CloudFrontWebDistribution(this, "MyDistribution", {
    //   originConfigs: [
    //     {
    //       s3OriginSource: {
    //         s3BucketSource: testBucket,
    //       },
    //       behaviors: [{ isDefaultBehavior: true }],
    //     },
    //   ],
    // });
  }
}

module.exports = { CdkDeployStack };
