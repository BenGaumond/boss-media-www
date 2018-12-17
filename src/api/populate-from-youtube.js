import fetch from 'isomorphic-fetch'
import is from 'is-explicit'

/******************************************************************************/
// Helper
/******************************************************************************/

const YTAPIURL = 'https://www.googleapis.com/youtube/v3/'
const MAX_RESULTS = 50

/******************************************************************************/
// Youtube Api
/******************************************************************************/

class YoutubeApi {

  constructor (config) {
    this.apiKey = config.api_key
    this.userName = config.user_name
  }

  async getChannelAndUploads () {

    const res = await fetch(
      `${YTAPIURL}channels` +
      `?part=contentDetails` +
      `&forUsername=${this.userName}` +
      `&key=${this.apiKey}`
    )

    const json = await res.json()
    const [ item ] = json.items || []

    const channelId = item?.id || null
    const uploadPlaylistId = item?.contentDetails?.relatedPlaylists?.uploads

    return [ channelId, uploadPlaylistId ]
  }

  async getPlaylists (channelId) {

    const res = await fetch(
      `${YTAPIURL}playlists` +
      `?part=snippet` +
      `&channelId=${channelId}` +
      `&maxResults=${MAX_RESULTS}` +
      `&key=${this.apiKey}`
    )

    const json = await res.json()
    const playlists = []

    for (const item of json.items || []) playlists.push({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails,
      videos: await this.getPlaylistItemsIds(item.id)
    })

    return playlists
  }

  async getVideos (playlistId, pageToken = null) {

    const videoIds = await this.getPlaylistItemsIds(playlistId)

    const res = await fetch(
      `${YTAPIURL}videos` +
      `?part=snippet` +
      `&id=${videoIds}` +
      `&maxResults=${MAX_RESULTS}` +
      `&key=${this.apiKey}`
    )

    const json = await res.json()

    const videos = (json.items || []).map(item => ({

      id: item.id,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnails: item.snippet?.thumbnails,
      position: item.snippet?.position,
      published: new Date(item.snippet?.publishedAt),
      meta: this.parseTags(item.snippet?.tags)

    }))

    return videos

  }

  parseTags (tags = []) {

    const tagreg = /^\([A-Za-z0-9]+\)/

    const metaData = tags.reduce((meta, tag) => {

      const match = tag.match(tagreg)
      if (match) {

        const value = tag.replace(tagreg, '').trim()
        const key = match[0]
          // remove brackets
          .replace(/\(|\)/g, '')

          // really expensive way to make sure the first character is lower case
          .split('')
          .map((char, i) => i === 0 ? char.toLowerCase() : char)
          .join('')

        meta[key] = meta[key] || []
        meta[key].push(value)
      }

      return meta

    }, {})

    return Object.keys(metaData).length > 0
      ? metaData
      : null

  }

  async getPlaylistItemsIds (playlistId, pageToken = null) {

    const res = await fetch(
      `${YTAPIURL}playlistItems` +
      `?part=contentDetails` +
      `&playlistId=${playlistId}` +
      `&maxResults=${MAX_RESULTS}` +
      (pageToken ? `&pageToken=${pageToken}` : '') +
      `&key=${this.apiKey}`
    )

    const json = await res.json()

    const videos = (json.items || []).map(item => item.contentDetails?.videoId)

    if (json.nextPageToken)
      videos.push(...(await this.getPlaylistItemsIds(playlistId, json.nextPageToken)))

    return videos
  }

}
/******************************************************************************/
// Main

/******************************************************************************/

const PopulateFromYoutube = props => {

  const { youtube: config } = props

  const api = new YoutubeApi(config)

  return async app => {

    try {

      const [ channelId, uploadPlaylistId ] = await api.getChannelAndUploads()

      const videos = await api.getVideos(uploadPlaylistId)

      await app.service('videos').create(videos)

      const playlists = await api.getPlaylists(channelId)
      await app.service('playlists').create(playlists)

      app.log`${videos.length} videos fetched from youtube`
      app.log`${playlists.length} playlists fetched from youtube`

    } catch (err) {

      app.log`information could not be fetched from youtube: ${err.message}`
    }

  }
}
/******************************************************************************/
// Exports

/******************************************************************************/

export default PopulateFromYoutube
