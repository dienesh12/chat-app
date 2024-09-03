resource "aws_subnet" "chat_public_subnet" {
  vpc_id = aws_vpc.chat_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    "Name" = "chat_public_subnet"
  }

  depends_on = [ aws_vpc.chat_vpc ]
}

resource "aws_subnet" "chat_private_subnet1" {
  vpc_id = aws_vpc.chat_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "us-east-1a"

  tags = {
    "Name" = "chat_private_subnet1"
  }

  depends_on = [ aws_vpc.chat_vpc ]
}

resource "aws_subnet" "chat_private_subnet2" {
  vpc_id = aws_vpc.chat_vpc.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "us-east-1b"

  tags = {
    "Name" = "chat_private_subnet2"
  }

  depends_on = [ aws_vpc.chat_vpc ]
}