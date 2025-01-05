resource "aws_internet_gateway" "this" {
  for_each = var.igw
  vpc_id = aws_vpc.chat_vpc.id

  tags = {
    "Name" = each.key
  }
}