import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

/**
 * Wraps account-only pages. Signed-out users are bounced to Clerk's
 * sign-in flow and returned here afterwards.
 */
export function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
