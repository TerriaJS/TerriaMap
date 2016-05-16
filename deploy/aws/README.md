# National Map CloudFormation Stack

## Prerequisites

### awscli

You require a recent version of `awscli`. It's recommended to install and maintain this using `pip` as the Homebrew and Ubuntu packages are quite old.

```sh
pip install awscli
```

### aws credentials

You must have an `awscli` configuration profile (in `~/.aws/config`) named `nationalmap` with your credentials. e.g.

```
[profile nationalmap]
aws_access_key_id=YOUR_ACCESS_KEY
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

### Release tarball on S3

The new release tarball needs to be copied to the `nationalmap-apps` S3 bucket in the `nationalmap` directory, e.g.

```
s3://nationalmap-apps/nationalmap/natmap-2016-01-15.tar.gz
```

## Deployment Process

### Update User Data

Update the `user-data` file as required. Typically you just need to update all occurences of the release version, e.g.

```
natmap-2015-12-15 -> natmap-2016-01-15
```

### Create Stack

We use the following naming convention for stacks nm-TAG, e.g.

```
nm-2015-11-16b
nm-2015-12-15
nm-2016-01-15
```

The `stack` script creates a new CloudFormation stack with the following AWS resources:

  - Elastic Load Balancer
  - EC2 Security Group
  - Auto Scaling Group
  - Launch Configurartion
  - Route 53 Record Set

Instances in the Auto Scaling group are bootstrapped using the supplied `user-data` file.

Create a new stack:

```
./stack create nm-2016-01-15
```

This process takes about 5 minutes but it can take a further 15 minutes for the DNS to propagate.

### Test stack

Each stack is automatically assigned its own URL based on the name of the stack. e.g.

```
http://nm-2016-01-15.nationalmap.nicta.com.au/
```

### Update DNS alias

Once you're satisfied the release is working, change the staging environment DNS record to point to the new stack using the Route 53 Console.


```
staging.nationalmap.nicta.com.au -> nm-2016-01-15.nationalmap.nicta.com.au
```
