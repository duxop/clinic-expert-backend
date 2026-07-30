import ListMessageOptionObject from './ListMessageOptionObject.js';

const LisMessageItemsObject = {
  "title": "lisMessageItemsObject",
  "required": [
    "title",
    "subtitle",
    "options"
  ],
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "examples": [
        "first Section"
      ]
    },
    "subtitle": {
      "type": "string",
      "examples": [
        "first Subtitle"
      ]
    },
    "options": {
      "type": "array",
      "items": ListMessageOptionObject,
      "description": ""
    }
  },
  "x-readme-ref-name": "lisMessageItemsObject"
} as const;
export default LisMessageItemsObject
