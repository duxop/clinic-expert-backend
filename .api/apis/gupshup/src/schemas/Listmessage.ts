import LisMessageItemsObject from './LisMessageItemsObject.js';
import ListMessageGlobalButtonsObject from './ListMessageGlobalButtonsObject.js';

const Listmessage = {
  "title": "listmessage",
  "required": [
    "type",
    "title",
    "body",
    "msgid",
    "globalButtons",
    "items"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "list"
      ]
    },
    "title": {
      "type": "string",
      "examples": [
        "title text"
      ]
    },
    "body": {
      "type": "string",
      "examples": [
        "body text"
      ]
    },
    "msgid": {
      "type": "string",
      "examples": [
        "list1"
      ]
    },
    "globalButtons": {
      "type": "array",
      "items": ListMessageGlobalButtonsObject,
      "description": "Global buttons array description"
    },
    "items": {
      "type": "array",
      "items": LisMessageItemsObject,
      "description": "Items array description"
    }
  },
  "x-readme-ref-name": "listmessage"
} as const;
export default Listmessage
