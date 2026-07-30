import QuickReplyImageContentObject from './QuickReplyImageContentObject.js';
import Quickreplyoptions from './Quickreplyoptions.js';

const Quickreplyimage = {
  "title": "quickreplyimage",
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
    "content": QuickReplyImageContentObject,
    "options": {
      "type": "array",
      "items": Quickreplyoptions,
      "description": ""
    }
  },
  "x-readme-ref-name": "quickreplyimage"
} as const;
export default Quickreplyimage
