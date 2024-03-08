import { gql } from '@apollo/client';

export const RESEND_VERIFICATION_MAIL_MUTATION = gql`
  mutation resendVerificationMail {
    resendVerificationMail {
      ok
      error
    }
  }
`;
