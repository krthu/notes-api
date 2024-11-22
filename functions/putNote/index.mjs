import middy from "@middy/core";
import { jsonParsing } from "../../middleware/jsonParsing.mjs";
import { validateInput } from "../../middleware/validateInput.mjs";
import { noteValidation } from "../../utils/validationObjects.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
import { sendResponse } from "../../responses/sendResponse.mjs";
import { validateToken } from "../../middleware/auth.mjs";
import { getNote, editNote } from "../../utils/dynamoDbHelper.mjs";


const dbClient = new DynamoDBClient()

async function putNote(event) {
    const {title, text} = event.jsonBody;
    const userId = event.id
    const {noteId} = event.pathParameters;

    const result = await getNote(userId, noteId)
    if (!result.success){ return sendResponse(result.errorCode, {success: result.success, message: result.message}) }
//    const editNoteResult = await editNote(result.note, title, text);

    // Check if deleted if so return it has to be restored firtst

    const valuesToChange = {
        title: title,
        text, text,
        modifiedAt: new Date().toISOString()
    }
    const editNoteResult = await editNote(result.note, valuesToChange)
    if (!editNoteResult.success){
        return sendResponse(500, editNoteResult)
    }
    else{
        return sendResponse(200, editNoteResult)
    }
}

export const handler = middy(putNote)
    .use(validateToken)
    .use(jsonParsing)
    .use(validateInput(noteValidation))
    .use(errorHandler)

