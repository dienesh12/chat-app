resource "aws_subnet" "this" {
  for_each = var.subnet
  
  vpc_id = var.vpc_id
  cidr_block = each.value.cidr_block
  availability_zone = each.value.availability_zone

  tags = merge(each.value.tags, {
    Name : each.key
  })
}