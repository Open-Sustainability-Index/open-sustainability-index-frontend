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

const fixWordpressPost = post => {
  const title = decode(post.title)
  const description = stripNewLines(stripHtmlTags(decode(post.description)))
  return {
    ...post,
    title: title || getFirstSentence(description),
    description,
//    category: Object.values(post.categories)[0]?.slug,
    date: new Date(post.date).toString(),
    dateFormatted: formatDate(new Date(post.date)),
    // url: getURL(post),
    articleImage: post.featured_image || getAttachmentImages(post).medium || null,
    bigImageUrl: post.featured_image || getAttachmentImages(post).large || null
  }
}

// Returns { thumbnail, medium, large }
const getAttachmentImages = post => {
  const attachment0 = post.attachments && Object.values(post.attachments)[0]
  return (attachment0 ? attachment0.thumbnails : {})
}

// Public API

export const getCategories = function () {
  const url = `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/categories`
  return fetch(url) // eslint-disable-line no-undef
    .then(res => res.json())
    .then(res => res.categories.map(({ meta, feed_url, ...category }) => category)) // eslint-disable-line camelcase
}

export const getCategoryDetails = function (slug) {
  const url = `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/categories/slug:${slug}`
  return fetch(url) // eslint-disable-line no-undef
    .then(res => res.json())
}

export const getPostsList = function (options = {}) {
  const { fields = 'ID,slug,title,featured_image,date,description,attachments,categories,tags,sticky' } = options
  const url = [
    `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/posts/?`,
    `fields=${fields}`,
    options.order ? `&order_by=${options.order}&order=ASC` : '',
    options.category ? `&category=${options.category}` : '',
    options.search ? `&search=${options.search}` : '',
    `&number=${POSTS_LIMIT}`
  ].join('')
  return fetch(url) // eslint-disable-line no-undef
    .then(res => res.json())
    .then(res => res.posts.map(fixWordpressPost))
}

export const getPostDetails = function (slug, { fields = 'ID,slug,title,featured_image,date,description,content,attachments,categories,tags,sticky' } = {}) {
  const url = `${WORDPRESS_BASE_URL}${WORDPRESS_SITE_ID}/posts/slug:${slug}?fields=${fields}`
  return fetch(url) // eslint-disable-line no-undef
    .then(res => res.json())
    .then(res => res.error ? undefined : fixWordpressPost(res))
}

export const getAllPosts = async function (options = {}) {
  const categories = await getCategories()
  const articlePromiseArray = categories.map(category => getPostsList({ category: category.slug }))
  const articleArray = await Promise.all(articlePromiseArray)
  return articleArray.flat()
}
