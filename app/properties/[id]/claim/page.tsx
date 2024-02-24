import { createClient } from "@/utils/supabase/server"
import { createClient as createServiceClient } from "@supabase/supabase-js" // TESTING ONLY - REMOVE ME
import { Database } from "@/supabase.types"
import { cookies } from "next/headers"
import { NextPage } from "next"

import { ClaimPropertyForm } from "./form"
import { notFound } from "next/navigation"
import Link from "next/link"

const ClaimPropertyPage: NextPage<{ params: { id: string } }> = async ({ params: { id: propertyId } }) => {
    // Set up the supabase client
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)


    // Check a property with the provided id exists
    const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', propertyId)
        .maybeSingle()

    if (propertyError || !propertyData) notFound()


    // Check the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return (
        <div className="flex flex-col flex-1 place-items-center justify-center gap-4">
            <p className="text-lg font-semibold">
                You must be logged in to access this page
            </p>
            <Link 
                href={`/login?redirect=/properties/${propertyId}/claim`}
                className="text-primary font-semibold underline cursor-pointer"
            >
                Go to Login
            </Link>
        </div>
    )


    // Check that the user has a landlord profile
    // TESTING ONLY: landlord profile table permissions are not set up yet, use service client to fetch data
    const { data: landlordData, error: landlordError } = await createServiceClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )
        .from('landlord_private_profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

    let landlordId: string | null = null; // Declare landlordId variable
    if (!landlordError && landlordData && 'id' in landlordData) { // Add type guard
        landlordId = landlordData.id as string | null; // Assign landlordId value with type assertion
    }

    if (landlordError || !landlordData || !landlordId) return (
        <div className="flex flex-col flex-1 place-items-center justify-center gap-4">
            <p className="text-lg font-semibold">
                You must be registered as a landlord to access this page
            </p>
            <Link 
                href={`/landlord-registration`}
                className="text-primary font-semibold underline cursor-pointer"
            >
                Become a Landlord
            </Link>
        </div>
    )


    // State is valid, render the form
    return (
        <div className="flex flex-1 flex-col gap-2 justify-center">
            <h1 className="text-xl font-semibold text-center">Claim Property</h1>
            <ClaimPropertyForm
                property_id={propertyId}
                landlord_id={landlordId}
            />
        </div>
    )
}

export default ClaimPropertyPage