/* eslint-disable react/no-array-index-key */
import React, { Fragment } from 'react';
import { escape } from "html-escaper";
import { Text } from 'slate';
import { Image } from '~/components/Image';
import type { Media } from 'payload/generated-types';
import classes from './index.module.css';

// eslint-disable-next-line no-use-before-define
type Children = Leaf[];

type Leaf = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Children
  url?: string
  [key: string]: unknown
};

const serialize = (children: Children): React.ReactElement[] => children.map((node, i) => {
  if (Text.isText(node)) {
    let text = <span dangerouslySetInnerHTML={{ __html: escape(node.text) }} />;

    if (node.bold) {
      text = (
        <strong key={i}>
          {text}
        </strong>
      );
    }

    if (node.code) {
      text = (
        <code key={i}>
          {text}
        </code>
      );
    }

    if (node.italic) {
      text = (
        <em key={i}>
          {text}
        </em>
      );
    }

    if (node.underline) {
      text = (
        <span
          style={{ textDecoration: 'underline' }}
          key={i}
        >
          {text}
        </span>
      );
    }

    if (node.strikethrough) {
      text = (
        <span
          style={{ textDecoration: 'line-through' }}
          key={i}
        >
          { text}
        </span>
      );
    }

    return (
      <Fragment key={i}>
        {text}
      </Fragment>
    );
  }

  if (!node) {
    return (<></>);
  }

  switch (node.type) {
    case 'h1':
      return (
        <h1 key={i}>
          {serialize(node.children as Children)}
        </h1>
      );
    case 'h2':
      return (
        <h2 key={i}>
          {serialize(node.children as Children)}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={i}>
          {serialize(node.children as Children)}
        </h3>
      );
    case 'h4':
      return (
        <h4 key={i}>
          {serialize(node.children as Children)}
        </h4>
      );
    case 'h5':
      return (
        <h5 key={i}>
          {serialize(node.children as Children)}
        </h5>
      );
    case 'h6':
      return (
        <h6 key={i}>
          {serialize(node.children as Children)}
        </h6>
      );
    case 'quote':
      return (
        <blockquote key={i}>
          {serialize(node.children as Children)}
        </blockquote>
      );
    case 'ul':
      return (
        <ul key={i}>
          {serialize(node.children as Children)}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i}>
          {serialize(node.children as Children)}
        </ol>
      );
    case 'li':
      return (
        <li key={i}>
          {serialize(node.children as Children)}
        </li>
      );
    case 'link':
      return (
        <a
          href={escape(node.url ?? '')}
          key={i}
        >
          {serialize(node.children as Children)}
        </a>
      );
    case 'upload':
      return (
        <div className={classes.imageWrapper} key={i}>
          <Image
            image={node.value as Media}
            responsive={[
              { size: 'header-landscape-2560w', screenWidth: 2560, renderedWidth: '70vw' },
              { size: 'header-landscape-1024w', screenWidth: 1024, renderedWidth: '70vw' },
              { size: 'header-square-768w', screenWidth: 768, renderedWidth: '768px' },
              { size: 'header-square-512w', screenWidth: 512, renderedWidth: '512px' },
            ]}
          />
        </div>
      );

    default:
      console.log('node', node);
      return (
        <p key={i} style={{minHeight: '1em'}}>
          {serialize(node.children as Children)}
        </p>
      );
  }
});

export default serialize;
