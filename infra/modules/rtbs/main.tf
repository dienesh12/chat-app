resource "aws_route_table" "this" {
  for_each = var.rt
  vpc_id = var.vpc_id

  dynamic "route" {
    for_each = each.value.routes

    content {
      cidr_block = each.value.cidr_block
      gateway_id = each.value.gw_id
    }
  }

  tags = merge(each.value.tags, {
    Name : each.key
  })
}

resource "aws_route_table_association" "this" {
  for_each = var.associations
  
  subnet_id = each.value.subnet_id
  route_table_id = each.value.rt_id
}