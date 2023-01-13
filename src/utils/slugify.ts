import slugify from "slugify";

export const generateSlug = (name: string) => {
  return slugify(`${name}-${new Date().getTime()}`, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'en',
    trim: true
  })
}