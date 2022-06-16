import { compare } from "bcryptjs";
import { client } from "../../prisma/client";
import { sign } from 'jsonwebtoken';
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

interface IRequest {
    username: string;
    password: string;
}

class AuthenticateUserUseCase {

    async execute({ username, password }: IRequest) {

        //verifica se usuário existe
        const user = await client.user.findFirst({
            where: {
                username,
            },
        })
        if(!user) {
            throw new Error("User or password incorrect");
        }

        // verifica se a senha está correta
        const passwordMatch = await compare(password, user.password);
        if(!passwordMatch) {
            throw new Error("User or password incorrect");
        }

        //gerar token do usuário
        const generateTokenProvider = new GenerateTokenProvider();
        const token = await generateTokenProvider.execute(user.id);

        await client.refreshToken.deleteMany({
            where: {
                userId: user.id
            }
        });

        const generateRefreshToken = new GenerateRefreshToken();
        const refreshToken = await generateRefreshToken.execute(user.id);

        return { token, refreshToken };
    }
}

export { AuthenticateUserUseCase };