export default function authHeader() {
  const accessToken = JSON.parse(localStorage.getItem("token"));
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}