terraform {
  backend "s3" {
    bucket = "my-chat-app-bucket"
    key    = "chat-app/terraform.tfstate"
    region = "us-east-1"
  }
}