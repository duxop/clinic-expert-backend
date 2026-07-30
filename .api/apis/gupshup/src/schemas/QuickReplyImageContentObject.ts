const QuickReplyImageContentObject = {
  "title": "quickReplyImageContentObject",
  "required": [
    "type",
    "url",
    "text",
    "caption"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "image/video"
      ]
    },
    "url": {
      "type": "string",
      "examples": [
        "https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg"
      ]
    },
    "text": {
      "type": "string",
      "examples": [
        "this is the body"
      ]
    },
    "caption": {
      "type": "string",
      "examples": [
        "this is the footer"
      ]
    }
  },
  "x-readme-ref-name": "quickReplyImageContentObject"
} as const;
export default QuickReplyImageContentObject
