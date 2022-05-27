// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { DateTime } from 'luxon';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const promises = [];
  
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
    variables: { username: "ajgmez1", year: 2022 }
  }));

  promises.push(axios.get('https://api.github.com/search/commits?q=' + 
    encodeURIComponent('author:ajgmez1 committer-date:>2022-01-01 sort:committer-date') + 
    '&per_page=100&page=1')); // committer-date:>2016-01-01 sort:committer-date-asc'))); // sort:committer-date-asc repo:ajgmez1/rda-grid'));

  await Promise.all(promises)
    .then(([d,g]) => {
      const lc: { calendar: any } = { calendar: {} };
      const gh: { calendar: any } = { calendar: {} };

      const lcCalendarRaw = JSON.parse(d.data.data.matchedUser.userCalendar.submissionCalendar);

      let last = DateTime.now();
      let first = last.minus({years: 1});
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
        gh.calendar[y+'-'+m].info = dateInfo;
        lc.calendar[y+'-'+m].data = {};
        gh.calendar[y+'-'+m].data = {};

        first = first.plus({months:1});
      }

      for (const c in lcCalendarRaw) {
        const d = DateTime.fromSeconds(+c);
        const y = d.year;
        const m = d.month;
        const day = d.day;

        lc.calendar[y+'-'+m].data[day] = lcCalendarRaw[c];
      }

      for (const c of g.data.items) {
        const d = DateTime.fromISO(c.commit.author.date.substring(0,10));
        const y = d.year;
        const m = d.month;
        const day = d.day;

        gh.calendar[y+'-'+m].data[day] = gh.calendar[y+'-'+m].data[day] ? +gh.calendar[y+'-'+m].data[day]+1 : 1; 
      }

      res.status(d.status).json({
        lc: lc,
        gh: gh
      });
    })
    .catch((e) => {
      console.error('errors: ', e);
      res.status(e.response.status).json({ error: e });
    })
};
