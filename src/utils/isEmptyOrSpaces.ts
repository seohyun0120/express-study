export default function isEmptyOrSpaces(str: string) {
  const reg = /^\s*$/;
  return (!str || reg.test(str));
}