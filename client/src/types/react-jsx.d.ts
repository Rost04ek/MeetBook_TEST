/// <reference types="react" />
declare global {
  namespace JSX {
    type Element = import('react').ReactElement
    interface IntrinsicElements {
      [elemName: string]: unknown
    }
  }
}

export {}
