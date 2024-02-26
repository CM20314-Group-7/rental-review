
import Image from 'next/image'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { StarRatingLayout } from '@/components/StarRating'
import { ReviewDetailsLayout } from '@/components/ReviewDetails'
import { notFound } from 'next/navigation'
import { NextPage } from 'next'

const PropertyDetailPage: NextPage<{
    params: {
        id: string
    }
}> = async ({ params }) => {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !data) notFound()

    return (
        <div className="flex-1 flex flex-col w-full px-8 justify-top items-center gap-2 py-20">
            <div className="flex flex-row w-full px-8 justify-center gap-2">
                <div className='relative w-full max-w-md aspect-[1000/682]'>
                    <Image
                        className='absolute w-full max-w-md rounded-lg'
                        src="/house.jpeg"
                        width={1000}
                        height={682}
                        alt="Image of a house"
                    />
                    <div className='w-full h-full bg-background/40 backdrop-blur flex flex-col place-items-center justify-center'>
                        <p className='text-lg font-semibold text-foreground'>Property Images Coming Soon</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-top gap-2">
                    <text className='font-bold text-lg'>{data.address}</text>
                    <OwnershipDetails />
                    <div className='flex flex-row w-full px-0 justify-start items-center gap-2'>
                        <text>Average rating:</text>
                        <StarRatingLayout rating={4} />
                    </div>

                    <text>This is a description. consequat laboris pariatur deserunt exercitation ut ipsum tempor aliquip consequat in laborum voluptate commodo dolor laborum exercitation do duis duis ex aliqua amet fugiat pariatur laborum ex magna excepteur culpa amet est excepteur eu</text>
                </div>
            </div>

            {Array.from({ length: 3 }).map((_, i) => {
                return (
                    <ReviewDetailsLayout
                        reviewId="1"
                        reviewerId="1"
                        reviewDate={new Date('01 Jan 1970 00:00:00 GMT')}
                        landlordRating={2}
                        propertyRating={4}
                        reviewMessage="This is a review message"
                    />
                )
            })}
        </div>
    )
}

export default PropertyDetailPage;

const OwnershipDetails: React.FC = () => {
    return (
        <p>Owned by Jane Doe</p>
    )
}