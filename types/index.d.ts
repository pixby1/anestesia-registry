// Type definitions for [tinytime] [0.2.6]
// Project: [Anestesia registry]
// Definitions by: [Markoz Peña Mendez] <[https://twitter.com/markdrew53]>

declare module 'tinytime' {
    interface TinyTime {
      render: (date: Date) => string
    }
    
    declare const tinytime: (
      template: string,
      options: TinyTimeOptions = {}
    ) => TinyTime
  
    export default tinytime
  }