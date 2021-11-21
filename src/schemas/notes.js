module.exports = {
    title: "note schema",
    version: 0,
    description: "describes an notella note",
    primaryKey: "id",
    primaryKey: {
        // where should the composed string be stored
        key: 'id',
        // fields that will be used to create the composed key
        fields: [
            'user',
            'nid'
        ],
        // separator which is used to concat the fields values.
        separator: '-'
    },
    type: "object",
    properties: {
        id: {
            type: "string"
        },
        nid: {
            type: "number"
        },
        user: {
            type: "string"
        },
        title: {
            type: "string"
        },
        body: {
            type: "string"
        },
        tags: {
            type: "array",
            uniqueItems: true,
            items: {
                type: "string"
            }
        }
    },
    required: [
        "id",
        "nid",
        "user",
        "title",
    ],
    encrypted: [ "nid", "title", "body", "tags" ],
    attachments: {
        encrypted: true
    }
};