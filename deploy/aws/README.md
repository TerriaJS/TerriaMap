# TerriaMap CloudFormation Stack

## Prerequisites

### awscli

Deploying requires a recent version of `awscli`. It's recommended to install and maintain this using `pip` as the Homebrew and Ubuntu packages are quite old.

```sh
pip install awscli
```

### AWS credentials

You must have an `awscli` configuration profile (in `~/.aws/config`) with a name that matches `awsProfile` in `package.json`. e.g.

```
[profile terria]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

## package.json

Various parameters controlling AWS deployment are specified in `package.json`. They are:

- `awsProfile` - The AWS profile to use (see AWS credentials above) when interacting with AWS.
- `awsS3PackagesPath` - The S3 path to which to copy the deployment .tar.gz.
- `awsRegion` - The AWS region in which to create resources.
- `awsEc2InstanceType` - The type of EC2 instance to use.
- `awsEc2ImageId` - The ID of the EC2 image to use.
- `awsKeyName` - The name of a key that may be used to SSH to the EC2 instance.
- `awsS3ServerConfigOverridePath` - The path to a file on S3 containing any overrides to `devserverconfig.json`.
- `awsS3ClientConfigOverridePath` - The path to a file on S3 containing any overrides to `wwwroot/config.json`.

You can customize these settings by changing `package.json`, or by using `npm config` to override the setting locally, for example;

```
npm config set terriajs-map:awsProfile myprofilename
```

## Deploy

Prior to deploying, please tag the release, e.g.

```
git tag -a 2016-05-17 -m '2016-05-17 release'
git push origin 2016-05-17
```

Deployment is initiated via `npm` scripts. A full production deployment may be initiated with:

```
yarn deploy
```

Once the stack starts up, it will be available at `terriajs-map-2016-05-17.terria.io`, where `terriajs-map` is the name of the project in `package.json` and `2016-05-17` is the output of `git describe` (that's why you should tag before starting a deployment).

The following npm scripts are available:

- `deploy` - Removes the `node_modules` directory, runs `npm install`, and launches the `deploy-without-reinstall` script.
- `deploy-without-reinstall` - Runs `gulp clean` (which removes the `wwwroot/build` directory) and `gulp release`, and then launches the `deploy-current` script.
- `deploy-current` - Gets the two configuration override files specified in package.json from S3, builds a package (.tar.gz), uploads it to S3, and spins up a CloudFormation stack.

The CloudFormation stack has the following AWS resources:

- Elastic Load Balancer
- EC2 Security Group
- Auto Scaling Group
- Launch Configurartion
- Route 53 Record Set

Instances in the Auto Scaling group are bootstrapped using the supplied `user-data` file.

The process of starting a new stack takes about 5 minutes but it can take a further 15 minutes for the DNS to propagate.

### Test stack

Each stack is automatically assigned its own URL based on the name of the stack. e.g.

```
https://terriajs-map-2016-05-17.terria.io/
```

### Update DNS alias

Once you're satisfied the release is working, change the staging environment DNS record to point to the new stack using the Route 53 Console.

```
map.terria.io -> terriajs-map-2016-05-17.terria.io
```

### Troubleshooting

The default Mac OS `tar` command [causes trouble](http://superuser.com/questions/318809/linux-os-x-tar-incompatibility-tarballs-created-on-os-x-give-errors-when-unt). You'll need to replace it with `gtar`, eg. using homebrew.
