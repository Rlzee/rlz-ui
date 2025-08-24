declare module 'react-syntax-highlighter' {
  import * as React from 'react';

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    children?: string;
    showLineNumbers?: boolean;
    customStyle?: React.CSSProperties;
    codeTagProps?: React.HTMLAttributes<HTMLElement>;
    wrapLines?: boolean;
    wrapLongLines?: boolean;
    lineProps?: (lineNumber: number) => React.HTMLAttributes<HTMLElement>;
  }

  export class Prism extends React.Component<SyntaxHighlighterProps> {}
  export class Light extends React.Component<SyntaxHighlighterProps> {}
  export class PrismLight extends React.Component<SyntaxHighlighterProps> {}
  export class LightAsync extends React.Component<SyntaxHighlighterProps> {}
  export class PrismAsyncLight extends React.Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const oneDark: any;
  export const oneLight: any;
}
