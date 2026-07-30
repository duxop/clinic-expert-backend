const Video = {
  "title": "video",
  "required": [
    "type",
    "url",
    "caption"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "video"
      ]
    },
    "url": {
      "type": "string",
      "examples": [
        "https://www.buildquickbots.com/whatsapp/media/sample/video/sample01.mp4"
      ]
    },
    "caption": {
      "type": "string",
      "examples": [
        "Sample video"
      ]
    }
  },
  "x-readme-ref-name": "video"
} as const;
export default Video
