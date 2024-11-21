import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
const db = new DynamoDBClient({region: 'eu-north-1'});
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { sendResponse } from '../../responses/sendResponse.mjs';
import middy from '@middy/core';
import { jsonParsing } from '../../middleware/jsonParsing.mjs';
import { errorHandler } from '../../middleware/errorHandler.mjs';
import { validateInput, validateInputKeys } from '../../middleware/validateInputKeys.mjs';

async function getUser(username) {
    const params = {
        TableName: process.env.USER_TABLE,
        Key: {
            username: {S: username}
        }

    }
    const command = new GetItemCommand(params);
    try {
        const user = await db.send(command);
        if (user?.Item){
            return unmarshall(user.Item)
        } else {
            return false
        }
        
    } catch (error) {
        console.log(error);
        return false
    }
}


async function login(username, password) {
    const user = await getUser(username);
    if (!user) {return {success: false, message: 'Incorrect username or password'}}
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) return {success: false, message:'Incorrect username or password'}

    const token = jwt.sign({id: user.userId, username: username}, process.env.JWT_SECRET, {expiresIn: 3600});
    return {success: true, token: token}
}


async function handleLogin(event, context){
    //const {username, password} = JSON.parse(event.body);
    const {username, password} = event.jsonBody;
    const result = await login(username, password)
    if (result.success){
        return sendResponse(200, result);
    } else {
        return sendResponse(400, result);
    }
}

export const handler = middy(handleLogin)
        .use(jsonParsing)
        //.use(validateInputKeys(['username', 'password']))
        .use(validateInput({
            username: {
                required: true,
                type: 'string',
                // validate: (value) => value.trim().length > 1,
                // validationError: 'Needs to be atleast 1 character'
            },
            password: {
                required: true,
                type: 'string',
                // validate: (value) => value.length > 6,
                // validationError: 'Needs to be atleast 6 characters'
            }
        }))
        .use(errorHandler)