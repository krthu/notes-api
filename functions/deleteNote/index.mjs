import middy from "@middy/core";
import { validateToken } from "../../middleware/auth.mjs";
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { getNote, editNote  } from "../../utils/dynamoDbHelper.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";


async function handleDeleteNote(event) {
    const userId = event.id;
    const {noteId} = event.pathParameters;
    console.log("UserID:", userId)
    console.log("noteId:", noteId)

    const getNoteResult = await getNote(userId, noteId);
    if (!getNoteResult.success){ return sendResponse(getNoteResult.errorCode, {success: getNoteResult.success, message: getNoteResult.message})}
    if (getNoteResult.note.deleted){return sendResponse(400, {success: false, message: 'Note already deleted. To permanently delete use deleted-notes endpoint', noteId: noteId})}
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const tenDaysInSeconds = 10 * 24 * 60 * 60;
    //const oneHourInSeconds = 60 * 60;
    const expiresAt = nowInSeconds + tenDaysInSeconds;

    
    const valuesToChange = {
        deleted: true,
        expiresAt: expiresAt
    }

    const editNoteResult = await editNote(getNoteResult.note, valuesToChange, deleted = true)
 
    if (!editNoteResult.success){
        return sendResponse(500, editNoteResult)
    }
    else{
        return sendResponse(200, editNoteResult)
    }
}


export const handler = middy(handleDeleteNote)
    .use(validateToken)
    .use(errorHandler)