provider "aws" {
    region = var.aws_region

    default_tags {
        tags = {
            Project = "gift-finder"
            Environment = var.environment
            ManagedBy = "Terraform"
        }
    }
}