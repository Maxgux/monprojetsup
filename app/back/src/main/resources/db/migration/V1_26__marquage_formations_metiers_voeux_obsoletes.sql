
ALTER TABLE ref_formation ADD COLUMN obsolete BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE ref_voeu ADD COLUMN obsolete BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE ref_metier ADD COLUMN obsolete BOOLEAN DEFAULT false NOT NULL;
