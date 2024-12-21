export function createQueryParameter(targetObject: object): string {
  const queryParameter = Object.entries(targetObject)
    .filter(([key, value]) => key !== undefined && value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return queryParameter;
}
