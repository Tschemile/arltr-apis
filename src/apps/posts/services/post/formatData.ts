import { Post, React } from "apps/posts/entities"

export const formatData = ({
  posts,
  reacts,
}: {
  posts: Post[],
  reacts: React[]
}) => {
  const formatData = []
  for (const post of posts) {
    const findReact = reacts.find((x) => x.post.id === post.id) || undefined
    formatData.push({
      ...post,
      react: findReact,
    })
  }

  return formatData
}