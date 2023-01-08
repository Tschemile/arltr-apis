import slugify from "slugify";

export const generateSlug = (name: string) => {
  return slugify(name, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'en',
    trim: true
  }) + new Date().toISOString()
}