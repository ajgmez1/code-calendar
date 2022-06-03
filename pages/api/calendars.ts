// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { DateTime } from 'luxon';
import cache from 'memory-cache';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const promises = [];
  let rangeEnd = DateTime.now();
  let rangeStart = rangeEnd.minus({years: 1});
  const cacheKey = 'ajgmez1' + '.' + rangeEnd.toISODate();

  const c = cache.get(cacheKey);
  if (c) {
    res.status(200).json(c);
    return;
  }
  
  promises.push(axios.post('https://leetcode.com/graphql', {
    query: `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }`,
    variables: { username: "ajgmez1" }
  }));

  promises.push(await axios.post('https://api.github.com/graphql', {
    query: `
      query($username: String!, $from: DateTime, $to: DateTime) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }`,
    variables: { 
      username: "ajgmez1", 
      from: rangeStart.toISO(), 
      to: rangeEnd.toISO()
    }
  }, {
    headers: {
      'Authorization': `bearer ${process.env.AUTH_TOKEN}`
    }
  }));

  await Promise.all(promises)
    .then(([d,g]) => {
      const lc: { count: number, calendar: any } = { count: 0, calendar: {} };
      const gh: { count: number, calendar: any } = { count: 0, calendar: {} };

      const lcCalendarRaw = JSON.parse(d.data.data.matchedUser.userCalendar.submissionCalendar);
      const ghCalendarRaw = g.data.data.user.contributionsCollection.contributionCalendar;

      for (let i = 0; i <= 12; i++) {
        const y = rangeStart.year;
        const m = rangeStart.month;
        const day1 = rangeStart.set({day:1});
        const dayStart = i === 0 ? rangeStart.day : 1;
        const dayFinish = i === 12 ? rangeStart.day : rangeStart.daysInMonth;

        const dateInfo = {
          year: rangeStart.year,
          month: rangeStart.month,
          startDayOfWeek: day1.weekday,
          range: [dayStart, dayFinish]
        }

        lc.calendar[y+'-'+m] = lc.calendar[y+'-'+m] ? lc.calendar[y+'-'+m] : {};
        gh.calendar[y+'-'+m] = gh.calendar[y+'-'+m] ? gh.calendar[y+'-'+m] : {};

        lc.calendar[y+'-'+m].info = dateInfo;
        gh.calendar[y+'-'+m].info = { ...dateInfo };
        lc.calendar[y+'-'+m].data = {};
        gh.calendar[y+'-'+m].data = {};

        if (i === 11) {
          rangeStart = rangeEnd;
        } else {
          rangeStart = rangeStart.plus({months:1});
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
      for (const week of ghCalendarRaw.weeks) {

        for (const c of week.contributionDays) {
          const d = DateTime.fromISO(c.date);
          const y = d.year;
          const m = d.month;
          const day = d.day;
          const val = gh.calendar[y+'-'+m].data[day];

          gh.calendar[y+'-'+m].data[day] = c.contributionCount;
          if (c.contributionCount > maxValue) {
            maxValue = c.contributionCount;
          }
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
      gh.count = ghCalendarRaw.totalContributions;

      let json = { lc: lc, gh: gh };
      cache.put(cacheKey, json, 60000);
      
      res.status(d.status).json(json);
    })
    .catch((e) => {
      res.status(e.response.status).json({ error: e });
    })
};
