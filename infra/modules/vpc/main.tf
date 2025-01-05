resource "aws_vpc" "this" {
  for_each = var.vpc
  
  cidr_block = each.value.cidr_block

  tags = merge(each.value.tags, {
    Name : each.key
  })
}