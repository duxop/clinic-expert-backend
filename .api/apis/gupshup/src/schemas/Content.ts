const Content = {
  "title": "Content",
  "required": [
    "type",
    "header",
    "text",
    "caption"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "text"
      ]
    },
    "header": {
      "type": "string",
      "examples": [
        "this is the header"
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
  "x-readme-ref-name": "Content"
} as const;
export default Content
