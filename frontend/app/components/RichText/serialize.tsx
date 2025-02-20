/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { Text } from 'slate'
import { Image } from '~/components/Image'
import type { Media, Page } from '@/payload-types'
import classes from './index.module.css'

// eslint-disable-next-line no-use-before-define
type Children = Leaf[]

type Leaf = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Children
  url?: string
  [key: string]: unknown
  doc?: any
}

const serialize = (children: Children): React.ReactElement[] =>
  children.map((node, i) => {
    if (Text.isText(node)) {
      // escape text and convert line breaks to <br />
      const escapedText = escapeHTML(node.text).replace(/(\r\n|\n|\r)/gm, '<br />')
      let text = <span dangerouslySetInnerHTML={{ __html: escapedText }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      if (node.underline) {
        text = (
          <span style={{ textDecoration: 'underline' }} key={i}>
            {text}
          </span>
        )
      }

      if (node.strikethrough) {
        text = (
          <span style={{ textDecoration: 'line-through' }} key={i}>
            {text}
          </span>
        )
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return <></>
    }

    switch (node.type) {
      case 'h1':
        return <h1 key={i}>{serialize(node.children as Children)}</h1>
      case 'h2':
        return <h2 key={i}>{serialize(node.children as Children)}</h2>
      case 'h3':
        return <h3 key={i}>{serialize(node.children as Children)}</h3>
      case 'h4':
        return <h4 key={i}>{serialize(node.children as Children)}</h4>
      case 'h5':
        return <h5 key={i}>{serialize(node.children as Children)}</h5>
      case 'h6':
        return <h6 key={i}>{serialize(node.children as Children)}</h6>
      case 'quote':
        return <blockquote key={i}>{serialize(node.children as Children)}</blockquote>
      case 'ul':
        return <ul key={i}>{serialize(node.children as Children)}</ul>
      case 'ol':
        return <ol key={i}>{serialize(node.children as Children)}</ol>
      case 'li':
        return <li key={i}>{serialize(node.children as Children)}</li>
      case 'link':
        const target = node.newTab ? '_blank' : '_self'
        // treat internal links
        if (node.linkType === 'internal') {
          if (node.doc.relationTo === 'pages') {
            const page: Page = node.doc.value
            return (
              <a key={i} href={`/${page?.slug}`} target={target}>
                {serialize(node.children as Children)}
              </a>
            )
          }
          return <span key={i}>{serialize(node.children as Children)}</span>
        }
        return (
          <a key={i} href={escapeHTML(node.url ?? '')} target={target}>
            {serialize(node.children as Children)}
          </a>
        )
      case 'upload':
        return (
          <div className={classes.imageWrapper} key={i}>
            <Image
              media={node.value as Media}
              sizes="100vw"
              srcSet={[
                {
                  options: { width: 2560 },
                  size: '2560w',
                },
                {
                  options: { width: 1920 },
                  size: '1920w',
                },
                {
                  options: { width: 1280 },
                  size: '1280w',
                },
                {
                  options: { width: 960 },
                  size: '960w',
                },
                {
                  options: { width: 640 },
                  size: '640w',
                },
              ]}
            />
          </div>
        )

      default:
        return (
          <p key={i} style={{ minHeight: '1em' }}>
            {serialize(node.children as Children)}
          </p>
        )
    }
  })

export default serialize
