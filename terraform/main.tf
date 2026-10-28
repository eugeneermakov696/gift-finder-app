module "vpc" {
    source = "terraform-aws-modules/vpc/aws"
    version = "~> 6.0"

    name = "${var.cluster_name}-vpc"
    cidr = var.vpc_cidr

    azs = [
        "eu-central-1a",
        "eu-central-1b",
    ]

    public_subnets  = [
        "10.0.1.0/24",
        "10.0.2.0/24"
    ]

    private_subnets = [
        "10.0.11.0/24",
        "10.0.12.0/24"
    ]

    enable_nat_gateway = true
    single_nat_gateway = true

    enable_dns_support   = true
    enable_dns_hostnames = true

    public_subnet_tags = {
        "kubernetes.io/role/elb" = "1"
    }

    private_subnet_tags = {
        "kubernetes.io/role/internal-elb" = "1"
    }
}