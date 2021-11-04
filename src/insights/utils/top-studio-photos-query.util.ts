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
