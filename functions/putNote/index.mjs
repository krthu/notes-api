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

// async function getNote(userId, noteId) {
//     const params = {
//         TableName: process.env.NOTES_TABLE,
//         Key: {
//             userId: { S: userId },
//             id: { S: noteId },
//         },   
//     }
//     try {
//         const command = new GetItemCommand(params);
//         const data = await dbClient.send(command);

//         if(data.Item){
//             return {success: true, note: unmarshall(data.Item)}
//         } else {
//             return {success: false, message: 'Note not found', errorCode: 404}
//         }
        
//     } catch (error) {
//         console.log(error);
//         return {success: false, message: 'Error fetching note', errorCode: 500}
//     }
// }

// async function editNote(noteToEdit, newTitle, newText, deleted = false) {
//     const updatedNote = {...noteToEdit, title: newTitle, text: newText}
//     updatedNote.modifiedAt = new Date().toISOString();
//     console.log(updatedNote)
//     const params = {
//         TableName: process.env.NOTES_TABLE,
//         Item: marshall(updatedNote),
//     }

//     try {
//         const command = new PutItemCommand(params);
//         await dbClient.send(command);
//         return {success: true, message:`${updatedNote.id} updated`}
//     } catch (error) {
//         console.log("Error saving note", error);
//         return{success: false, message: 'Error saving note'}
        
//     }
// }


async function putNote(event) {
    const {title, text} = event.jsonBody;
    const userId = event.id
    const {noteId} = event.pathParameters;

    const result = await getNote(userId, noteId)
    if (!result.success){ return sendResponse(result.errorCode, {success: result.success, message: result.message}) }
    const editNoteResult = await editNote(result.note, title, text);
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

