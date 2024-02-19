'use server'

import { Database } from "@/supabase.types";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers";
import { z } from "zod";

export type State = {
    errors?: {
        property_id?: string[],
        landlord_id?: string[],
        started_at?: string[],
        ended_at?: string[]
    };
    message?: string | null;
};

export const ClaimPropertySchema = z
    .object({
        property_id: z.string(),
        landlord_id: z.string(),
        started_at: z.date(),
        ended_at: z.date().nullable()
    })
    // started_at must be in the past
    .superRefine(({ started_at }, ctx) => {
        if (started_at > new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Start date must be in the past',
                path: ['started_at']
            })
        }
    })
    // If ended_at is not null, it must be in the past
    .superRefine(({ ended_at }, ctx) => {
        if (ended_at && ended_at > new Date()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'End date must be in the past',
                path: ['ended_at']
            })
        }
    })
    // If ended_at is not null, it must be after started_at
    .superRefine(({ started_at, ended_at }, ctx) => {
        if (ended_at && started_at > ended_at) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'End date must be after start date',
                path: ['ended_at']
            })
        }
    })

export const claimProperty = async (
    propertyId: string,
    landlordId: string,
    prevState: State,
    formData: FormData
): Promise<State> => {
    const validatedFields = ClaimPropertySchema.safeParse({
        property_id: propertyId,
        landlord_id: landlordId,
        started_at: formData.get('started_at'),
        ended_at: formData.get('ended_at')
    });

    if (!validatedFields.success) return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Invalid Fields. Failed to Claim Property.',
    }

    let {
        property_id,
        landlord_id,
        started_at,
        ended_at
    } = {
        ...validatedFields.data,
        started_at: validatedFields.data.started_at,
        ended_at: validatedFields.data.ended_at || new Date()
    }

    if (!property_id) {
        return {
            errors: {
                property_id: ['Property ID is required']
            },
            message: 'Invalid Fields Submitted'
        }
    }
    // Need to check more things here before we can claim a property

    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    // check if the user is logged in
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
        return {
            message: 'Error Fetching User'
        }
    }

    if (!user) {
        return {
            message: 'User Not Logged In'
        }
    }

    //  check a the user is already the landlord of the property for this time period
    const { data: propertyOwnershipList, error: propertyOwnershipError } = await supabase
        .from('property_ownership')
        .select('landlord_id, started_at, ended_at')
        .eq('property_id', property_id)

    if (propertyOwnershipError) {
        return {
            message: 'Error Fetching Property Ownership'
        }
    }

    // if empty then good
    if (propertyOwnershipList.length == 0)
        return setPropertyOwnership(
            property_id,
            landlord_id,
            started_at,
            ended_at
        );

    // If not empty, for each existing property ownership record, there several cases to consider:
    // 1. The existing claim is closed
    //    1.1 The existing claim does not overlap with the new claim, continue
    //    1.2 The existing claim overlaps with the new claim, fail
    // 2. The existing claim is open 
    //    2.1 The new claim starts after the existing claim, close the existing claim & continue
    //    2.2 The new claim starts before the existing claim
    //        2.2.1 The new claim is closed and ends before the existing claim starts, continue
    //        2.2.2 The new claim is open or ends after the existing claim starts, fail
    
    for (const propertyOwnership of propertyOwnershipList) {
        const existing_start = new Date(propertyOwnership.started_at)
        const existing_end = propertyOwnership.ended_at ? new Date(propertyOwnership.ended_at) : new Date()


        if (propertyOwnership.landlord_id == user.id) {
            // tried to claim the same property again
            return {
                message: 'User is already the landlord of this property'
            }

        } else if (propertyOwnership.landlord_id != null) {
            // property is claimed by someone else

            if (existing_end && ended_at < existing_end) {
                // new start date is before current end date
                return {
                    message: 'New start date is before the current end date'
                }

            } else if (existing_start && started_at > existing_end) {
                // new end date is after current start date
                return {
                    message: 'New end date is after the current start date'
                }
            }

        } else {
            // property is good to claim
            return setPropertyOwnership(property_id, landlord_id, started_at, ended_at)
        }
    }
}


const setPropertyOwnership = async (
    propertyId: string,
    landlordId: string,
    startedAt: Date,
    endedAt: Date | null
) => {
    const supabase = createServiceClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    )

    const { data, error } = await supabase
        .from('property_ownership')
        .update({
            landlord_id: landlordId,
            started_at: startedAt.toISOString(),
            ended_at: endedAt?.toISOString()
        })
        .match({ id: propertyId })

    if (error) {
        return {
            message: 'Error Claiming Property'
        }
    }

    return {
        message: 'Property Claimed Successfully'
    }
}