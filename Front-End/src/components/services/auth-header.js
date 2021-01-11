export default function authHeader() {
  const accessToken = JSON.parse(localStorage.getItem("token"));
  console.log(accessToken)
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}