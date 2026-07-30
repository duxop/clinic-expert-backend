const Addressobject = {
  "title": "Addressobject",
  "required": [
    "city",
    "country",
    "countryCode",
    "state",
    "street",
    "type",
    "zip"
  ],
  "type": "object",
  "properties": {
    "city": {
      "type": "string",
      "examples": [
        "Menlo Park"
      ]
    },
    "country": {
      "type": "string",
      "examples": [
        "United States"
      ]
    },
    "countryCode": {
      "type": "string",
      "examples": [
        "us"
      ]
    },
    "state": {
      "type": "string",
      "examples": [
        "CA"
      ]
    },
    "street": {
      "type": "string",
      "examples": [
        "1 Hacker Way"
      ]
    },
    "type": {
      "type": "string",
      "examples": [
        "HOME"
      ]
    },
    "zip": {
      "type": "string",
      "examples": [
        "94025"
      ]
    }
  },
  "x-readme-ref-name": "Addressobject"
} as const;
export default Addressobject
