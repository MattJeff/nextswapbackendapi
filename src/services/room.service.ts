// Gestion avancée des rooms vidéo (expiration, historique)
interface RoomHistory {
  roomId: string;
  users: string[];
  createdAt: Date;
  endedAt?: Date;
}

const roomHistories: RoomHistory[] = [];

export function addRoomHistory(roomId: string, users: string[]) {
  roomHistories.push({ roomId, users, createdAt: new Date() });
}

export function endRoom(roomId: string) {
  const room = roomHistories.find(r => r.roomId === roomId);
  if (room) room.endedAt = new Date();
}

export function getRoomHistory(userId: string) {
  return roomHistories.filter(r => r.users.includes(userId));
}
