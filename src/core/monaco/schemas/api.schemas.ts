export const apiRequestSchema = {
  type: "object",
  description: "API Request Body",
  properties: {},
  additionalProperties: true
};

export const apiHeadersSchema = {
  type: "object",
  description: "API Request Headers",
  properties: {
    "Content-Type": {
      type: "string",
      enum: ["application/json", "application/xml", "application/x-www-form-urlencoded", "text/plain", "text/html"],
      description: "Indicates the media type of the resource."
    },
    "Authorization": {
      type: "string",
      description: "Contains the credentials to authenticate a user agent with a server."
    },
    "Accept": {
      type: "string",
      description: "Indicates which content types, expressed as MIME types, the client is able to understand."
    }
  },
  additionalProperties: true
};
