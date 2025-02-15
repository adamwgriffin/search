'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

// We used styled-jsx in a few places but it no longer works well with the App
// Router unless we wrap all our components with a <StyledJsxRegistry> in the
// root layout. The jsx styles will not load on first render in dev for example.
// This is based on the example from the docs:
// https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-jsx
export default function StyledJsxRegistry({
  children
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state:
  // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
