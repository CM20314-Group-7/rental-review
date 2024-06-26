import { FC, PropsWithChildren } from 'react';

const AdminConsolePageLayout: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => (
  <main className='flex flex-1 flex-col gap-4 p-4 md:overflow-y-auto lg:gap-6 lg:p-6'>
    <div className='flex items-center'>
      <h1 className='text-lg font-semibold md:text-2xl'>{title}</h1>
    </div>
    <div
      className='flex flex-1 items-center justify-center rounded-lg border border-dashed p-10 shadow-sm'
      x-chunk='dashboard-02-chunk-1'
    >
      {children}
    </div>
  </main>
);

export default AdminConsolePageLayout;
