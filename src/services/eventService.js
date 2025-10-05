class EventService {
  constructor() {
    this.storageKey = 'smart_event_planner_events';
  }

  async getAllEvents() {
    try {
      const eventsJson = localStorage.getItem(this.storageKey);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }

  async getEventById(id) {
    try {
      const events = await this.getAllEvents();
      return events.find(event => event.id === id);
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }

  async createEvent(eventData) {
    try {
      const events = await this.getAllEvents();
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      events.unshift(newEvent);
      localStorage.setItem(this.storageKey, JSON.stringify(events));

      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  async updateEvent(id, updates) {
    try {
      const events = await this.getAllEvents();
      const index = events.findIndex(event => event.id === id);

      if (index === -1) {
        throw new Error('Event not found');
      }

      events[index] = {
        ...events[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(events));
      return events[index];
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      const events = await this.getAllEvents();
      const filteredEvents = events.filter(event => event.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredEvents));
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();
