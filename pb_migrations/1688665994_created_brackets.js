migrate((db) => {
  const collection = new Collection({
    "id": "wkqnjpd5cu7pujv",
    "created": "2023-07-06 17:53:14.770Z",
    "updated": "2023-07-06 17:53:14.770Z",
    "name": "brackets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6inycbty",
        "name": "year",
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
        "id": "z7zksykg",
        "name": "jurisdiction",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Federal",
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY"
          ]
        }
      },
      {
        "system": false,
        "id": "0ws7njqm",
        "name": "filing_status",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "single",
            "joint",
            "separate",
            "head",
            "widow"
          ]
        }
      },
      {
        "system": false,
        "id": "rh9apead",
        "name": "lower_bound",
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
        "id": "vhnboiap",
        "name": "upper_bound",
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
        "id": "0fconxyy",
        "name": "tax_rate",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_R6AAM93` ON `brackets` (\n  `year`,\n  `filing_status`,\n  `jurisdiction`\n)"
    ],
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
  const collection = dao.findCollectionByNameOrId("wkqnjpd5cu7pujv");

  return dao.deleteCollection(collection);
})
