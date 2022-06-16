import { sign, TokenExpiredError } from 'jsonwebtoken';

class GenerateTokenProvider {

    async execute(userId: string) {
        const token = sign({}, '464add79-8e29-45f3-a6d2-749b7a14d802', {
            subject: userId,
            expiresIn: '20s',
        });
        return token;
    }
}

export { GenerateTokenProvider }