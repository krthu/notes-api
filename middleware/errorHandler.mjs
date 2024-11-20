import { sendResponse } from "../responses/sendResponse.mjs"


export const errorHandler = {
    onError: async (request) => {
        console.error('Error', request.event.error)
        return sendResponse(400, request.event.error)
    }
}