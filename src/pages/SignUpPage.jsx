import { SignUp } from '@clerk/clerk-react';

export function SignUpPage() {
  return (
    <div className="container-px mx-auto flex min-h-[70vh] flex-col items-center justify-center py-16">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={{
          variables: {
            colorPrimary: '#111111',
            colorText: '#111111',
            colorBackground: '#FFFFFF',
            borderRadius: '12px',
            fontFamily: '"Inter", sans-serif',
          },
          elements: {
            card: 'shadow-none border border-[#E7E7E7]',
            formButtonPrimary:
              'bg-[#111111] hover:bg-black/85 text-sm font-semibold normal-case',
            footerActionLink: 'text-[#111111]',
          },
        }}
      />
    </div>
  );
}
