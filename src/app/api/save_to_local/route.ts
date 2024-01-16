import { NextResponse, NextRequest } from 'next/server'

import fs from 'fs'

const fileSrc = process.cwd() + '/public/saved.json'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		console.log(fileSrc)

		fs.readFile(fileSrc, 'utf-8', function (err, data) {
			var json: any = data ? JSON.parse(data) : {}
			json[body?.title] = body?.landmarks
			const parsed: any = JSON.stringify(json)
			console.log(parsed)
			fs.writeFile(fileSrc, parsed, () => {
				console.log('save successfully')
			})
		})

		return NextResponse.json(
			{ message: 'Save successfully' },
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
