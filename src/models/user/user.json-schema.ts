export const UserJSONSchema = {
    "id": "user",
    "type": "object",
    "properties": {
        "email": { "type": "string" },
        "password": { "type": "string" },
        "name": { "type": "string" },
        "role": { "type": "integer" },
        "dob": { "type": "integer" }
    },
    "required": ["email", "password", "name", "role"]
};