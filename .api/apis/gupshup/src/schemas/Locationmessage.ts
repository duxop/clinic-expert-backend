const Locationmessage = {
  "title": "Locationmessage",
  "required": [
    "type",
    "longitude",
    "latitude",
    "name",
    "address"
  ],
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "examples": [
        "location"
      ]
    },
    "longitude": {
      "type": "number",
      "examples": [
        72.877655
      ]
    },
    "latitude": {
      "type": "number",
      "examples": [
        19.075983
      ]
    },
    "name": {
      "type": "string",
      "examples": [
        "Mumbai"
      ]
    },
    "address": {
      "type": "string",
      "examples": [
        "Mumbai, Maharashtra"
      ]
    }
  },
  "x-readme-ref-name": "Locationmessage"
} as const;
export default Locationmessage
