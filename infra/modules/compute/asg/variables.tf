variable "name_prefix" {
  description = "Enter the Prefix, end with an '_'."
  type = string
}

variable "vpc_zone_identifier" {
  description = "Enter Subnets."
  type = list(string)
}

variable "desired_capacity" {
  description = "Enter the Desired Capacity."
  type = number
  default = 1
}

variable "min_size" {
  description = "Enter the Min number of Instances."
  type = number
  default = 1
}

variable "max_size" {
  description = "Enter the Max number of Instances."
  type = number
  default = 1
}

variable "lt_id" {
  description = "Enter Launch Template ID."
  type = string
}

variable "tags" {
  description = "Enter Tags."
  type = map(object({
    key = string
    propagate_at_launch = string
    value = string
  }))
  default = {}
}