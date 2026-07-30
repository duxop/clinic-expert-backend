const ListMessageGlobalButtonsObject = {
  "title": "listMessageGlobalButtonsObject",
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
        "Global button"
      ]
    }
  },
  "x-readme-ref-name": "listMessageGlobalButtonsObject"
} as const;
export default ListMessageGlobalButtonsObject
