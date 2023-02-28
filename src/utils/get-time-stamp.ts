const getTimeStamp = (param: number | any) => {
  if (typeof param === 'number') {
    return param;
  }
  const config: any = {
    d: 1000 * 60 * 60 * 24,
    h: 1000 * 60 * 60,
    m: 1000 * 60,
    s: 1000,
  };
  let timestamp = 0;
  for (const key in param) {
    if (config[key]) {
      timestamp += Number(param[key]) * config[key];
    }
  }
  return timestamp;
};
export default getTimeStamp;
