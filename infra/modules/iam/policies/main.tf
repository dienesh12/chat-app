resource "aws_iam_policy" "this" {
  for_each = var.policy

  name = each.key
  policy = each.value.policy
}