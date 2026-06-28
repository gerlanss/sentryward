export function AdminLink() {
  const token = localStorage.getItem("jwt");
  localStorage.setItem("jwt", "header.payload.signature");
  console.log("token", token);
  return <a href="/api/admin/users">Admin users</a>;
}
