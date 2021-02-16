import { gql } from '@apollo/client';

export const STUDIO_QUERY = gql`
  query GetStudio($slug: String!) {
    studio(input: { slug: $slug }) {
      ok
      error
      studio {
        id
        name
        slug
        logoUrl
        contactUrl
        reservationUrl
        branches {
          name
          address
        }
        premiumTier
        heartCount
        totalRating
        reviewCount
        isOriginalPhotoProvided
        lowestPrice
        parkingInfoDescription
        studioProductListDescription
        outdoorProductListDescription
        weekdayPriceTag
        weekendPriceTag
        additionalProductListDescription
        isHearted
      }
    }
  }
`;
