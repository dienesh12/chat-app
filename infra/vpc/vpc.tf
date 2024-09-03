resource "aws_vpc" "chat_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    "Name" = "chat_vpc"
  }
}