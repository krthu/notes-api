import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';


const dbClient = new DynamoDBClient()

export async function getNote(userId, noteId) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
            userId: { S: userId },
            id: { S: noteId },
        },
    }
    try {
        const command = new GetItemCommand(params);
        const data = await dbClient.send(command);

        if (data.Item) {
            return { success: true, note: unmarshall(data.Item) }
        } else {
            return { success: false, message: 'Note not found', errorCode: 404 }
        }

    } catch (error) {
        console.log(error);
        return { success: false, message: 'Error fetching note', errorCode: 500 }
    }
}
export async function editNote(noteToEdit, valuesToChange, deleted = false) {

    const updatedNote = { ...noteToEdit, ...valuesToChange }

    const params = {
        TableName: process.env.NOTES_TABLE,
        Item: marshall(updatedNote),
    }

    try {
        const command = new PutItemCommand(params);
        await dbClient.send(command);
        return { success: true, message: `Note ${deleted ? 'deleted' : 'updated'}`, noteId: updatedNote.id }
    } catch (error) {
        console.log("Error saving note", error);
        return { success: false, message: 'Error saving note' }

    }
}

export async function retriveNotesFromDB(userId, deleted = false) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        KeyConditionExpression: 'userId = :userId',
        FilterExpression: "deleted = :deleted",
        ExpressionAttributeValues: {
            ':userId': { S: userId },
            ":deleted": { BOOL: deleted }
        }
    }
    try {
        const command = new QueryCommand(params);
        const data = await dbClient.send(command);

        const notes = data.Items.map(note => unmarshall(note))
        return { success: true, notes: notes }

    } catch (error) {
        console.error('Error quering table', error)
        return { success: false, message: 'Error fetching notes' }
    }
}

export async function deleteNotePermanently(userId, noteId) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
            userId: {S: userId},
            id: {S: noteId}
        }
    };

    try {
        command = new DeleteItemCommand(params);
        await dbClient.send(command);
        return {success: true, message: `Note is permanetly erased`, noteId: noteId}


    } catch (error) {
        return {success: false, message: 'Error deleting item'}
    }
}

export function removeInternalFieldsFromNotes( notes ) {
    const editedNotes = notes.map(note => {
        delete note.deleted;
        return note
    })
    return editedNotes

}