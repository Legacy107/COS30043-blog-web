export type Comment = {
  id: number
  postId: number
  userId: number
  content: string
  likes: number
  createAt: string
  liked?: boolean
}
