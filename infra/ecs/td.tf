resource "aws_ecs_task_definition" "backend-service" {
  family = "backend-service"
  container_definitions = jsonencode([
    {
      name      = "backend-service"
      image     = "058264220203.dkr.ecr.us-east-1.amazonaws.com/chatapp-backend"
      cpu       = 10
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 5005
          hostPort      = 5005
        }
      ]
    },
  ])
}

resource "aws_ecs_task_definition" "chat-service" {
  family = "chat-service"
  container_definitions = jsonencode([
    {
      name      = "chat-service"
      image     = "058264220203.dkr.ecr.us-east-1.amazonaws.com/socket-server"
      cpu       = 10
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 9000
          hostPort      = 9000
        }
      ]
    },
  ])
}