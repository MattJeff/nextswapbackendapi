import axios from 'axios';
import { sendNotification } from './notification.service';

const VIDEOSDK_API_KEY = process.env.VIDEOSDK_API_KEY || '';
const VIDEOSDK_API_URL = 'https://api.videosdk.live/v2';

export async function createVideoRoom() {
  const res = await axios.post(
    `${VIDEOSDK_API_URL}/rooms`,
    {},
    { headers: { authorization: VIDEOSDK_API_KEY } }
  );
  return (res.data as { roomId: string }).roomId;
}

export async function generateVideoToken(userId: string) {
  const res = await axios.post(
    `${VIDEOSDK_API_URL}/auth/tokens`,
    { userId },
    { headers: { authorization: VIDEOSDK_API_KEY } }
  );
  return (res.data as { token: string }).token;
}

// Pour un match entre deux users, créer la room et générer un token pour chacun
export async function createVideoRoomForMatch(userIdA: string, userIdB: string) {
  const roomId = await createVideoRoom();
  const tokenA = await generateVideoToken(userIdA);
  const tokenB = await generateVideoToken(userIdB);
  // Notifier les deux utilisateurs qu'un appel vidéo commence
  await sendNotification(userIdA, { type: 'video_call_started', roomId, peer: userIdB });
  await sendNotification(userIdB, { type: 'video_call_started', roomId, peer: userIdA });
  return { roomId, tokens: { [userIdA]: tokenA, [userIdB]: tokenB } };
}
