import { NextResponse, NextRequest } from 'next/server'

import fs from 'fs'

const fileSrc = process.cwd() + '/public/saved.json'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		console.log(fileSrc)
		let data = {}
		fs.readFile(fileSrc, 'utf-8', function (err, data) {
			var json: any = data ? JSON.parse(data) : {}
			data = json
		})
		console.log(data)
		return NextResponse.json(
			{ message: 'Save successfully', data: data },
			{
				status: 200,
			}
		)
	} catch (error) {
		return NextResponse.json(
			{ message: 'Save failed' },
			{
				status: 500,
			}
		)
	}
}
