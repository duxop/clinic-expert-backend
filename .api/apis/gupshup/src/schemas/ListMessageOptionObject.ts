const ListMessageOptionObject = {
  "title": "listMessageOptionObject",
  "required": [
    "type",
    "title",
    "description",
    "postbackText"
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
        "section 1 row 1"
      ]
    },
    "description": {
      "type": "string",
      "examples": [
        "first row of first section description"
      ]
    },
    "postbackText": {
      "type": "string",
      "examples": [
        "section 1 row 1 postback payload"
      ]
    }
  },
  "x-readme-ref-name": "listMessageOptionObject"
} as const;
export default ListMessageOptionObject
