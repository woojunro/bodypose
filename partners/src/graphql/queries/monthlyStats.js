import { gql } from '@apollo/client';

export const GET_MONTHLY_STATS = gql`
  query GetMonthlyStats($slug: String!) {
    monthlyStudioInfoView: monthlyStats(
      input: { studioSlug: $slug, type: STUDIO_INFO_VIEW }
    ) {
      stats {
        datetime
        count
      }
    }
    monthlyOriginalPhotoView: monthlyStats(
      input: { studioSlug: $slug, type: ORIGINAL_PHOTO_VIEW }
    ) {
      stats {
        datetime
        count
      }
    }
    monthlyStudioContact: monthlyStats(
      input: { studioSlug: $slug, type: STUDIO_CONTACT }
    ) {
      stats {
        datetime
        count
      }
    }
    monthlyStudioReservation: monthlyStats(
      input: { studioSlug: $slug, type: STUDIO_RESERVATION }
    ) {
      stats {
        datetime
        count
      }
    }
  }
`;
