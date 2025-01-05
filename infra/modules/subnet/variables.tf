variable "subnet" {
  description = "Enter info to create the Subnet."
  type = map(object({
    cidr_block = string
    availability_zone = string
    tags = optional(map(string), {})
  }))
  default = {}
}

variable "vpc_id" {
  description = "Enter VPC ID to create the Subnet."
  type = string
  default = ""
}