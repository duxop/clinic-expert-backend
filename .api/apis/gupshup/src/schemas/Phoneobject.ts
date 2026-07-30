const Phoneobject = {
  "title": "Phoneobject",
  "required": [
    "phone",
    "type"
  ],
  "type": "object",
  "properties": {
    "phone": {
      "type": "string",
      "examples": [
        "+1 (940) 555-1234"
      ]
    },
    "type": {
      "type": "string",
      "examples": [
        "HOME"
      ]
    },
    "wa_id": {
      "type": "string"
    }
  },
  "x-readme-ref-name": "Phoneobject"
} as const;
export default Phoneobject
