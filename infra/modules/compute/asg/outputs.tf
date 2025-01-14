output "asg_name" {
  description = "Name of the Auto Scaling Group."
  value = aws_autoscaling_group.asg.name
}

output "asg_id" {
  description = "ID of the Auto Scaling Group."
  value = aws_autoscaling_group.asg.id
}