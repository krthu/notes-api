
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
                request.event.error = `${key} is required`;
                throw new Error();
            }

            if (rules.type && typeof value !== rules.type) {
              request.event.error = `${key} must be of type ${rules.type}`;
              throw new Error();
            }

            if (rules.validate && !rules.validate(value)) {
                request.event.error = `${key} failed validation: ${rules.validationError}`;
                throw new Error();
            }
        }

        return request.response
    }
})