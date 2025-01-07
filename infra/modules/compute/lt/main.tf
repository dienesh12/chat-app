resource "aws_launch_template" "lt" {
  name_prefix = var.name_prefix
  image_id = var.instance_type
  instance_type = var.instance_type
  
  key_name = var.key_name
  vpc_security_group_ids = var.sg_ids
  iam_instance_profile {
    name = var.iam_instance_profile
  }

  user_data = var.user_data
}