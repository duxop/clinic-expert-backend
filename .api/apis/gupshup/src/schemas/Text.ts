const Text = {
  "title": "text",
  "required": [
    "type",
    "text"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "text"
      ]
    },
    "text": {
      "type": "string",
      "examples": [
        "Hello user, how are you?"
      ]
    }
  },
  "x-readme-ref-name": "text"
} as const;
export default Text
