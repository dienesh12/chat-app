resource "aws_iam_role" "this" {
  for_each = var.role

  name = each.key
  assume_role_policy = each.value.assume_role_policy
}