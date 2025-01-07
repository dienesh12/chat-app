resource "aws_security_group" "this" {
  for_each = var.sg

  name = each.key
  description = each.value.description
  vpc_id = each.value.vpc_id

  tags = merge(each.value.tags, {
    Name = each.key
  })
}