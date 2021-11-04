// extract counts of last 12 weeks
export const getWeeklyStatsSQLQuery = (tableName: string) => `
  SELECT
    SUBDATE(DATE(timestamp), WEEKDAY(timestamp)) AS week_beginning,
    COUNT(*) AS count
  FROM
    ${tableName}
  WHERE
    studioId = ?
  AND
    timestamp >= SUBDATE(
      DATE_SUB(CURRENT_DATE(), INTERVAL 12 WEEK),
      WEEKDAY(DATE_SUB(CURRENT_DATE(), INTERVAL 12 WEEK))
    )
  AND
    timestamp < SUBDATE(CURRENT_DATE(), WEEKDAY(CURRENT_DATE()))
  GROUP BY
    week_beginning
  ORDER BY
    week_beginning
  ;
`;
