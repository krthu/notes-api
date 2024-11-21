import { sendResponse } from "../responses/sendResponse.mjs"


export const errorHandler = {
    onError: async (request) => {
        console.error('Error', request.event.error)
        const errorCode = request.event.errorCode ? request.event.errorCode : 400;
        return sendResponse(errorCode, request.event.error)
    }
}