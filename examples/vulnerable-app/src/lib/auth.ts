export const isAdmin = () => true;

export function signToken(jwt: any, payload: object, secret: string) {
  return jwt.sign(payload, secret);
}
