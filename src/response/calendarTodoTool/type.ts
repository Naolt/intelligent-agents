interface CalendarTodoResponse {
  status: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

interface ExternalAttendee {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface Checklist {
  text: string;
  isCompleted: boolean;
}

interface GetTodoResponse extends CalendarTodoResponse {
  data: Array<{
    _id: string;
    userId: string;
    label: string;
    description: string;
    priority: string;
    type: string | null;
    tag: string | null;
    location: string | null;
    conference_link: string | null;
    date: string | null;
    lensIds: string[];
    attendees: User[];
    externalAttendees: string[];
    media: string[];
    isCompleted: boolean;
    completedAt: string;
    assignedTo: User;
    deleted: number;
    checklist: Checklist[];
    created_at: string;
    updated_at: string;
    creator: User;
  }>;
}

interface GetEventResponse extends CalendarTodoResponse {
  data: Array<{
    _id: string;
    deleted: number;
    label: string;
    description: string;
    date: {
      start: number;
      end: number;
    };
    type: string;
    link: string | null;
    deepLink: string | null;
    priority: string;
    tag: string;
    location: string;
    conference_link: string | null;
    lensIds: string[];
    media: string[];
    creator: User;
    organizer: User;
    attendees: User[];
    externalAttendees: ExternalAttendee[];
    family_group_id: string | null;
    chatroomId: string | null;
    tags: string | null;
    cardIds: string | null;
    alarm: string | null;
    repeat: string | null;
    deviceCalendarId: string | null;
    deviceEventId: string | null;
    created_at: string;
    updated_at: string;
    image_url: string | null;
  }>;
}

export type { GetTodoResponse, GetEventResponse };
