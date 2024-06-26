'use client';

import { useFormState } from 'react-dom';
import React, { useEffect, useState } from 'react';
import { State, claimProperty } from './actions';

const ErrorMessage: React.FC<{ state: State }> = ({ state }) => {
  // Handle specific errors

  if (state.errors?.started_at?.includes('Start date must be in the past')) {
    return <p>Start date must be in the past</p>;
  }

  if (state.errors?.ended_at?.includes('End date must be in the past')) {
    return <p>End date must be in the past</p>;
  }

  if (state.errors?.ended_at?.includes('End date must be after start date')) {
    return <p>End date must be after start date</p>;
  }

  // Handle generic errors/messages
  return <p>{state.message}</p>;
};

interface ClaimPropertyFormProps {
  property_id: string;
  landlord_id: string;
}

const ClaimPropertyForm: React.FC<ClaimPropertyFormProps> = ({
  property_id,
  landlord_id,
}) => {
  const claimPropertyWithIds = claimProperty.bind(
    null,
    property_id,
    landlord_id,
  );
  const initialState = { errors: {}, message: null };
  const [state, dispatch] = useFormState(claimPropertyWithIds, initialState);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [stillOwned, setStillOwned] = useState<boolean | undefined>();

  useEffect(() => {
    if (stillOwned) setEndDate(null);
  }, [stillOwned]);

  useEffect(() => {
    if (endDate) setStillOwned(false);
  }, [endDate]);

  return (
    <div className='Contents'>
      <form
        className='bg-primary/30 flex flex-col justify-center gap-4 border-x px-4 py-8'
        action={dispatch}
      >
        <label
          className='flex flex-col justify-center gap-1'
          htmlFor='started_at'
        >
          <p className='text-lg font-bold'>
            When did you purchase this property?
          </p>
          <input
            className={`${startDate ? 'bg-accent/20 hover:bg-accent/30 border-accent/50' : 'hover:bg-foreground/5 border-foreground/50 bg-transparent'} w-[45%] rounded-md  border px-2 py-1`}
            type='date'
            name='started_at'
            onChange={(e) => setStartDate(new Date(e.target.value))}
            required
          />
        </label>

        <label
          className='flex flex-col justify-center gap-1'
          htmlFor='started_at'
        >
          <p className='text-lg font-bold'>When did you sell this property?</p>
          <div className='flex flex-row items-center justify-between gap-2'>
            <input
              className={`${endDate ? 'bg-accent/20 hover:bg-accent/30 border-accent/50' : 'hover:bg-foreground/5 border-foreground/50 bg-transparent'} w-[45%] rounded-md  border px-2 py-1`}
              type='date'
              name='ended_at'
              required={!(stillOwned === true)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              value={endDate?.toISOString().split('T')[0] ?? ''}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                if (stillOwned === true) setStillOwned(false);
                setStillOwned(!(stillOwned === true));
              }}
              type='button'
              className={`${stillOwned ? 'bg-accent/20 hover:bg-accent/30 border-accent/50' : 'hover:bg-foreground/5 border-foreground/50 bg-transparent'} flex w-[45%] flex-row items-center justify-evenly rounded-md border px-2 py-1 align-middle`}
            >
              <p className='text-lg'>I still own this property</p>
              <div className='relative h-5 w-5 rounded-md border-4'>
                {stillOwned && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={2.5}
                    className='stroke-accent absolute -left-1 -top-2 h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m4.5 12.75 6 6 9-13.5'
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </label>

        <div />

        <button
          className='bg-foreground/20 active:bg-forground/10 hover:bg-foreground/10 border-foreground/50 rounded-md border p-2 font-bold'
          type='submit'
        >
          Claim Property
        </button>
      </form>

      <div className='bg-primary/50 flex min-h-[4rem] flex-col items-center justify-center gap-2 rounded-b-lg border p-4'>
        {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
        <ErrorMessage state={state} />
      </div>
    </div>
  );
};

export default ClaimPropertyForm;
