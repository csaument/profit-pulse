migrate((db) => {
  const collection = new Collection({
    "id": "qxc122fucgmu8ie",
    "created": "2023-07-05 19:34:49.578Z",
    "updated": "2023-07-05 19:34:49.578Z",
    "name": "incomes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nyyp1vys",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "sced8cck",
        "name": "value",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "7rfep0aq",
        "name": "frequency",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "annual",
            "monthly",
            "single"
          ]
        }
      },
      {
        "system": false,
        "id": "y1fmjij2",
        "name": "start_date",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "fblrofgh",
        "name": "end_date",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "m43r6flf",
        "name": "field",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qxc122fucgmu8ie");

  return dao.deleteCollection(collection);
})
