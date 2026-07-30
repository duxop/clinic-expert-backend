const Orgobject = {
  "title": "Orgobject",
  "required": [
    "company",
    "department",
    "title"
  ],
  "type": "object",
  "properties": {
    "company": {
      "type": "string",
      "examples": [
        "Guspshup"
      ]
    },
    "department": {
      "type": "string",
      "examples": [
        "Product"
      ]
    },
    "title": {
      "type": "string",
      "examples": [
        "Manager"
      ]
    }
  },
  "x-readme-ref-name": "Orgobject"
} as const;
export default Orgobject
