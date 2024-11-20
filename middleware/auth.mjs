import jwt from 'jsonwebtoken';


export const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization.replace('Bearer ', '');
            if (!token) throw new Error();
            const data = jwt.verify(token, process.env.JWT_SECRET);
            request.event.id = data.id;
            request.event.username = data.username;
            return request.response;
        } catch (error) {
            console.log(error);
            request.event.error = {succsess: false, message: 'Incorect password or username'}
            throw new Error();
        }
    }
}