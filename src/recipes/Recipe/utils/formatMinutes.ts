import { formatDuration, intervalToDuration } from 'date-fns';

const formatMinutes = (totalMinutes: number | undefined) => {
    const duration = intervalToDuration({ start: 0, end: (totalMinutes || 0) * 60 * 1000 });
    return formatDuration(duration, { format: ['hours', 'minutes'] });
};

export default formatMinutes;