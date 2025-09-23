/*
---------------------------------------------------------------------------
*/


/**
 * Resources:
 * - Create a database endpoint (client.databases.create(): https://developers.notion.com/reference/create-a-database)
 * - Create a page endpoint (client.pages.create(): https://developers.notion.com/reference/post-page)
 * - Working with databases guide: https://developers.notion.com/docs/working-with-databases
 * Query a database: https://developers.notion.com/reference/post-database-query
 * Filter database entries: https://developers.notion.com/reference/post-database-query-filter
 */

import {Client} from "@notionhq/client";

class NotionDatabase {

    constructor() {

        this.id = process.env.NOTION_DATABASE_ID;
        this.client = new Client(process.env.NOTION_API_KEY);

    }

    async addNotionPageToDatabase(databaseId, pageProperties) {
        await client.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: pageProperties, // Note: Page properties must match the schema of the database
        })
    }

    async queryDatabase(queryOptions) {
        console.log("Querying database...")
        // This query will filter database entries and return pages that have a "Last ordered" property that is more recent than 2022-12-31. Use multiple filters with the AND/OR options: https://developers.notion.com/reference/post-database-query-filter.
        const lastOrderedIn2023 = await client.databases.query({
            database_id: databaseId,
            filter: {
                property: "Last ordered",
                date: {
                    after: "2022-12-31",
                },
            },
        })

        // Print filtered results
        console.log('Pages with the "Last ordered" date after 2022-12-31:')
        console.log(lastOrderedIn2023)
    }

    async getNotes(meta) {
        return await meta.client.databases.query({
            database_id: process.env.NOTION_DATABASE_ID
        })
    }


}




export {
    NotionDatabase
}
