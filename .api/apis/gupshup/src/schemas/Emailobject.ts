const Emailobject = {
  "title": "Emailobject",
  "required": [
    "email",
    "type"
  ],
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "examples": [
        "personal.mail@gupshup.io"
      ]
    },
    "type": {
      "type": "string",
      "examples": [
        "Personal"
      ]
    }
  },
  "x-readme-ref-name": "Emailobject"
} as const;
export default Emailobject
