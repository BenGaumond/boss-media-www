import App from '@benzed/app' // eslint-disable-line no-unused-vars
import { PlaylistService, VideoService } from './services'
import PopulateFromYoutube from './populate-from-youtube'

/* @jsx App.declareEntity */
/* eslint-disable react */

/******************************************************************************/
// Main
/******************************************************************************/

const BossMediaServer = ({ port, logging, youtube }) =>

  <app port={port} logging={logging}>

    <express />

    <PlaylistService />
    <VideoService />
    <PopulateFromYoutube youtube={youtube} />

    <express-error />

  </app>

/******************************************************************************/
// Exports
/******************************************************************************/

export default BossMediaServer
