import middy from "@middy/core";
import { validateToken } from "../../middleware/auth.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { editNote, getNote } from "../../utils/dynamoDbHelper.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";


async function handleRestoreNote(event) {
    const userId = event.id
    const {noteId} = event.pathParameters;

    const getNoteResult = await getNote(userId, noteId);
    if (!getNoteResult.success){ return sendResponse(getNoteResult.errorCode, {success: getNoteResult.success, message: getNoteResult.message})}
    if (!getNoteResult.note.deleted){
        return sendResponse(400, {success: false, message:'Note is not deleted'})
    }
    const valuesToChange = {
        deleted: false

    }
    if (getNoteResult.note.expiresAt) {
        delete getNoteResult.note.expiresAt;
    }
    const editNoteResult = await editNote(getNoteResult.note, valuesToChange)
    if (!editNoteResult.success) { 
        return sendResponse(500, editNoteResult)
    }
    else {
        editNoteResult.message = `Restored note`
        return sendResponse(200, editNoteResult)
    }

}

export const handler = middy(handleRestoreNote)
    .use(validateToken)
    .use(errorHandler)