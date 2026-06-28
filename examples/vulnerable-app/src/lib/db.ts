export async function findUser(db: any, userId: string) {
  return db.query(`SELECT * FROM users WHERE id = ${userId}`);
}

export async function deleteEverything(db: any) {
  return db.$queryRawUnsafe("DELETE FROM users");
}
