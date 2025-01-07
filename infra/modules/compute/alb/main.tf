resource "aws_lb" "lb" {
 name               = var.lb.name
 internal           = var.lb.internal
 load_balancer_type = var.lb.load_balancer_type
 security_groups    = var.lb.security_groups
 subnets            = var.lb.subnets

 tags = merge(var.lb.tags, {
   Name = var.lb.name
 })
}

resource "aws_lb_target_group" "tg" {
 name        = var.tg.name
 port        = var.tg.port
 protocol    = var.tg.protocol
 target_type = var.tg.target_type
 vpc_id      = var.tg.vpc_id

 health_check {
   path = "/"
   interval = var.tg.interval
   timeout = var.tg.timeout
   healthy_threshold = var.tg.healthy_threshold
   unhealthy_threshold = var.tg.unhealthy_threshold
 }
}

resource "aws_lb_listener" "listener" {
 load_balancer_arn = aws_lb.lb.arn
 port              = var.listener.port
 protocol          = var.listener.protocol

 default_action {
   type             = var.listener.type
   target_group_arn = aws_lb_target_group.tg.arn
 }
}