const Nameobject = {
  "title": "Nameobject",
  "required": [
    "firstName",
    "formattedName",
    "lastName"
  ],
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "examples": [
        "John"
      ]
    },
    "formattedName": {
      "type": "string",
      "examples": [
        "John Wick"
      ]
    },
    "lastName": {
      "type": "string",
      "examples": [
        "Wick"
      ]
    }
  },
  "x-readme-ref-name": "Nameobject"
} as const;
export default Nameobject
