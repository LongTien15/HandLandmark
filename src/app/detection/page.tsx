'use server'

import Demo from '@/components/detection/detection'
import axios from 'axios'

const DetectionPage = async () => {
	let data = {}
	const res = await axios.get('http://127.0.0.1:3000/saved.json')
	if (res?.status === 200) {
		data = res?.data
	}

	return <Demo dataExample={data} />
}

export default DetectionPage
