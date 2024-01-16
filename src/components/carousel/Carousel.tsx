'use client'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'

type Props = {
	img: string
	title: string
}

const list: Props[] = [
	{
		img: '/images/1.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
	{
		img: '/images/2.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
	{
		img: '/images/3.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
	{
		img: '/images/4.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
	{
		img: '/images/5.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
	{
		img: '/images/6.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
	{
		img: '/images/7.jpg',
		title: 'Hand Gesture Detection By Nguyen Tien Long HUST@',
	},
]

const SliderItem = ({
	img,
	title,
	index,
}: {
	img: string
	title: string
	index: number
}) => {
	return (
		<div
			key={index}
			className='rounded-[20px] py-2 px-4 relative'>
			<Image
				src={img}
				alt=''
				width={200}
				height={600}
				loading='lazy'
				layout='responsive'
				className='rounded-[20px]'
			/>
			<div className='absolute top-[20%] py-2 px-4 text-[#fff] text-[20px] font-mono bg-slate-900 w-fit'>
				{title}
			</div>
		</div>
	)
}

const MyCarousel = () => {
	var settings = {
		dots: false,
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
	}
	return (
		<Slider
			className='w-full'
			{...settings}
			autoplay={true}
			// speed={1000}
			arrows={false}
			adaptiveHeight
			autoplaySpeed={2000}>
			{list.map((item: Props, index: number) => (
				<SliderItem
					key={index}
					img={item.img}
					index={index}
					title={item.title}
				/>
			))}
		</Slider>
	)
}

export default MyCarousel
