import Image from 'next/image'
import React from 'react'
import { Badge } from './ui/badge'

export default function ProductCard(
    { image, name, price, mrp }:
        { image: string, name: string, price: number | null, mrp: number }) {
    return (
        <div className="basis-full bg-white shadow border aspect-square flex flex-col p-4 items-center justify-center gap-2 group cursor-pointer rounded-lg relative">
            <div className="p-8 overflow-hidden">
                <Image src={image} alt={name} width={400} height={400} className="group-hover:scale-105" />
            </div>
            <span className="font-semibold text-sm">{name} Power Bank</span>
            <p className="flex gap-2">
                {price ? <>
                    <span className="text-sm">₹ {price} /-</span>
                    <span className="text-sm line-through text-gray-400">₹ {mrp} /-</span>
                </> : <span className="text-sm">₹ {mrp} /-</span>
                }
            </p>
            <Badge variant="destructive" className="bg-amber-500 font-semibold rounded-lg absolute top-4 right-4">
                11%</Badge>
        </div>
    )
}
