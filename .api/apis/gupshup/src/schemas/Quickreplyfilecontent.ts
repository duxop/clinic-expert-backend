const Quickreplyfilecontent = {
  "title": "Quickreplyfilecontent",
  "required": [
    "type",
    "url",
    "text",
    "filename",
    "caption"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "file"
      ]
    },
    "url": {
      "type": "string",
      "examples": [
        "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf"
      ]
    },
    "text": {
      "type": "string",
      "examples": [
        "this is the body"
      ]
    },
    "filename": {
      "type": "string",
      "examples": [
        "Sample file"
      ]
    },
    "caption": {
      "type": "string",
      "examples": [
        "this is the footer"
      ]
    }
  },
  "x-readme-ref-name": "Quickreplyfilecontent"
} as const;
export default Quickreplyfilecontent
