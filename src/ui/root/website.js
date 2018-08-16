import React from 'react'
import styled from 'styled-components'

import Navigation from './navigation'
import Routes from './routes'
import { GlobalStyle } from '@benzed/react'

import { theme } from '../theme'

/******************************************************************************/
// Styles
/******************************************************************************/

const WebsiteLayout = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: row;
`

/******************************************************************************/
// Main
/******************************************************************************/

const Website = () =>
  <GlobalStyle theme={theme}>
    <WebsiteLayout>
      <Routes />
      <Navigation />
    </WebsiteLayout>
  </GlobalStyle>

/******************************************************************************/
// Exports
/******************************************************************************/

export default Website