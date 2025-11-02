// lib/emailStore.ts
export interface SimulatedEmail {
  to: string;
  template: string;
  payload: any;
  timestamp: Date;
}

// A simple in-memory store with a pub/sub pattern
const listeners: ((emails: SimulatedEmail[]) => void)[] = [];
let emails: SimulatedEmail[] = [];

export const emailStore = {
  addEmail(email: Omit<SimulatedEmail, 'timestamp'>) {
    const newEmail = { ...email, timestamp: new Date() };
    emails = [newEmail, ...emails];
    listeners.forEach(l => l(emails));
  },
  subscribe(listener: (emails: SimulatedEmail[]) => void): () => void {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },
  getSnapshot(): SimulatedEmail[] {
    return emails;
  },
  clearEmails() {
    emails = [];
    listeners.forEach(l => l(emails));
  }
};
