import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface IRequestPayload {
	payload: MiniAppWalletAuthSuccessPayload
	nonce: string
}

export const POST = async (req: NextRequest) => {
	const { payload, nonce } = (await req.json()) as IRequestPayload
	if (nonce != cookies().get('siwe')?.value) {
		return NextResponse.json({
			status: 'error',
			isValid: false,
			message: 'Invalid nonce',
		})
	}
	try {
		const validMessage = await verifySiweMessage(payload, nonce)
		return NextResponse.json({
			status: 'success',
			isValid: validMessage.isValid,
		})
	} catch (error: unknown) {
 		let errorMessage = 'An unknown error occurred';
		if (error instanceof Error) {
			// Se for um objeto Error padrão, podemos acessar a mensagem
			errorMessage = error.message;
		} else if (typeof error === 'string') {
			// Se o erro for apenas uma string
			errorMessage = error;
		} // Você pode adicionar mais checagens para outros tipos de erro se necessário

		// Handle errors in validation or processing
		return NextResponse.json({
			status: 'error',
			isValid: false,
			message: errorMessage, // Use a mensagem tratada
		});
	}
}
