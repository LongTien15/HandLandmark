'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Search } from 'react-feather'

type Props = {
	name: string
	href: string
}

const HeadTag = ({
	href,
	name,
	selected,
	index,
	setSelected,
}: {
	href: string
	name: string
	selected: number
	index: number
	setSelected: (selected: number) => void
}) => {
	return (
		<a
			href={href}
			onClick={() => setSelected(index)}
			className={`h-full pt-12 ${
				selected === index ? 'border-b-[6px] border-[#eb4034]' : ''
			}`}>
			{name}
		</a>
	)
}

const Header = () => {
	const list: Props[] = [
		{
			name: 'Home',
			href: '#',
		},
		{
			name: 'About',
			href: '#',
		},
		{
			name: 'Post Types',
			href: '#',
		},
		{
			name: 'Misc',
			href: '#',
		},
		{
			name: 'Contact',
			href: '#',
		},
	]

	const [selected, setSelected] = useState<number>(0)

	return (
		<div className=' flex flex-row justify-evenly'>
			<Image
				onClick={() => (window.location.href = '/')}
				src={'/logo.webp'}
				width={280}
				height={100}
				objectFit='cover'
				alt=''
				className='py-6 cursor-pointer'
			/>
			<div className=' flex gap-x-[60px] items-center text-[22px] text-[#55558b] font-mono font-bold'>
				{list?.map((item: Props, index: number) => (
					<HeadTag
						key={index}
						href={item.href}
						name={item.name}
						index={index}
						selected={selected}
						setSelected={setSelected}
					/>
				))}
			</div>
			<div className=' flex items-center '>
				<div className='bg-[#eb4034] w-[58px] h-[58px] rounded-[50px] flex items-center justify-center'>
					<Search
						color='#fff'
						strokeWidth={3}
					/>
				</div>
			</div>
		</div>
	)
}

export default Header
