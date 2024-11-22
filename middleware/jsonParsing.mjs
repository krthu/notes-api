
export const jsonParsing = {
    before: async (request) => {
        try {
            if (!request.event.body) throw new Error();
            request.event.jsonBody = JSON.parse(request.event.body);
            return request.response;
            
        } catch (error) {
            request.event.error =  'Error parsing json';
            request.event.errorCode = 400;
            throw new Error();
        }
    }
}