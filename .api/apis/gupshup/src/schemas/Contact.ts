import Contactobject from './Contactobject.js';

const Contact = {
  "title": "contact",
  "required": [
    "type",
    "contact"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "contact"
      ]
    },
    "contact": Contactobject
  },
  "x-readme-ref-name": "contact"
} as const;
export default Contact
