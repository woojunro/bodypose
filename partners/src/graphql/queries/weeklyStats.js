import { gql } from '@apollo/client';

export const GET_WEEKLY_STATS = gql`
  query GetWeeklyStats($slug: String!) {
    weeklyStudioInfoView: weeklyStats(
      input: { studioSlug: $slug, type: STUDIO_INFO_VIEW }
    ) {
      stats {
        datetime
        count
      }
    }
    weeklyOriginalPhotoView: weeklyStats(
      input: { studioSlug: $slug, type: ORIGINAL_PHOTO_VIEW }
    ) {
      stats {
        datetime
        count
      }
    }
    weeklyStudioContact: weeklyStats(
      input: { studioSlug: $slug, type: STUDIO_CONTACT }
    ) {
      stats {
        datetime
        count
      }
    }
    weeklyStudioReservation: weeklyStats(
      input: { studioSlug: $slug, type: STUDIO_RESERVATION }
    ) {
      stats {
        datetime
        count
      }
    }
  }
`;
