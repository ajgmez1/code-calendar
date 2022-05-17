// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Data = {
  data: {}
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await axios.post('https://leetcode.com/graphql/', {
      query: `\n    query userProfileCalendar($username: String!, $year: Int) {\n  matchedUser(username: $username) {\n    userCalendar(year: $year) {\n      activeYears\n      streak\n      totalActiveDays\n      dccBadges {\n        timestamp\n        badge {\n          name\n          icon\n        }\n      }\n      submissionCalendar\n    }\n  }\n}\n    `,
      variables: { username: "ajgmez1" }
  })
    .then((d) => {
      res.status(d.status).json(d.data.data.matchedUser.userCalendar);
    })
    .catch((e) => {
      console.error('errors: ', e);
      res.status(e.response.status).json({ error: e });
    })
}
