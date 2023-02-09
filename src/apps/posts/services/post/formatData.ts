import { Post, React, Tag } from "apps/posts/entities"

export const formatData = ({
  posts,
  reacts,
  tags,
}: {
  posts: Post[],
  reacts: React[],
  tags: Tag[],
}) => {
  const formatData = []

  for (const post of posts) {
    const findReact = reacts.find((x) => x.post.id === post.id) || undefined
    const findTags = tags.filter((x) => x.post.id === post.id) || []

    formatData.push({
      ...post,
      react: findReact,
      tags: findTags.map((x) => x.user),
    })
  }

  return formatData
}