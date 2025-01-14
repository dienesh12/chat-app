variable "ingress_rule" {
  description = "Enter the Ingress Rule."
  type = map(object({
    sg_id = string
    cidr_ipv4 = string
    from_port = number
    ip_protocol = string
    to_port = number
  }))
  default = {}
}