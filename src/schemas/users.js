module.exports = {
    title: "user schema",
    version: 0,
    description: "describes an notella user",
    primaryKey: "name",
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        token: {
            type: "string"
        },
        scope: {
            type: "string"
        }
    },
    required: [
        "name",
        "token",
        "scope"
    ],
    encrypted: [ "token" ],
    attachments: {
        encrypted: true
    }
};