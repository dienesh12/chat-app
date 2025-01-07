resource "aws_vpc_security_group_ingress_rule" "this" {
  for_each = var.ingress_rule

  security_group_id = each.value.sg_id
  cidr_ipv4 = each.value.cidr_ipv4
  from_port = each.value.from_port
  ip_protocol = each.value.ip_protocol
  to_port = each.value.to_port
}