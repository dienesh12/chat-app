variable "rt" {
  description = "Enter the CIDR block and Route Table name in Map data type."
  type = map(object({
    tags = optional(map(string), {})
    routes = optional(list(object({
        cidr_block = string
        gw_id = string
    })), [])
  }))
  default = {}
}

variable "vpc_id" {
  description = "Enter the VPC ID in which you want to create the resource."
  type = string
  default = ""
}

variable "associations" {
  description = "Enter the Subnet ID and Route Table ID for route table association."
  type = map(object({
    subnet_id = string
    rt_id = string
  }))
  default = {}
}