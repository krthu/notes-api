import middy from "@middy/core";
import { jsonParsing } from "../../middleware/jsonParsing.mjs";
import { validateInput } from "../../middleware/validateInput.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { validateToken } from "../../middleware/auth.mjs";
import { nanoid } from "nanoid";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { noteValidation } from "../../utils/validationObjects.mjs";

const dbClient = new DynamoDBClient()
async function saveNoteToDb(note) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Item: marshall(note)
    }
    try {
        const command = new PutItemCommand(params);
        await dbClient.send(command)
        return { success: true, noteId: note.id }
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Could not save note to database' }
    }
}

function checkLength(text, length) {
    if (text.length > length) {
        return false;
    }
}

async function postNote(event) {
    const userId = event.id;
    const { title, text } = event.jsonBody;
    const createdAt = new Date().toISOString();
    const note = {
        userId: userId,
        id: nanoid(),
        title: title,
        text: text,
        createdAt: createdAt,
        modifiedAt: createdAt,
        deleted: false
    }

    const result = await saveNoteToDb(note);
    if (result.success) {
        return sendResponse(200, result);

    } else {
        return sendResponse(500, result);
    }
}

export const handler = middy(postNote)
    .use(validateToken)
    .use(jsonParsing)
    .use(validateInput(noteValidation))


    .use(errorHandler)