const Urlobject = {
  "title": "Urlobject",
  "required": [
    "url",
    "type"
  ],
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "examples": [
        "https://www.gupshup.io"
      ]
    },
    "type": {
      "type": "string",
      "examples": [
        "WORK"
      ]
    }
  },
  "x-readme-ref-name": "Urlobject"
} as const;
export default Urlobject
