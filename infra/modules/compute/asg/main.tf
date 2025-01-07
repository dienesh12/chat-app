resource "aws_autoscaling_group" "asg" {
  name_prefix = var.name_prefix
  vpc_zone_identifier = var.vpc_zone_identifier
  desired_capacity = var.desired_capacity
  min_size = var.min_size
  max_size = var.max_size

  launch_template {
    id = var.lt_id
  }

  dynamic "tag" {
    for_each = var.tags

    content {
      key = tag.value.key
      propagate_at_launch = tag.value.propagate_at_launch
      value = tag.value.value
    }
  }
}