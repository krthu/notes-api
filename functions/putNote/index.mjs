import middy from "@middy/core";
import { jsonParsing } from "../../middleware/jsonParsing.mjs";
import { validateInput } from "../../middleware/validateInput.mjs";
import { noteValidation } from "../../utils/validationObjects.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";
import { validateToken } from "../../middleware/auth.mjs";
import { getNote, editNote } from "../../utils/dynamoDbHelper.mjs";

async function putNote(event) {
    const {title, text} = event.jsonBody;
    const userId = event.id
    const {noteId} = event.pathParameters;

    const result = await getNote(userId, noteId)
    if (!result.success){ return sendResponse(result.errorCode, {success: result.success, message: result.message}) }

    if (result.note.deleted){
        return sendResponse(400, {success: false, message: 'Note is already deleteted, restore it before editing.', noteId: noteId});
    }

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

