/*
  # Smart Event Planner - Events Table

  ## Description
  This migration creates the main events table for storing event planning data.

  ## Tables Created
  - `events` - Stores all event information including details, metadata, and timestamps

  ## Columns
  - `id` (uuid, primary key) - Unique identifier for each event
  - `event_name` (text) - Name/title of the event
  - `event_type` (text) - Type of event (e.g., Corporate Conference, Wedding, etc.)
  - `description` (text) - Detailed description of the event
  - `date` (date) - Event date
  - `time` (text) - Event time
  - `location` (text) - Event location/venue name
  - `city` (text) - City where event will be held
  - `venue_type` (text) - Type of venue
  - `audience_size` (integer) - Expected number of attendees
  - `duration` (integer) - Event duration in hours
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ## Security
  - Row Level Security (RLS) is enabled
  - Public read access for all events
  - Public insert/update access (can be restricted later based on auth requirements)

  ## Notes
  - All timestamps use UTC timezone
  - Event data is stored in a flexible format to accommodate various event types
  - Can be extended with user authentication and ownership in future updates
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_type text,
  description text,
  date date,
  time text,
  location text,
  city text,
  venue_type text,
  audience_size integer DEFAULT 0,
  duration integer DEFAULT 4,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
CREATE POLICY "Enable read access for all users"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON events
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON events
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON events
  FOR DELETE
  TO public
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS events_event_type_idx ON events(event_type);
CREATE INDEX IF NOT EXISTS events_city_idx ON events(city);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
