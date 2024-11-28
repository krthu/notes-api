import { sendResponse } from "../responses/sendResponse.mjs";

export const validateInputKeys = (requiredKeys) => ({
    before: async (request) => {
        const body = request.event.jsonBody;
        const missingKeys = requiredKeys.filter((key) =>
            body[key] === undefined || body[key] === null
        );
        if (missingKeys.length > 0) {
            request.event.error = { success: false, message: `Missing required keys: ${missingKeys.join(', ')}` }
            throw new Error();
        }
        return request.response;
    }
})

export const validateInput = (validationRules) => ({
    before: async (request) => {
        const body = request.event.jsonBody;

        if (Object.keys(validationRules).length < Object.keys(body).length){
            console.log('Inside to many keys')
                request.event.error = `You can't send more keys then expected.`;
                throw new Error();
        }

        for (const [key, rules] of Object.entries(validationRules)) {
            const value = body[key];

            if (rules.required && (value === undefined || value === null)) {
                //   console.error("We have the key error!!!!!!")
               // errors.push(`${key} is required`);
                request.event.error = `${key} is required`;
                throw new Error();
                //console.error("We have the key error!!!!!!", errors);
            }

            if (rules.type && typeof value !== rules.type) {
              //  errors.push(`${key} must be of type ${rules.type}`);
              request.event.error = `${key} must be of type ${rules.type}`;
              throw new Error();
            }

            if (rules.validate && !rules.validate(value)) {
                //errors.push(`${key} failed validation: ${rules.validationError}`)
                request.event.error = `${key} failed validation: ${rules.validationError}`;
                throw new Error();
            }
        }
        // if (errors.length > 0) {
        //     console.log("BEfore join", errors);
        //     request.event.error = errors.join('. ');
        //     console.log(request.event.error);
        //     throw new Error()
        // }
        return request.response
    }
})