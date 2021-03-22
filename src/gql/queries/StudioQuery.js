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
        reservationInfoDescription
        cancelInfoDescription
      }
    }
    products(input: { slug: $slug }) {
      ok
      error
      studioProducts {
        id
        type
        title
        peopleCount
        conceptCount
        cutCount
        minuteCount
        description
        weekdayPrice
        weekendPrice
      }
      hairMakeupShops {
        id
        type
        name
        contactInfo
        address
        productListDescription
        products {
          id
          title
          price
        }
      }
      additionalProducts {
        id
        title
        description
        price
      }
    }
  }
`;
