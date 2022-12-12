import io from 'socket.io-client'

// withplus : 192.168.0.60
// aws : https://polls.wplusedu.co.kr

export const socket = io.connect("http://192.168.0.60", { cors: { origin: "*", reconnection: true } });