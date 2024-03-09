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
        tier
        logoUrl
        coverPhotoUrl
        isHearted
        branches {
          name
          address
          parkingInfo
        }
        heartCount
        lowestPrice
        info {
          contactUrl
          reservationUrl
          weekdayPriceTag
          weekendPriceTag
          studioProduct
          outdoorProduct
          additionalProduct
          description
          reservation
          cancel
        }
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
        maxPeopleCount
        conceptCount
        maxConceptCount
        cutCount
        minuteCount
        description
        weekdayPrice
        weekendPrice
        isOriginalProvided
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
