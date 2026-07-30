import Quickreplyfilecontent from './Quickreplyfilecontent.js';
import Quickreplyoptions from './Quickreplyoptions.js';

const QuickReplyFile = {
  "title": "quickReplyFile",
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
    "content": Quickreplyfilecontent,
    "options": {
      "type": "array",
      "items": Quickreplyoptions,
      "description": ""
    }
  },
  "x-readme-ref-name": "quickReplyFile"
} as const;
export default QuickReplyFile
