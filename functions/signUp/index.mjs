import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid';
import { marshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { sendResponse } from '../../responses/sendResponse.mjs';
const db = new DynamoDBClient({region: 'eu-north-1'});



async function createUser(username, hasedPassword, firstname, lastname, userId) {
    const user = {
        username: username,
        password: hasedPassword,
        firstname: firstname,
        lastname: lastname,
        userId: userId,
    };
    const params = {
        TableName: process.env.USER_TABLE,
        Item: marshall(user)
    };
    try {
        const command = new PutItemCommand(params);
        await db.send(command);
        return {success: true, userId: userId}
    } catch (error) {
        console.log(error)
        return {success: false, message: 'Could not create account'}
    }
}


async function signUp(username, password, firstname, lastname) {
    const hasedPassword = await bcrypt.hash(password, 10);
    const userId = nanoid();
    const result = createUser(username, hasedPassword, firstname, lastname, userId)
    return result
}


export async function handler(event, context) {
    const {username, password, firstname, lastname} = JSON.parse(event.body);
    const result = await signUp(username, password, firstname, lastname)
    if (result.success){
        return sendResponse(200, result)
    } else {
        return sendResponse(400, result)
    }
    
}