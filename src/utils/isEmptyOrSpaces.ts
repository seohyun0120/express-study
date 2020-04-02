export default function isEmptyOrSpaces(str: string) {
  const reg = /^$|\s/;
  return reg.test(str);
}