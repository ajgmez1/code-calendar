// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
// import Cors from 'cors';

type Data = {
  name: string
}

// const cors = initMiddleware(
//   // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
//   Cors({ methods: ['POST'] })
// )

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // axios.post('https://leetcode.com/graphql/', {
  axios.get('https://random-data-api.com/api/company/random_company', {
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    // },
    // body: JSON.stringify(
      // query: `\n    query userProfileCalendar($username: String!, $year: Int) {\n  matchedUser(username: $username) {\n    userCalendar(year: $year) {\n      activeYears\n      streak\n      totalActiveDays\n      dccBadges {\n        timestamp\n        badge {\n          name\n          icon\n        }\n      }\n      submissionCalendar\n    }\n  }\n}\n    ","variables":{"username":"ajgmez1"}}`
  // }, {
    headers: {
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
      },
  })
    .then(data => {
      // console.log('data returned:', data);
      console.log('data returned:', data.headers);
      res.status(200).json({ name: 'John Doe' });
    })
    .catch((e) => {
      console.error('errors: ', e.response.status, e.response.data);
      console.error('headers: ', e);
      res.status(e.response.status).json({ name: '' });
    })
}
