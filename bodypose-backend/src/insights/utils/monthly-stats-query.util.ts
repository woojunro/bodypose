// extract counts of last 6 months
export const getMonthlyStatsSQLQuery = (tableName: string) => `
  SELECT
    DATE(DATE_FORMAT(timestamp, '%Y-%m-01')) AS month_beginning,
    COUNT(*) AS count
  FROM
    ${tableName}
  WHERE
    studioId = ?
  AND
    timestamp >= DATE(DATE_FORMAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), '%Y-%m-01'))
  AND
    timestamp < SUBDATE(CURRENT_DATE(), WEEKDAY(CURRENT_DATE()))
  GROUP BY
    month_beginning
  ORDER BY
    month_beginning
  ;
`;
