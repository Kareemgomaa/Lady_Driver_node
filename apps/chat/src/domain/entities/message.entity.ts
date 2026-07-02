export class Message {
  id!: string;
  tripId!: string;
  senderId!: string;
  message!: string;
  location?: { lat: number; lng: number };
  seen!: boolean;
  createdAt!: Date;

  constructor(props: Partial<Message>) {
    Object.assign(this, props);
  }
}
