import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 100,
  duration: '20s',
};

export default function () {
  let res = http.get('http://localhost:8000/products/');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
