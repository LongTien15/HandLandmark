'use client'

import { useEffect, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { HAND_CONNECTIONS } from '@mediapipe/hands'
import Image from 'next/image'
import axios from 'axios'

let LIST_EXAMPLE_IMAGES: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
	(ind: number) => ({
		image: `/images/numbers/${ind}.jpg`,
		title: `${ind}`,
	})
)

LIST_EXAMPLE_IMAGES = [
	...LIST_EXAMPLE_IMAGES,
	{ image: `/images/numbers/start.jpg`, title: 'START' },
	,
	{ image: `/images/numbers/stop.jpg`, title: 'STOP' },
]
const DetectWithImages = () => {
	const [handLandmark, setHand] = useState<any>()
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		// let handLandmarker: any
		// let animationFrameId: any

		const initializeHandDetection = async () => {
			setLoading(true)
			try {
				const vision = await FilesetResolver.forVisionTasks(
					'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
				)
				const handLandmarker = await HandLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath: '/hand_landmarker.task',
					},
					numHands: 2,
					runningMode: 'IMAGE',
				})
				setHand(handLandmarker)
				setLoading(false)
			} catch (error) {
				console.error('Error initializing hand detection:', error)
				setLoading(false)
			}
		}

		initializeHandDetection()
	}, [])
	// const draw = (landmarksArray: any) => {
	// 	const canvas = canvasRef.current
	// 	const ctx = canvas.getContext('2d')
	// 	ctx.save()
	// 	ctx.clearRect(0, 0, canvas.width, canvas.height)
	// 	// ctx.clearRect(0, 0, canvas.width, canvas.height)
	// 	// ctx.fillStyle = 'green'
	// 	if (landmarksArray?.length > 0) {
	// 		landmarksArray.forEach((landmarks) => {
	// 			drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
	// 				color: '#00FF00',
	// 				lineWidth: 2,
	// 			})
	// 			drawLandmarks(ctx, landmarks, {
	// 				color: '#FF0000',
	// 				lineWidth: 1,
	// 				radius: 3,
	// 			})
	// 		})
	// 	}
	// }

	const handleClick = async (event: any, src: string, title: string) => {
		const detections = handLandmark.detect(event.target)

		// Assuming detections.landmarks is an array of landmark objects
		if (detections.landmarks) {
			console.log(detections.landmarks)

			//save to local
			const res = await axios.post('/api/save_to_local', {
				title: title,
				landmarks: detections.landmarks,
			})

			if (res?.status === 200) {
				console.log(res?.data)
			}

			const canvas: any = document.createElement('canvas')
			canvas.setAttribute('class', 'canvas')
			canvas.setAttribute('width', event.target.naturalWidth + 'px')
			canvas.setAttribute('height', event.target.naturalHeight + 'px')
			canvas.style =
				'position: absolute;' +
				'left: 0px;' +
				'top: 0px;' +
				'width: ' +
				event.target.width +
				'px;' +
				'height: ' +
				event.target.height +
				'px;'

			event.target.parentNode.appendChild(canvas)
			const cxt = canvas.getContext('2d')
			for (const landmarks of detections.landmarks) {
				drawConnectors(cxt, landmarks, HAND_CONNECTIONS, {
					color: '#00FF00',
					lineWidth: 5,
				})
				drawLandmarks(cxt, landmarks, { color: '#FF0000', lineWidth: 1 })
			}
		}
	}

	return loading ? (
		<div className='text-center text-[50px] font-bold text-red-950'>
			LOADING...
		</div>
	) : (
		<div>
			<h1 className='text-center text-[36px] font-bold p-[20px] mt-[50px] mb-[40px]'>
				HAND DETECTION WITH STATIC IMAGES
			</h1>
			<div className='grid grid-cols-4 gap-5 justify-center p-10'>
				{LIST_EXAMPLE_IMAGES.map((item: any, index: number) => (
					<div key={index}>
						<div className='relative w-full h-full'>
							<Image
								className=''
								onClick={(e) => handleClick(e, item?.image, item?.title)}
								src={item?.image}
								alt='/'
								width={450}
								height={600}
								loading='lazy'
								// layout='responsive'
							/>
						</div>
						<p className='text-center font-bold text-[20px] text-[#EB4034] mt-5'>
							{item?.title}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default DetectWithImages
