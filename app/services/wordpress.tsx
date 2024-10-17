// @ts-nocheck
/* eslint-disable */

/**
 * wordpress module
 * @description Wordpress CMS handling
 * @module wordpress
 * @author Tom Söderlund
 */

import { formatDate } from '../../lib/formatDate'
const { decode } = require('html-entities')

const WORDPRESS_BASE_URL = 'https://public-api.wordpress.com/rest/v1.1/sites/'
const WORDPRESS_SITE_ID = 'climatewiki.wordpress.com'
const POSTS_LIMIT = 100

// Private functions

const stripHtmlTags = str => str.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '')
const stripNewLines = str => str.replace(/\n/g, '')
const getFirstSentence = str => str.replace(/[!?:;(–]/g, '.').split('.')[0]

export interface WordpressCategory {
  ID: number
  description: string
  meta: {
    links: {
      self: string
      help: string
      site: string
    }
  }
  name: string
  parent: number
  post_count: number
  slug: string
}

export interface WordpressPost {
  ID: number
  slug: string
  title: string
  featured_image: string
  date: string
  description: string
  attachments: Record<string, any>
  categories: Record<string, WordpressCategory>
  tags: Record<string, any>
  sticky: boolean
  imageUrl: string | null
  bigImageUrl: string | null
  dateFormatted: string
}

const fixWordpressPost = post => {
  const title = decode(post.title)
  const description = stripNewLines(stripHtmlTags(decode(post.excerpt)))
  return {
    ...post,
    title: title || getFirstSentence(description),
    description,
    // category: Object.values(post.categories)[0]?.slug,
    date: new Date(post.date).toString(),
    dateFormatted: formatDate(new Date(post.date)),
    // url: getURL(post),
    imageUrl: post.featured_image || /* getAttachmentImages(post).medium || */ null,
    bigImageUrl: post.featured_image || getAttachmentImages(post).large || null
  }
}

// Returns { thumbnail, medium, large }
const getAttachmentImages = post => {
  const attachment0 = post.attachments && Object.values(post.attachments)[0]
  return (attachment0 !== undefined ? attachment0.thumbnails : {})
}

// Public API

export const getCategories = async function (): Promise<any[]> {
  const url = `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/categories`
  return await fetch(url) // eslint-disable-line no-undef
    .then(async res => await res.json())
    .then(res => res.categories.map(({ meta, feed_url, ...category }) => category)) // eslint-disable-line camelcase
}

export interface WordpressCategory {
  ID: number
  name: string
  slug: string
  description: string
  post_count: number
  feed_url: string
  parent: number
  meta: {
    links: {
      self: string
      help: string
      site: string
    }
  }
}

export const getCategoryDetails = async function (slug): Promise<WordpressCategory> {
  const url = `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/categories/slug:${slug}`
  return await fetch(url) // eslint-disable-line no-undef
    .then(async res => await res.json())
}

interface PostListOptions {
  fields?: string
  order?: string
  category?: string
  search?: string
}

export const getPostsList = async function (options: PostListOptions = {}): Promise<WordpressPost[]> {
  const { fields = 'ID,slug,title,featured_image,date,description,attachments,categories,tags,sticky' } = options
  const url = [
    `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/posts/?`,
    `fields=${fields as string}`,
    options.order !== undefined ? `&order_by=${options.order as string}&order=ASC` : '',
    options.category !== undefined ? `&category=${options.category as string}` : '',
    options.search !== undefined ? `&search=${options.search as string}` : '',
    `&number=${POSTS_LIMIT}`
  ].join('')
  return await fetch(url) // eslint-disable-line no-undef
    .then(async res => await res.json())
    .then(res => res.posts.map(fixWordpressPost))
}

export const getPostDetails = async function (slug, { fields = 'ID,slug,title,featured_image,date,excerpt,content,attachments,categories,tags,sticky' } = {}): Promise<WordpressPost> {
  const url = `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/posts/slug:${slug}?fields=${fields}`
  return await fetch(url) // eslint-disable-line no-undef
    .then(async res => await res.json())
    .then(res => res.error !== undefined ? undefined : fixWordpressPost(res))
}

export const getAllPosts = async function (options = {}): Promise<WordpressPost[]> {
  const categories = await getCategories()
  const articlePromiseArray = categories.map(async category => await getPostsList({ category: category.slug }))
  const articleArray = await Promise.all(articlePromiseArray)
  return articleArray.flat()
}

export const postPageProps = (post: WordpressPost): PageProps => ({
  title: post.title,
  description: post.description,
  imageUrl: post.imageUrl
})

export interface WordpressListPageProps {
  wordpressPosts?: WordpressPost[]
  title: string
  description: string
}
