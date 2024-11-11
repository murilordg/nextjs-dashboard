import { NextRequest, NextResponse } from 'next/server';

const USERNAME = 'yourUsername';
const PASSWORD = 'yourPassword';

export function middleware(request: NextRequest) {

    console.log('middleware');
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return NextResponse.json({ message: 'Missing or invalid authorization header' }, { status: 401 });
    }

    // Decodifica as credenciais Base64
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');

    // Verifica as credenciais
    if (username !== USERNAME || password !== PASSWORD) {
        return new NextResponse('Invalid token', { status: 401 });
    }


    return NextResponse.next(); // Permite que a requisição continue
}

//Configuração para aplicar o middleware apenas a rotas de API
export const config = {
    matcher: '/api/*',
};
