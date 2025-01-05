variable "vpc" {
  description = "Enter info to create VPC."
  type = map(object({
    cidr_block = string
    tags = optional(map(string), {})
  }))
  default = {}
}