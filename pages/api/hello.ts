// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

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

  promises.push(axios.get('https://api.github.com/search/commits?q=' + encodeURIComponent('author:ajgmez1 committer-date:>2022-01-01 sort:committer-date') + '&per_page=100&page=1')); // committer-date:>2016-01-01 sort:committer-date-asc'))); // sort:committer-date-asc repo:ajgmez1/rda-grid'));

  await Promise.all(promises)
    .then(([d,g]) => {
      const lc: { calendar: any } = { calendar: {} };
      const gh: { calendar: any } = { calendar: {} };

      const lcCalendarRaw = JSON.parse(d.data.data.matchedUser.userCalendar.submissionCalendar);

      for (const c in lcCalendarRaw) {
        const d = new Date(+c*1000);
        lc.calendar[d.toISOString().substring(0,10)] = lcCalendarRaw[c];
      }

      for (const c of g.data.items) {
        const date =  c.commit.author.date.substring(0,10);
        gh.calendar[date] = gh.calendar[date] ? +gh.calendar[date]+1 : 1;
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
