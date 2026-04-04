export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    dj: string;
    description: string;
    imageUrl?: string;
}

export interface UserRegistration {
    id: string;
    eventId: string;
    userName: string;
    userEmail: string;
    status: 'pending' | 'confirmed' | 'checked-in';
    qrCode: string;
    createdAt: Date;
}

export interface Venue {
    id: string;
    name: string;
    email: string;
}
