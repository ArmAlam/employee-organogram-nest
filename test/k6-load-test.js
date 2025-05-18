import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 5000,
  duration: '30s',
};

// TODO: CONFIGURE THE URL FROM ENVIRONMENT VARIABLE

export default function () {
  const res = http.get('http://localhost:3000/employees/1/subordinates');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response body has subordinates': (r) =>
      r.json('subordinates') !== undefined,
  });
}
