resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.chat_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw_chat.id
  }

  tags = {
    "Name" = "chat_public_rt"
  }

  depends_on = [ aws_internet_gateway.igw_chat ]
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.chat_vpc.id

  tags = {
    "Name" = "chat_private_rt"
  }
}

resource "aws_route_table_association" "public_subnet_rtb_association" {
  subnet_id = aws_subnet.chat_public_subnet.id
  route_table_id = aws_route_table.public_rt.id

  depends_on = [
    aws_subnet.chat_public_subnet,
    aws_route_table.public_rt
  ]
}

resource "aws_route_table_association" "private_subnet_rtb_association1" {
  subnet_id = aws_subnet.chat_private_subnet1.id
  route_table_id = aws_route_table.private_rt.id

  depends_on = [
    aws_subnet.chat_private_subnet1,
    aws_route_table.private_rt
  ]
}

resource "aws_route_table_association" "private_subnet_rtb_association2" {
  subnet_id = aws_subnet.chat_private_subnet2.id
  route_table_id = aws_route_table.private_rt.id

  depends_on = [
    aws_subnet.chat_private_subnet2,
    aws_route_table.private_rt
  ]
}