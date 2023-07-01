import React from 'react'

export default function MovieSelection({mediaType, popular}) {
    return (
    <div>
      Show popular {mediaType ? 'movies' : 'tv shows'}? {popular ? 'true': 'false'}
    </div>
  )
}
