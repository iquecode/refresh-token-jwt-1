import dayjs from 'dayjs';
import { client } from "../../prisma/client"
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken';
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";

class RefreshTokenUserUseCase {

    async execute(refresh_token: string) {

        const refreshToken = await client.refreshToken.findFirst({
            where: {
                id: refresh_token
            }
        });

        if(!refreshToken) {
            throw new Error('Refresh token invalid');
        }

        const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

        const generateTokenProvider = new GenerateTokenProvider();
        const token = await generateTokenProvider.execute(refreshToken.userId);

        //se refreshToken estiver expirado, gerar novo refresh token e retornar o token, junto com o novo refresh token
        //pode-se alterar para apagar o refresh token e redirecionar ao login
        //Lembrando que autorizar um refresh_token já expirado pode trazer uma 
        //brecha na segurança, o ideal é gerar um novo refresh_token sempre que 
        //o atual for utilizado e se o atual estiver expirado retornar um erro 
        //de refresh_token expirado.
        //se o refresh token é válido, gera um novo token e um novo refresh token, se não for mais válido retorna erro 403 unauthenticated e sucesso
        //criptografar o refresh token no banco?
        if(refreshTokenExpired) {
            await client.refreshToken.deleteMany({
                where: {
                    userId: refreshToken.userId
                }
            });

            const generateRefreshTokenProvider = new GenerateRefreshToken();
            const newRefreshToken = await generateRefreshTokenProvider.execute(
                refreshToken.userId);

            return { token, refreshToken: newRefreshToken}
        }


        return { token };



    }
}

export { RefreshTokenUserUseCase }