/**
 * Created by Hassan on 6/16/2017.
 */
export interface Schedule {
  roomId: string,
  notAllocated: boolean,
  fromTimeMillis: number,
  toTimeMillis: number, // timestamp
  fromTime: string,
  toTime: string, // time HH:MM
  break: {
    id: string,
    nameEN: string
    nameFR: string,
    room: string;
  },
  roomSetup: string;
  talk?: any,
  id: string,
  roomCapacity: number,
  roomName: string,
  slotId: string,
  day: string
}
