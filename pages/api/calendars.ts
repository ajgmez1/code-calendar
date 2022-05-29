// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { DateTime } from 'luxon';

const cache: {
  time: any;
  json: any;
} = {
  time: DateTime.now(),
  json: undefined
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const promises = [];
  let last = DateTime.now();
  let first = last.minus({years: 1});

  if (cache.json && cache.time.diffNow('minutes').minutes > -1) {
    res.status(200).json(cache.json);
    return;
  }
  cache.time = DateTime.now();
  
  promises.push(axios.post('https://leetcode.com/graphql', {
    query: `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
            submissionCalendar
          }
        }
      }`,
    variables: { username: "ajgmez1" }
  }));

  promises.push(axios.get('https://api.github.com/search/commits?q=' + 
    encodeURIComponent(`author:ajgmez1 committer-date:>${first.toISODate()} sort:committer-date`) + 
    '&per_page=100&page=1'));

  await Promise.all(promises)
    .then(([d,g]) => {
      const lc: { count: number, calendar: any } = { count: 0, calendar: {} };
      const gh: { count: number, calendar: any } = { count: 0, calendar: {} };

      const lcCalendarRaw = JSON.parse(d.data.data.matchedUser.userCalendar.submissionCalendar);

      for (let i = 0; i <= 12; i++) {
        const y = first.year;
        const m = first.month;
        const day1 = first.set({day:1});
        const start = i === 0 ? first.day : 1;
        const finish = i === 12 ? first.day : first.daysInMonth;

        const dateInfo = {
          year: first.year,
          month: first.month,
          startDayOfWeek: day1.weekday,
          range: [start, finish]
        }

        lc.calendar[y+'-'+m] = lc.calendar[y+'-'+m] ? lc.calendar[y+'-'+m] : {};
        gh.calendar[y+'-'+m] = gh.calendar[y+'-'+m] ? gh.calendar[y+'-'+m] : {};

        lc.calendar[y+'-'+m].info = dateInfo;
        gh.calendar[y+'-'+m].info = { ...dateInfo };
        lc.calendar[y+'-'+m].data = {};
        gh.calendar[y+'-'+m].data = {};

        if (i === 11) {
          first = last;
        } else {
          first = first.plus({months:1});
        }
      }

      let maxValue = 0;
      let count = 0;
      for (const c in lcCalendarRaw) {
        const d = DateTime.fromSeconds(+c, { zone: 'utc' });
        const y = d.year;
        const m = d.month;
        const day = d.day;

        lc.calendar[y+'-'+m].data[day] = lcCalendarRaw[c];
        if (lcCalendarRaw[c] > maxValue) {
          maxValue = lcCalendarRaw[c];
        }
        count += lcCalendarRaw[c];
      }

      const lcColorRange = [0,1,2,3,4];
      if (maxValue > lcColorRange[4]) {
        let diff = Math.floor(maxValue / 2);
        lcColorRange[4] = maxValue;
        lcColorRange[3] = maxValue - diff;
        lcColorRange[2] = maxValue - diff * 1.5;
        lcColorRange[1] = maxValue - diff * 1.75;
      }

      maxValue = 0;
      for (const c of g.data.items) {
        const d = DateTime.fromISO(c.commit.author.date.substring(0,10));
        const y = d.year;
        const m = d.month;
        const day = d.day;
        const val = gh.calendar[y+'-'+m].data[day];

        gh.calendar[y+'-'+m].data[day] = val ? +val+1 : 1; 
        if (gh.calendar[y+'-'+m].data[day]  > maxValue) {
          maxValue = gh.calendar[y+'-'+m].data[day] ;
        }
      }

      const ghColorRange = [0,1,2,3,4];
      if (maxValue > ghColorRange[4]) {
        let diff = Math.floor(maxValue / 2);
        ghColorRange[4] = maxValue;
        ghColorRange[3] = maxValue - diff;
        ghColorRange[2] = maxValue - diff * 1.5;
        ghColorRange[1] = maxValue - diff * 1.75;
      }

      for (const c in gh.calendar) {
        gh.calendar[c].info.colorRange = ghColorRange;
      }

      for (const k in lc.calendar) {
        lc.calendar[k].info.colorRange = lcColorRange;
      }

      lc.count = count;
      gh.count = g.data.total_count;

      let json = { lc: lc, gh: gh };
      cache.json = json;
      
      res.status(d.status).json(json);
    })
    .catch((e) => {
      console.error('errors: ', e);
      res.status(e.response.status).json({ error: e });
    })
};
