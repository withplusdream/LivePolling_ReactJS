import io from "socket.io-client";

const environment = process.env.NODE_ENV;

// * 현재 연결된 와이파이 ip로 설정
export const socket = io.connect(
  environment === "development" ? "http://192.168.0.50" : "https://polls.wplusedu.co.kr",
  { cors: { origin: "*", reconnection: true } }
);
