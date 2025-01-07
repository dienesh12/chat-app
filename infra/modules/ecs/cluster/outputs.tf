output "cluster_name" {
  description = "Name of the ECS Cluster"
  value = aws_ecs_cluster.ecs_cluster.name
}

output "cluster_id" {
  description = "ID of the Cluster"
  value = aws_ecs_cluster.ecs_cluster.id
}