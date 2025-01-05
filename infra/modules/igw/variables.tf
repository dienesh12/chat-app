variable "igw" {
  type = set(string)
  description = "Enter the Names of the Internet Gateway."
  default = []
}

variable "vpc" {
  type = string
  description = "Enter the Name of VPC."
  default = ""
}