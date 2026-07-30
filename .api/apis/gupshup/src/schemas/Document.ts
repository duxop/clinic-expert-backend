const Document = {
  "title": "document",
  "required": [
    "type",
    "url",
    "filename"
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
    "filename": {
      "type": "string",
      "examples": [
        "Sample file"
      ]
    }
  },
  "x-readme-ref-name": "document"
} as const;
export default Document
