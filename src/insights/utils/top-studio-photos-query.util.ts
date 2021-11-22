// Original photo view TOP 3 photos (monthly)
// SQL parameters: studioId, year, month
export const getTopOriginalViewStudioPhotosSQLQuery = (tableName: string) => `
  SELECT
    studioPhotoId AS studio_photo_id,
    COUNT(*) AS view_count
  FROM
    ${tableName}
  WHERE
    studioId = ?
  AND
    YEAR(timestamp) = ?
  AND
    MONTH(timestamp) = ?
  GROUP BY
    studio_photo_id
  ORDER BY
    view_count DESC,
    studio_photo_id DESC
  LIMIT
    3
  ;
`;

// Heart TOP 3 photos (monthly)
// SQL parameters: studioId, year, month
export const getTopHeartStudioPhotosSQLQuery = (tableName: string) => `
  SELECT
    h.studioPhotoId AS studio_photo_id,
    COUNT(*) AS heart_count
  FROM
    ${tableName} h
  LEFT JOIN
    studio_photo p
  ON
    h.studioPhotoId = p.id
  WHERE
    p.studioId = ?
  AND
    YEAR(h.heartAt) = ?
  AND
    MONTH(h.heartAt) = ?
  GROUP BY
    studio_photo_id
  ORDER BY
    heart_count DESC,
    studio_photo_id DESC
  LIMIT
    3
  ;
`;
