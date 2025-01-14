variable "lb" {
  description = "Enter Load Balancer Info."
  type = object({
    name = string
    internal = bool
    load_balancer_type = string
    security_groups = list(string)
    subnets = list(string)
    tags = optional(map(string), "")
  })
  default = {}
}

variable "tg" {
  description = "Enter Target Group Info."
  type = object({
    name = string
    port = number
    protocol = string
    target_type = string
    vpc_id = string
    interval = number
    timeout = number
    healthy_threshold = number
    unhealthy_threshold = number
  })
}

variable "listener" {
  description = "Enter Listener Info."
  type = object({
     port = number
     protocol = string
     type = string
  })
}