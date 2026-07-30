import Content from './Content.js';
import Quickreplyoptions from './Quickreplyoptions.js';

const Quickreply = {
  "title": "Quickreply",
  "required": [
    "type",
    "msgid",
    "content",
    "options"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "quick_reply"
      ]
    },
    "msgid": {
      "type": "string",
      "examples": [
        "qr1"
      ]
    },
    "content": Content,
    "options": {
      "type": "array",
      "items": Quickreplyoptions,
      "description": ""
    }
  },
  "x-readme-ref-name": "Quickreply"
} as const;
export default Quickreply
