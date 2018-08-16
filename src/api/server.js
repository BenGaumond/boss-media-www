import { App } from '@benzed/app'
import * as services from './services'

import Website from '../ui/root'

/******************************************************************************/
// App
/******************************************************************************/

class BossMediaWwwServer extends App {

  services = services

  getClientComponent () {
    return Website
  }

}

/******************************************************************************/
// Exports
/******************************************************************************/

export default BossMediaWwwServer