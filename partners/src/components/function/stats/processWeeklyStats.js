import moment from 'moment';

/*
{
  datetime: '2021-08-30T00:00:00.000Z',
  count: 10,
}
*/

const processWeeklyStats = (stats = [], weeks = 12) => {
  const labels = [];
  const data = [];

  for (let i = weeks; i > 0; i--) {
    const monday = moment()
      .utc()
      .subtract(i * 7, 'days')
      .startOf('isoWeek');
    const stat = stats.find(stat => moment(stat.datetime).utc().isSame(monday));
    const count = stat ? stat.count : 0;
    labels.push(monday.format('YYYY-MM-DD'));
    data.push(Number(count));
  }

  return { labels, data };
};

export default processWeeklyStats;
