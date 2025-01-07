variable "name_prefix" {
  description = "Enter Name Prefix."
  type = string
}

variable "image_id" {
  description = "Enter AMI ID."
  type = string
}

variable "instance_type" {
  description = "Enter Instance Type."
  type = string
}

variable "sg_ids" {
  description = "Enter List of Security Group ID's."
  type = list(string)
}

variable "key_name" {
  description = "Enter Key Name."
  type = string
}

variable "iam_instance_profile" {
  description = "Enter Instance Profile Name."
  type = string
}

variable "user_data" {
  description = "Enter User Data."
  type = string
}