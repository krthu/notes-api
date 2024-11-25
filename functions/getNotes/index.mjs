import middy from "@middy/core";
import { validateToken } from "../../middleware/auth.mjs";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";
import { removeInternalFieldsFromNotes, retriveNotesFromDB } from "../../utils/dynamoDbHelper.mjs";
const dbClient = new DynamoDBClient()

async function getNotes(event) {
    const userId = event.id;
    
    const result = await retriveNotesFromDB(userId);

    if (result.success){
        const notes = removeInternalFieldsFromNotes(result.notes);
        result.notes = notes
       return sendResponse(200, result);
    } else {
        return sendResponse(500, result);
    }
}

export const handler = middy(getNotes)
    .use(validateToken)
    .use(errorHandler)