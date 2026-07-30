const Sticker = {
  "title": "sticker",
  "required": [
    "type",
    "url"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "sticker"
      ]
    },
    "url": {
      "type": "string",
      "examples": [
        "http://www.buildquickbots.com/whatsapp/stickers/SampleSticker01.webp"
      ]
    }
  },
  "x-readme-ref-name": "sticker"
} as const;
export default Sticker
