resource "aws_internet_gateway" "igw_chat" {
  vpc_id = aws_vpc.chat_vpc.id

  tags = {
    "Name" = "igw_chat"
  }

  depends_on = [ aws_vpc.chat_vpc ]
}