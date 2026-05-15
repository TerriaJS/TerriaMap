
# Build Docker Image : $(TAG)

```bash
  git clone -b easi-develop --depth 1 https://github.com/csiro-easi/TerriaMap.git
  cd TerriaMap
  docker build -t easi-terriamap .
```


# Push latest image to ECR Global (EASI-CSIRO)

- ECR Repository has to be created before push

```bash
export AWS_ACCESS_KEY_ID=$(AwsAccessKeyID)
export AWS_SECRET_ACCESS_KEY=$(AWSSecretAccessKey)
export AWS_SESSION_TOKEN=$(AWSSessionToken)

aws ecr get-login-password --region=ap-southeast-2 | docker login --username AWS --password-stdin 444488357543.dkr.ecr.ap-southeast-2.amazonaws.com
docker tag easi-terriamap:latest 444488357543.dkr.ecr.ap-southeast-2.amazonaws.com/easi-terriamap:$(TAG)
docker push 444488357543.dkr.ecr.ap-southeast-2.amazonaws.com/easi-terriamap:$(TAG)
```
