import React from 'react'

const DEBUG = false //process.env.NODE_ENV === 'development'

if (DEBUG) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  })
}
