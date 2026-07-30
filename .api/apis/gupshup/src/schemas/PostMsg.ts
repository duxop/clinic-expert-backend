import Contact from './Contact.js';
import Document from './Document.js';
import Image from './Image.js';
import Listmessage from './Listmessage.js';
import Locationmessage from './Locationmessage.js';
import QuickReplyFile from './QuickReplyFile.js';
import Quickreply from './Quickreply.js';
import Quickreplyimage from './Quickreplyimage.js';
import Sticker from './Sticker.js';
import Text from './Text.js';
import Video from './Video.js';

const PostMsg = {
  "formData": {
    "required": [
      "channel",
      "source",
      "destination",
      "message",
      "src.name"
    ],
    "type": "object",
    "properties": {
      "channel": {
        "type": "string",
        "description": "The channel for sending messages.",
        "examples": [
          "whatsapp"
        ]
      },
      "source": {
        "type": "integer",
        "format": "int64",
        "description": "Registered WhatsApp Business API phone number",
        "examples": [
          917472850482
        ]
      },
      "destination": {
        "type": "integer",
        "format": "int64",
        "description": "User's phone number",
        "examples": [
          918748133759
        ]
      },
      "message": {
        "type": "object",
        "oneOf": [
          Text,
          Image,
          Document,
          Video,
          Sticker,
          Listmessage,
          Quickreply,
          Quickreplyimage,
          QuickReplyFile,
          Locationmessage,
          Contact
        ]
      },
      "src.name": {
        "type": "string",
        "description": "The Gupshup app name registered against the phone number provided in the API.",
        "examples": [
          "myapp"
        ]
      },
      "disablePreview": {
        "type": "boolean",
        "description": "This is only applicable for text messages. By default, the mobile WhatsApp application recognizes URLs and makes them clickable. To include a URL preview, include \"preview_url\": true in the message body and make sure the URL begins with http:// or https://. A hostname is required, IP addresses are not matched.",
        "examples": [
          false
        ]
      },
      "encode": {
        "type": "boolean",
        "description": "This flag is used for sending an emoji in an Interactive List message. If the list message consists of emojis, set the encode flag to 'true'. This flag will not affect any other type of message.",
        "examples": [
          false
        ]
      }
    },
    "$schema": "http://json-schema.org/draft-04/schema#"
  },
  "metadata": {
    "allOf": [
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
          "apikey": {
            "type": "string",
            "examples": [
              "092707e8296649XXXX94c0fXXX818ad"
            ]
          }
        },
        "required": [
          "apikey"
        ]
      }
    ]
  },
  "response": {
    "2XX": {
      "type": "object",
      "properties": {
        "status": {
          "type": "string",
          "description": "The API call was successfully made and the request is submitted.",
          "examples": [
            "submitted"
          ]
        },
        "messageId": {
          "type": "string",
          "description": "It is the unique identifier for a message. You can track message status via the DLR message events obtained on the webhook.",
          "examples": [
            "ee4a68a0-1203-4c85-8dc3-49d0b3226a35"
          ]
        }
      },
      "$schema": "http://json-schema.org/draft-04/schema#"
    }
  }
} as const;
export default PostMsg
