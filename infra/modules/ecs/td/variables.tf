variable "family" {
  type = string
  description = "Name of the Service"
}

variable "vpc_name" {
  type = string
  description = "Name of the VPC to deploy"
}

variable "execution_role_arn" {
  type = string
  description = "ARN of the Role to be used"
}

variable "name" {
  type = string
  description = "Name of the Container"
}

variable "image" {
  type = string
  description = "Image Name"
}

variable "env_vars" {
  type = list(object({
    name  = string
    value = string
  }))
  description = "Environment variables for the service"
  default = []
}

variable "port_mappings" {
  type = list(object({
    containerPort = number
    hostPort = number
  }))
}

variable "cpu" {
  type = number
  description = "CPU allocated to service"
}

variable "memory" {
  type = number
  description = "Memory allocated to service"
}