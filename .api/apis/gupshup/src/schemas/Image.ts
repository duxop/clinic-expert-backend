const Image = {
  "title": "image",
  "required": [
    "type",
    "originalUrl",
    "previewUrl",
    "caption"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "image"
      ]
    },
    "originalUrl": {
      "type": "string",
      "examples": [
        "https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg"
      ]
    },
    "previewUrl": {
      "type": "string",
      "examples": [
        "https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg"
      ]
    },
    "caption": {
      "type": "string",
      "examples": [
        "Sample image"
      ]
    }
  },
  "x-readme-ref-name": "image"
} as const;
export default Image
