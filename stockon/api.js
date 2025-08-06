// stockon/api.js
import axios from "axios";
const api = axios.create({
baseURL: "http://192.168.250.45:8001", // Usa tu IP local
headers: {
"Content-Type": "application/json",
},
});
export default api;