// @ts-nocheck
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { HAND_CONNECTIONS } from '@mediapipe/hands'
const iconProps = {
	title: String,
	icon: String,
}
const LIST_ICONS: iconProps[] = [
	{
		title: 'HI',
		icon: '👋',
	},
	{
		title: 'CALL ME',
		icon: '🤙',
	},
	{
		title: 'LIKE',
		icon: '👍',
	},
	{
		title: 'DISLIKE',
		icon: '👎',
	},
	{
		title: 'OKELA',
		icon: '👌',
	},
]

function normalizeAndFlattenArray(inputArray) {
	const minX = Math.min(...inputArray.map((item) => item.x))
	const maxX = Math.max(...inputArray.map((item) => item.x))

	const minY = Math.min(...inputArray.map((item) => item.y))
	const maxY = Math.max(...inputArray.map((item) => item.y))

	const xMean = (minX + maxX) / 2
	const yMean = (minY + maxY) / 2

	const normalizedAndFlattenedArray = inputArray
		.map((item) => ({
			x: xMean - item.x,
			y: yMean - item.y,
			z: item.z,
		}))
		.flatMap((vector) => [vector.x, vector.y])

	return normalizedAndFlattenedArray
}
function cosineSimilarity(vector1, vector2) {
	if (vector1.length !== vector2.length) {
		throw new Error('Vectors must have the same length')
	}

	const dotProduct = vector1.reduce(
		(sum, value, index) => sum + value * vector2[index],
		0
	)

	const magnitude1 = Math.sqrt(
		vector1.reduce((sum, value) => sum + value ** 2, 0)
	)
	const magnitude2 = Math.sqrt(
		vector2.reduce((sum, value) => sum + value ** 2, 0)
	)

	const similarity = dotProduct / (magnitude1 * magnitude2)

	return similarity
}

const Demo = ({ dataExample }) => {
	const videoRef = useRef(null)
	const canvasRef = useRef(null)
	const [handPresence, setHandPresence] = useState(null)
	const [text, setText] = useState<string>('')
	const [isStart, setIsStart] = useState<boolean>(false)
	const [dataString, setData] = useState<string>('')

	useEffect(() => {
		if (isStart && !dataString) {
			setData('START')
		} else if (isStart && dataString) {
			if (text !== 'START' && text !== 'STOP') {
				if (dataString.includes('START')) {
					setData(dataString?.replaceAll('START', '') + text)
				} else {
					setData(dataString + text)
				}

				if (!dataString.includes('START') && dataString.length > 5) {
					window.alert(`Your number is ${dataString?.replaceAll('0', '')}`)
					setData('')
					setIsStart(false)
				}
			}
		} else if (text === 'STOP' && !isStart) {
			setData('STOP')
		}
	}, [isStart, text])
	useEffect(() => {
		let handLandmarker: any
		let animationFrameId: any

		const initializeHandDetection = async () => {
			try {
				const vision = await FilesetResolver.forVisionTasks(
					'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
				)
				handLandmarker = await HandLandmarker.createFromOptions(vision, {
					baseOptions: { modelAssetPath: '/hand_landmarker.task' },
					numHands: 2,
					runningMode: 'VIDEO',
				})

				detectHands()
			} catch (error) {
				console.error('Error initializing hand detection:', error)
			}
		}

		const draw = (landmarksArray: any) => {
			const canvas = canvasRef.current
			const ctx = canvas.getContext('2d')
			ctx.save()
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			// ctx.clearRect(0, 0, canvas.width, canvas.height)
			// ctx.fillStyle = 'green'
			if (landmarksArray?.length > 0) {
				landmarksArray.forEach((landmarks) => {
					drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
						color: '#00FF00',
						lineWidth: 2,
					})
					drawLandmarks(ctx, landmarks, {
						color: '#FF0000',
						lineWidth: 1,
						radius: 3,
					})
				})
			}
		}

		const detectHands = () => {
			if (videoRef.current && videoRef.current.readyState >= 2) {
				const detections = handLandmarker.detectForVideo(
					videoRef.current,
					performance.now()
				)
				// console.log(input)
				// Assuming detections.landmarks is an array of landmark objects
				if (detections.landmarks) {
					// compare
					Object.keys(dataExample)?.forEach((key: string) => {
						const length1 = dataExample[key]?.[0]?.length
						const length2 = detections.landmarks?.[0]?.length
						if (length2 === 0) setText('')

						if (length1 > 0 && length2 > 0 && length2 === length1) {
							// const result = cosinesim(
							// 	dataExample[key]?.[0],
							// 	dataExample[key]?.[0]
							// )
							const similarity = cosineSimilarity(
								normalizeAndFlattenArray(dataExample[key]?.[0]),
								normalizeAndFlattenArray(detections.landmarks?.[0])
							)
							// console.log(similarity)

							if (similarity > 0.9) {
								const found = LIST_ICONS?.find(
									(item: iconProps) => item?.title === key
								)
								if (key === 'START') {
									setIsStart(true)
									setText('START')
								} else if (key === 'STOP') {
									setIsStart(false)
									setText('STOP')
								} else {
									setText(key)
								}

								// setText(key + ' ' + found?.icon)
							}
						}
					})

					draw(detections.landmarks)
				}
			}
			requestAnimationFrame(detectHands)
		}

		const startWebcam = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				})
				videoRef.current.srcObject = stream
				await initializeHandDetection()
			} catch (error) {
				console.error('Error accessing webcam:', error)
			}
		}

		startWebcam()

		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
			}
			if (handLandmarker) {
				handLandmarker.close()
			}
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId)
			}
		}
	}, [])

	return (
		<div className='flex justify-center mt-[50px] flex-col '>
			<h1 className='text-center text-[30px] font-bold text-[#EB4034] mb-[30px]'>
				HAND DETECTION VIA WEBCAM
			</h1>
			<div className='relative m-auto'>
				<video
					ref={videoRef}
					autoPlay
					playsInline></video>
				<canvas
					ref={canvasRef}
					style={{
						position: 'absolute',
						left: '0px',
						top: '0px',
						width: '100%',
						height: '100%',
					}}></canvas>
			</div>
			<h1 className='text-center text-[30px] font-bold text-[#EB4034] mt-[30px]'>
				{dataString}
			</h1>
		</div>
	)
}

export default Demo
