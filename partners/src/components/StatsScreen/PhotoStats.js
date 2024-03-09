import React, { useState } from 'react';
import './PhotoStats.css';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import PhotoCard from './PhotoCard';
import { MyStudioSlugVar } from '../../graphql/variables';
import {
  PREV_TOP_STUDIO_PHOTO_IDS,
  THIS_TOP_STUDIO_PHOTO_IDS,
} from '../../constants/stats';

const GET_MONTHLY_TOP_STUDIO_PHOTOS = gql`
  query GetMonthlyTopStudioPhotos($slug: String!, $year: Int!, $month: Int!) {
    monthlyTopOriginalViewStudioPhotos(
      input: { studioSlug: $slug, year: $year, month: $month }
    ) {
      studioPhotos {
        id
        count
      }
    }
    monthlyTopHeartStudioPhotos(
      input: { studioSlug: $slug, year: $year, month: $month }
    ) {
      studioPhotos {
        id
        count
      }
    }
  }
`;

const PhotoStats = () => {
  const now = moment().utc();
  const isThisMonthIncluded =
    now.clone().startOf('isoWeek').date() > 1 &&
    now.clone().startOf('isoWeek').month() === now.month();
  const baseMoment = isThisMonthIncluded
    ? now.clone().startOf('month')
    : now.clone().subtract(1, 'month').startOf('month');
  const previousMoment = baseMoment
    .clone()
    .subtract(1, 'month')
    .startOf('month');

  const [currentYear, setCurrentYear] = useState(baseMoment.year());
  const [currentMonth, setCurrentMonth] = useState(baseMoment.month() + 1);

  const slug = useReactiveVar(MyStudioSlugVar);

  const { data, loading } = useQuery(GET_MONTHLY_TOP_STUDIO_PHOTOS, {
    variables: {
      slug,
      year: currentYear,
      month: currentMonth,
    },
  });

  const RenderedThisTotalPhoto = THIS_TOP_STUDIO_PHOTO_IDS.map((id, idx) => {
    return (
      <PhotoCard
        key={id}
        title={'클릭 수 ' + (idx + 1) + '위'}
        photoId={id}
        description={'기간 내 ' + (idx + 1) + '번 째로 많이 클릭된 사진'}
      />
    );
  });

  const RenderedPrevTotalPhoto = PREV_TOP_STUDIO_PHOTO_IDS.map((id, idx) => {
    return (
      <PhotoCard
        key={id}
        title={'클릭 수 ' + (idx + 1) + '위'}
        photoId={id}
        description={'기간 내 ' + (idx + 1) + '번 째로 많이 클릭된 사진'}
      />
    );
  });

  return (
    <div className="photoStatsContainer">
      <div className="weekNavigator">
        <div
          className={
            currentMonth === previousMoment.month() + 1
              ? 'selectedDuration'
              : 'unselectedDuration'
          }
          onClick={
            currentMonth === previousMoment.month() + 1
              ? () => {}
              : () => {
                  setCurrentYear(previousMoment.year());
                  setCurrentMonth(previousMoment.month() + 1);
                }
          }
        >
          {previousMoment.format('YYYY-MM')}
        </div>
        <div
          className={
            currentMonth === baseMoment.month() + 1
              ? 'selectedDuration'
              : 'unselectedDuration'
          }
          onClick={
            currentMonth === baseMoment.month() + 1
              ? () => {}
              : () => {
                  setCurrentYear(baseMoment.year());
                  setCurrentMonth(baseMoment.month() + 1);
                }
          }
        >
          {baseMoment.format('YYYY-MM')}
        </div>
      </div>
      <div className="photoStatsMyStudio">나의 스튜디오</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="PhotoCardContainer">
            {(data?.monthlyTopOriginalViewStudioPhotos?.studioPhotos || []).map(
              (photo, idx) => (
                <PhotoCard
                  key={`${currentYear}-${currentMonth}-${photo.id}`}
                  title={'클릭 수 ' + (idx + 1) + '위'}
                  photoId={photo.id}
                  // click={photo.count}
                  description={
                    '기간 내 ' + (idx + 1) + '번 째로 많이 클릭된 사진'
                  }
                />
              )
            )}
          </div>
          <div className="PhotoCardContainer">
            {(data?.monthlyTopHeartStudioPhotos?.studioPhotos || []).map(
              (photo, idx) => (
                <PhotoCard
                  key={`${currentYear}-${currentMonth}-${photo.id}`}
                  title={'찜하기 수 ' + (idx + 1) + '위'}
                  photoId={photo.id}
                  description={
                    '기간 내 ' + (idx + 1) + '번 째로 많이 찜하기된 사진'
                  }
                />
              )
            )}
          </div>
        </>
      )}
      <div className="photoStatsMyStudio">전체 스튜디오</div>
      <div className="PhotoCardContainer">
        {' '}
        {currentMonth + '' === baseMoment.format('MM')
          ? RenderedThisTotalPhoto
          : RenderedPrevTotalPhoto}
      </div>
    </div>
  );
};

export default PhotoStats;
