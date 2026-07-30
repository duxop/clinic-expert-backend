import Addressobject from './Addressobject.js';
import Emailobject from './Emailobject.js';
import Nameobject from './Nameobject.js';
import Orgobject from './Orgobject.js';
import Phoneobject from './Phoneobject.js';
import Urlobject from './Urlobject.js';

const Contactobject = {
  "title": "Contactobject",
  "required": [
    "addresses",
    "birthday",
    "emails",
    "name",
    "org",
    "phones",
    "urls"
  ],
  "type": "object",
  "properties": {
    "addresses": {
      "type": "array",
      "items": Addressobject,
      "description": ""
    },
    "birthday": {
      "type": "string",
      "examples": [
        "1995-08-18"
      ]
    },
    "emails": {
      "type": "array",
      "items": Emailobject,
      "description": ""
    },
    "name": Nameobject,
    "org": Orgobject,
    "phones": {
      "type": "array",
      "items": Phoneobject,
      "description": ""
    },
    "urls": {
      "type": "array",
      "items": Urlobject,
      "description": ""
    }
  },
  "x-readme-ref-name": "Contactobject"
} as const;
export default Contactobject
