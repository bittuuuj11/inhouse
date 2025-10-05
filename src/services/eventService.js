import { supabase } from '../lib/supabase';

class EventService {
  constructor() {
    this.storageKey = 'smart_event_planner_events';
    this.tableName = 'events';
    this.useSupabase = true;
  }

  async getAllEvents() {
    try {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from(this.tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase error, falling back to localStorage:', error);
          return this.getLocalStorageEvents();
        }

        return data || [];
      }

      return this.getLocalStorageEvents();
    } catch (error) {
      console.error('Error loading events:', error);
      return this.getLocalStorageEvents();
    }
  }

  getLocalStorageEvents() {
    try {
      const eventsJson = localStorage.getItem(this.storageKey);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  async getEventById(id) {
    try {
      if (this.useSupabase) {
        const { data, error } = await supabase
          .from(this.tableName)
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.warn('Supabase error, falling back to localStorage:', error);
          const events = this.getLocalStorageEvents();
          return events.find(event => event.id === id);
        }

        return data;
      }

      const events = this.getLocalStorageEvents();
      return events.find(event => event.id === id);
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }

  async createEvent(eventData) {
    try {
      const newEvent = {
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (this.useSupabase) {
        const { data, error } = await supabase
          .from(this.tableName)
          .insert([newEvent])
          .select()
          .single();

        if (error) {
          console.warn('Supabase error, falling back to localStorage:', error);
          return this.createLocalStorageEvent(eventData);
        }

        return data;
      }

      return this.createLocalStorageEvent(eventData);
    } catch (error) {
      console.error('Error creating event:', error);
      return this.createLocalStorageEvent(eventData);
    }
  }

  createLocalStorageEvent(eventData) {
    try {
      const events = this.getLocalStorageEvents();
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      events.unshift(newEvent);
      localStorage.setItem(this.storageKey, JSON.stringify(events));

      return newEvent;
    } catch (error) {
      console.error('Error creating event in localStorage:', error);
      throw error;
    }
  }

  async updateEvent(id, updates) {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (this.useSupabase) {
        const { data, error } = await supabase
          .from(this.tableName)
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.warn('Supabase error, falling back to localStorage:', error);
          return this.updateLocalStorageEvent(id, updates);
        }

        return data;
      }

      return this.updateLocalStorageEvent(id, updates);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  updateLocalStorageEvent(id, updates) {
    try {
      const events = this.getLocalStorageEvents();
      const index = events.findIndex(event => event.id === id);

      if (index === -1) {
        throw new Error('Event not found');
      }

      events[index] = {
        ...events[index],
        ...updates,
        updated_at: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(events));
      return events[index];
    } catch (error) {
      console.error('Error updating event in localStorage:', error);
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      if (this.useSupabase) {
        const { error } = await supabase
          .from(this.tableName)
          .delete()
          .eq('id', id);

        if (error) {
          console.warn('Supabase error, falling back to localStorage:', error);
          return this.deleteLocalStorageEvent(id);
        }

        return true;
      }

      return this.deleteLocalStorageEvent(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  deleteLocalStorageEvent(id) {
    try {
      const events = this.getLocalStorageEvents();
      const filteredEvents = events.filter(event => event.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredEvents));
      return true;
    } catch (error) {
      console.error('Error deleting event from localStorage:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();
