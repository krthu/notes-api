import middy from "@middy/core";
import { validateToken } from "../../middleware/auth.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";
import { retriveNotesFromDB } from "../../utils/dynamoDbHelper.mjs";




async function getDeletedNotes(event) {
    const userId = event.id;
    console.log('This is the userID', userId);
    const result = await retriveNotesFromDB(userId, deleted = true);

    if (result.success){
       return sendResponse(200, result);
    } else {
        return sendResponse(500, result);
    }
}

export const handler = middy(getDeletedNotes)
    .use(validateToken)
    .use(errorHandler)