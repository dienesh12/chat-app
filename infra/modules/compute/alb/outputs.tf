output "lb" {
  description = "Load Balancer Name."
  value = aws_lb.lb.name
}

output "lb_url" {
  description = "Load Balancer URL."
  value = aws_lb.lb.dns_name
}