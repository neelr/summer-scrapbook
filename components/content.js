// Credit to https://blog.rstankov.com/building-auto-link-component-in-react/
import { memo } from 'react'
import { last } from 'lodash'
import Mention from './mention'
import Emoji from './emoji'

export const formatText = text =>
  text
    .split(
      /(<.+?\|?\S+>)|(@\w+)|(`{3}[\S\s]+`{3})|(`[^`]+`)|(_[^_]+_)|(\*[^\*]+\*)|(:.+?\|?\S+:)/
    )
    .map((chunk, i) => {
      if (chunk?.startsWith(':')) {
        return <Emoji name={chunk} />
      }
      if (chunk?.startsWith('@')) {
        const username = chunk.replace('@', '')
        return <Mention username={username} key={username + i} />
      }
      if (chunk?.startsWith('<')) {
        const parts = chunk.match(/<((.+)\|)?(\S+)>/)
        const url = parts?.[2] || last(parts)
        const children = last(parts)
          ?.replace(/https?:\/\//, '')
          .replace(/\/$/, '')
        return (
          <a href={url} target="_blank" key={i}>
            {children}
          </a>
        )
      }
      if (chunk?.startsWith('```')) {
        return <pre key={i}>{chunk.replace(/```/g, '')}</pre>
      }
      if (chunk?.startsWith('`')) {
        return <code key={i}>{chunk.replace(/`/g, '')}</code>
      }
      if (chunk?.startsWith('*')) {
        return <strong key={i}>{chunk.replace(/\*/g, '')}</strong>
      }
      if (chunk?.startsWith('_')) {
        return <i key={i}>{chunk.replace(/_/g, '')}</i>
      }
      return chunk?.replace('&amp;', '&')
    })

const Content = memo(({ children }) => (
  <p className="post-text">{formatText(children)}</p>
))

export default Content
