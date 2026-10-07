import * as v from 'valibot';

console.log(v.safeParse(v.pipe(v.string(), v.email('')), 'bri'));
