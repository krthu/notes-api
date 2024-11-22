export const noteValidation = {
    title: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 1 && value.length <= 50,
        validationError: 'Need to be between 1-50 characters'
    },
    text: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 1 && value.length <= 300,
        validationError: 'Need to be between 1-300 characters'
    }
}

export const signUpValidation = { 
    username:{
        required: true,
        type: 'string',
        validate: (value) => value.length >= 6,
        validationError: 'Needs to be atleast 6 characters'
    },
    password: {
        required: true,
        type: 'string',
        validate: (value) => value.length >= 6,
        validationError: 'Needs to be atleast 6 characters' //Check for more like Aa3 included
    },
    firstname: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 1,
        validationError: 'Needs to be atleast 1 characters'
    },
    lastname: {
        required: true,
        type: 'string',
        validate: (value) => value.length > 1,
        validationError: 'Needs to be atleast 1 characters'
    }
}

export const loginValidation = {
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
}