variable "sg" {
  description = "Enter the security Groups."
  type = map(object({
    description = optional(string, "")
    vpc_id = string
    tags = optional(map(string), "")
  }))
  default = {}
}