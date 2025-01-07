variable "egress_rule" {
  description = "Enter the Egress Rule."
  type = map(object({
    sg_id = string
    cidr_ipv4 = string
    from_port = string
    ip_protocol = string
    to_port = string
  }))
  default = {}
}