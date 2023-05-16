const dataPointSources = [{ value: 'ticketCount', name: 'Total Open Tickets' }];
const today = new Date();
const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const thirtyDaysAgo = new Date().setDate(today.getDate() - 30);
const dayInfo = [];

for (let i = 0; i < 30; i++) {
    const day = new Date(thirtyDaysAgo);
    day.setDate(day.getDate() + i);
    const month = day.getMonth();
    const dayOfMonth = day.getDate();
    const ticketCount = Math.floor(Math.random() * 100);
    dayInfo.push({
        day: `${monthNames[month]} ${dayOfMonth}`,
        ticketCount,
    });
}

export default {
    getDataPointSources() {
        return dataPointSources;
    },
    getDayInfo() {
        return dayInfo;
    },
};
