import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
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
    //export async function editNote(noteToEdit, newTitle, newText, deleted = false) {
    //    const updatedNote = {...noteToEdit, title: newTitle, text: newText, deleted: deleted}
    //    updatedNote.modifiedAt = new Date().toISOString();
    const updatedNote = { ...noteToEdit, ...valuesToChange }
    console.log(updatedNote)
    const params = {
        TableName: process.env.NOTES_TABLE,
        Item: marshall(updatedNote),
    }

    try {
        const command = new PutItemCommand(params);
        await dbClient.send(command);
        return { success: true, message: `NoteId: ${updatedNote.id} ${deleted ? 'deleted' : 'updated'}` }
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
        console.log('DAta: ', data)
        console.log('DAta: ', data.Items);
        //const notes = unmarshall(data.Items);
        const notes = data.Items.filter(note => unmarshall(note))
        return { success: true, notes: notes }


    } catch (error) {
        console.error('Error quering table', error)
        return { success: false, message: 'Error fetching notes' }
    }


}
