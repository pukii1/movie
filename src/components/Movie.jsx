import React from 'react'

export default function Movie({data, idx}) {
  return (
    <div>
      <p>{data.originalTitleText.text}</p>
    </div>
  )
}
