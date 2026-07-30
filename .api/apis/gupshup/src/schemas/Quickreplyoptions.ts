const Quickreplyoptions = {
  "title": "quickreplyoptions",
  "required": [
    "type",
    "title"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "text"
      ]
    },
    "title": {
      "type": "string",
      "examples": [
        "First"
      ]
    }
  },
  "x-readme-ref-name": "quickreplyoptions"
} as const;
export default Quickreplyoptions
