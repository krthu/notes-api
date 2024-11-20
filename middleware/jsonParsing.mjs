
export const jsonParsing = {
    before: async (request) => {
        try {
            if (!request.event.body) throw new Error();
            request.event.jsonBody = JSON.parse(request.event.body);
            return request.response;
            
        } catch (error) {
            request.event.error = {success: false, message: 'Error parsing json'};
            throw new Error();
        }
    }
}