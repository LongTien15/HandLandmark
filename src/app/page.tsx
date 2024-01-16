'use client'
import MyCarousel from '@/components/carousel/Carousel'
import { useRouter } from 'next/navigation'

export default function Home() {
	const router = useRouter()
	return (
		<div className='h-[100vh] bg-[#edf8ff]'>
			<h1 className='text-[50px] text-center py-5 uppercase font-mono font-bold '>
				Hand gesture detection - project II
			</h1>
			<div className='w-full flex justify-center py-1'>
				<h3 className='text-[24px] px-4 py-2 font-mono w-fit border-[3px] border-[#eb4034] rounded-[20px]'>
					Design and Developed by @Nguyen Tien Long HUST
				</h3>
			</div>
			<div className='pt-10'>
				<MyCarousel />
			</div>
			<div className='pt-20 pb-20 flex justify-center'>
				<button
					className='bg-blue-500 p-2 rounded-[10px] text-white font-mono font-bold text-[20px] mr-[20px]'
					onClick={() => router.push('/detection')}>
					Detect with camera →
				</button>
				<button
					className='bg-blue-500 p-2 rounded-[10px] text-white font-mono font-bold text-[20px]'
					onClick={() => {
						console.log(123123)
						router.push('/detection/images')
					}}>
					Detect with images →
				</button>
			</div>
		</div>
	)
}
