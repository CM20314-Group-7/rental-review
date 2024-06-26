import { NextPage } from 'next';
import React from 'react';

const PrivacyPolicyPage: NextPage = () => (
  <main className='flex flex-1 flex-col place-items-center justify-center py-10 md:py-16'>
    <div className='flex w-3/4 flex-col items-center'>
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        Privacy Policy
      </h2>
      <span className='border-accent w-full border border-b' />
    </div>
    <br />
    <div className='w-3/4'>
      <h2 className='mb-1 text-xl font-semibold'>Last Updated: 01/04/2024</h2>

      <br />
      <p>
        This Privacy Policy describes how Rental Review (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, shares, and protects
        information obtained from users (&quot;you&quot; or &quot;your&quot;) of
        the Rental Review website and mobile application (collectively, the
        &quot;Platform&quot;).
      </p>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        1. Information We Collect
      </h2>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Personal Information</span>
        <p>
          We may collect personal information such as your name, email address,
          phone number, and other details you provide when creating an account
          or using our services.
        </p>
      </li>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>User-Generated Content</span>
        <p>
          We collect information you voluntarily submit, including reviews,
          ratings, and comments.
        </p>
      </li>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Usage Data</span>
        <p>
          We automatically collect information about your interactions with the
          Platform, such as your IP address, device information, browser type,
          and pages visited.
        </p>
      </li>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        2. How We Use Your Information
      </h2>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Provide Services</span>
        <p>
          We use your information to deliver the services offered on the
          Platform, including facilitating property reviews, managing user
          accounts, and improving user experience.
        </p>
      </li>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Communication</span>
        <p>
          We may send you notifications, updates, and promotional emails related
          to your use of the Platform. You can opt out of marketing
          communications at any time.
        </p>
      </li>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Analytics</span>
        <p>
          We analyze usage patterns and trends to understand how users interact
          with the Platform, optimize performance, and develop new features.
        </p>
      </li>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        3. Information Sharing
      </h2>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Landlord Information</span>
        <p>
          Landlords may have access to information related to reviews and
          ratings of their properties but do not have access to your personal
          contact information.
        </p>
      </li>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Service Providers</span>
        <p>
          We may share your information with third-party service providers who
          assist us in operating the Platform, such as hosting providers,
          analytics services, and customer support.
        </p>
      </li>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Legal Compliance</span>
        <p>
          We may disclose your information as required by law, court order, or
          legal process, or to protect our rights, property, or safety.
        </p>
      </li>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        4. Data Security
      </h2>
      <p className='ml-10'>
        We implement security measures to protect your information against
        unauthorized access, alteration, disclosure, or destruction. However, no
        method of transmission over the internet or electronic storage is 100%
        secure.
      </p>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        5. Your Choices
      </h2>
      <li className='ml-10 w-fit'>
        <span className='text-accent'>Account Information</span>
        <p>
          You can update account information at any time by accessing your
          account settings. To delete your account, please contact us at{' '}
          <a
            className='text-blue-500 underline transition-colors duration-300 ease-in-out
          hover:text-blue-600'
            href='mailto:help.rentalreview@gmail.com'
          >
            help.rentalreview@gmail.com
          </a>
          .
        </p>
      </li>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        6. Children&apos;s Privacy
      </h2>
      <p className='ml-10'>
        The Platform is not intended for children under the age of 18. We do not
        knowingly collect personal information from children under 18. If you
        believe we have inadvertently collected information from a child under
        18, please contact us immediately.
      </p>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        7. Changes to This Policy
      </h2>
      <p className='ml-10'>
        We reserve the right to update or modify this Privacy Policy at any
        time. We will notify you of any changes by posting the revised policy on
        the Platform with the effective date indicated at the top.
      </p>

      <br />
      <h2 className='text-accent mb-1 w-fit text-2xl font-semibold'>
        8. Contact Us
      </h2>
      <p className='ml-10'>
        If you have any questions, concerns, or feedback regarding this Privacy
        Policy or our privacy practices, please contact us at{' '}
        <a
          className='text-blue-500 underline transition-colors duration-300 ease-in-out
          hover:text-blue-600'
          href='mailto:help.rentalreview@gmail.com'
        >
          help.rentalreview@gmail.com
        </a>
        .
      </p>
    </div>
  </main>
);

export default PrivacyPolicyPage;
