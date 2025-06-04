resource "aws_ecs_task_definition" "backend-service" {
  family = var.family
  network_mode = var.vpc_name
  execution_role_arn = var.execution_role_arn
  container_definitions = jsonencode([
    {
      name      = var.name
      image     = var.image
      cpu       = var.cpu
      memory    = var.memory
      essential = true
      environment = var.env_vars
      portMappings = var.port_mappings
    }
  ])
}