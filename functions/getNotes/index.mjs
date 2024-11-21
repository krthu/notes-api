import middy from "@middy/core";
import { validateToken } from "../../middleware/auth.mjs";
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { errorHandler } from "../../middleware/errorHandler.mjs";
import { sendResponse } from "../../responses/sendResponse.mjs";
const dbClient = new DynamoDBClient()


async function retriveNotesFromDB(userId) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': {S: userId}
        }
    }
    try {
        const command = new QueryCommand(params);
        const data = await dbClient.send(command);
        console.log('DAta: ', data)
        console.log('DAta: ', data.Items);
        //const notes = unmarshall(data.Items);
        const notes = data.Items.filter(note => unmarshall(note))
        return {success: true, notes: notes}


    } catch (error) {
        console.error('Error quering table', error)
        return { success: false, message: 'Error fetching notes'}
    }


}



async function getNotes(event) {
    const userId = event.id;
    console.log('This is the userID', userId);
    const result = await retriveNotesFromDB(userId);

    if (result.success){
       return sendResponse(200, result);
    } else {
        return sendResponse(500, result);
    }
}

export const handler = middy(getNotes)
    .use(validateToken)
    .use(errorHandler)