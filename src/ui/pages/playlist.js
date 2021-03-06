import React from 'react'
import styled from 'styled-components'
import Page from './page'

import { Video } from '../components'

import { first } from '@benzed/array'
import { Flex, Modal, Slide, isMobile, Visible } from '@benzed/react'

import { Link } from 'react-router-dom'

import { MissingContainer } from './missing'

import { urlify, media, $16x9 } from '../util'
import $ from '../theme'

/******************************************************************************/
// Helper
/******************************************************************************/

function findVideo (nameOrId) {

  const playlist = this
  const { videos } = playlist

  const video = nameOrId && videos
    .filter(v => v.id === nameOrId || urlify(v.title) === nameOrId)
    ::first()

  return video || null
}

function navigateTo (base) {

  const history = this

  return e => {
    e.stopPropagation()
    history.push(`/${base}`)
  }

}

const biggestThumbnail = thumbnails => {

  const biggest = Object.values(thumbnails).reduce((big, thumb) =>
    big.width * big.height > thumb.width * thumb.height
      ? big
      : thumb
  )

  return biggest.url
}

/******************************************************************************/
// Move Me, this component will be reused TODO
/******************************************************************************/

const Title = styled.h4`

  background-color: ${$.theme.bg.fade(0.5)};
  padding: 0.4em;

  ${media.tablet.css`
    font-size: 85%;
  `}

  ${media.phone.css`
    font-size: 75%;
  `}

  transform: translate(0, ${props => props.shown ? 0 : -2}em);
  transition: transform 250ms;

`

const NoOverflowLink = styled(Link)`
  overflow: hidden;
`

const VideoLink = styled(({ prefix, video, size, playable, ...rest }) =>

  <Flex.Column items='center' {...rest}>

    <NoOverflowLink
      to={`/${prefix}/${urlify(video.title)}`}
      style={{
        backgroundImage: `url(${biggestThumbnail(video.thumbnails)})`
      }}
    >
      <Title shown={!playable}>{video.title}</Title>
    </NoOverflowLink>

    <Visible visible={playable}>
      <Video video={playable ? video : null} size={size} autoplay/>
    </Visible>

  </Flex.Column>

)`
  margin: 0.5em;
  position: relative;

  > a {
    ${props => $16x9(props.size, props.units)}
    text-decoration: none;
    background-size: cover;
    background-position: center;
  }

`

const Playlist = styled.div`

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  margin: calc(8vw + 1.5em) 1em 1em 1em;
`

/******************************************************************************/
// Main
/******************************************************************************/

const PlaylistPage = ({ playlist, match, location, history, ...props }) => {

  const { videoNameOrId = null } = match?.params || {}

  const video = playlist::findVideo(videoNameOrId)

  const base = urlify(playlist.title)
  const goBack = video
    ? history::navigateTo(base)
    : null

  const many = playlist?.videos.length > 10
  const size = many ? 1.25 : 2
  const showVideoModal = many && !isMobile() && !!video
  const showMissingModal = !video && !!videoNameOrId

  return <Slide from='right' to='top'>
    <Page title={playlist.title} >

      <Modal
        visible={showMissingModal}
        position='fixed'
        opacity={0.75}
        onClick={goBack}>

        <Slide from='bottom'>
          <MissingContainer>
            <p>"{videoNameOrId}" is not a {playlist.title} video.
              Go <Link to={`/${base}`}>back</Link>!
            </p>
          </MissingContainer>
        </Slide>

      </Modal>

      <Modal
        visible={showVideoModal}
        position='fixed'
        opacity={0.75}
        onClick={goBack}>

        <Slide from='0em 15em' to='0em -15em'>
          <Video video={video} size={2.25}/>
        </Slide>

      </Modal>

      <Playlist>
        {playlist?.videos.map(v =>
          <VideoLink
            key={v.id}
            prefix={base}
            video={v}
            size={size}
            playable={!showVideoModal && v.id === video?.id}
          />
        )}
      </Playlist>

    </Page>
  </Slide>

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default PlaylistPage
