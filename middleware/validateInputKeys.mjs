export const validateInputKeys = (requiredKeys) => ({
    before: async (request) => {
        const body = request.event.jsonBody;
        const missingKeys = requiredKeys.filter((key) =>
            body[key] === undefined || body[key] === null
        );
        if(missingKeys.length > 0){
            request.event.error = {success: false, message: `Missing required keys: ${missingKeys.join(', ')}`}
            throw new Error();
        }
        return request.response;
    }
})