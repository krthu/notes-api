import middy from "@middy/core";
import { validateToken } from "../../middleware/auth.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { deleteNotePermanently, getNote } from "../../utils/dynamoDbHelper.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";


async function handlePermanentlyDelete(event) {
    const userId = event.id;
    const {noteId} = event.pathParameters;

    const getNoteResult = await getNote(userId, noteId);
    if (!getNoteResult.success){ return sendResponse(getNoteResult.errorCode, {success: getNoteResult.success, message: getNoteResult.message})}
    const noteToDelete = getNoteResult.note;
    // Should i do this or are you allowed to permanently delete right away?
    if(!noteToDelete.deleted){return sendResponse(400, {success: false, message: 'Note is note deleted. Delete the note first'})}
    const deletNoteResult = await deleteNotePermanently(userId, noteId);
    if (deletNoteResult.success){
        return sendResponse(200, deletNoteResult);
    } else {
        return sendResponse(500, deletNoteResult);
    }
}


export const handler = middy(handlePermanentlyDelete)
    .use(validateToken)
    .use(errorHandler)