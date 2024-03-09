import moment from 'moment';

/*
{
  datetime: '2021-08-01T00:00:00.000Z',
  count: 10,
}
*/

const processMonthlyStats = (stats = [], months = 6) => {
  const labels = [];
  const data = [];

  const isThisMonthIncluded =
    moment().utc().startOf('isoWeek').date() > 1 &&
    moment().utc().startOf('isoWeek').month() === moment().utc().month();
  const start = isThisMonthIncluded ? months - 1 : months;
  const end = isThisMonthIncluded ? 0 : 1;
  for (let i = start; i >= end; i--) {
    const firstDayOfMonth = moment()
      .utc()
      .subtract(i, 'months')
      .startOf('month');
    const stat = stats.find(stat =>
      moment(stat.datetime).utc().isSame(firstDayOfMonth)
    );
    const count = stat ? stat.count : 0;
    labels.push(firstDayOfMonth.format('YYYY년 MM월'));
    data.push(Number(count));
  }

  return { labels, data };
};

export default processMonthlyStats;
