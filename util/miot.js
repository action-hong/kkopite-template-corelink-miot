export function p2k(commands) {
  return Object.entries(commands)
    .map(([key, obj]) => ({ [obj.prop]: key }))
    .reduce((prev, cur) => ({
      ...prev,
      ...cur
    }), {});
}

export function mp(commands) {
  return Object.keys(commands).map((key) => ({
    ...commands[key],
    key
  }));
}