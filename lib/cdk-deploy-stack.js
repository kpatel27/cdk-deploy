const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");

class CdkDeployStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "testing-jade-20", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });
  }
}

module.exports = { CdkDeployStack };
