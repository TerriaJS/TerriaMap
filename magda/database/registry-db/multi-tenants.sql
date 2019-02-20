DROP TABLE public.recordaspects;
DROP TABLE public.records;
DROP TABLE public.tenants;

-- SEQUENCE: public.tenants_id_seq

DROP SEQUENCE public.tenants_id_seq;

CREATE SEQUENCE public.tenants_id_seq;

ALTER SEQUENCE public.tenants_id_seq
    OWNER TO postgres;

GRANT ALL ON SEQUENCE public.tenants_id_seq TO postgres;

GRANT SELECT, USAGE ON SEQUENCE public.tenants_id_seq TO client;

-- SEQUENCE: public.records_sequence_seq

DROP SEQUENCE public.records_sequence_seq;

CREATE SEQUENCE public.records_sequence_seq;

ALTER SEQUENCE public.records_sequence_seq
    OWNER TO postgres;

GRANT ALL ON SEQUENCE public.records_sequence_seq TO postgres;

GRANT SELECT, USAGE ON SEQUENCE public.records_sequence_seq TO client;

-- Table: public.tenants

CREATE TABLE public.tenants
(
    domainname character varying(100) COLLATE pg_catalog."default" NOT NULL,
    id bigint NOT NULL DEFAULT nextval('tenants_id_seq'::regclass),
    description character varying(1000) COLLATE pg_catalog."default",
    CONSTRAINT tenants_pkey PRIMARY KEY (domainname),
    CONSTRAINT tenants_id_key UNIQUE (id)

)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tenants
    OWNER to postgres;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.tenants TO client;

GRANT ALL ON TABLE public.tenants TO postgres;

INSERT INTO public.tenants(
	domainname, id, description)
	VALUES ('default', 0, 'default tenant');

INSERT INTO public.tenants(
	domainname, description)
	VALUES ('demo1.terria.magda', 'terria map demo1');

INSERT INTO public.tenants(
	domainname, description)
	VALUES ('demo2.terria.magda', 'terria map demo2');

-- Table: public.records

CREATE TABLE public.records
(
    recordid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    sequence bigint NOT NULL DEFAULT nextval('records_sequence_seq'::regclass),
    name character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    lastupdate bigint NOT NULL,
    sourcetag character varying COLLATE pg_catalog."default",
    tenantid bigint NOT NULL,
    CONSTRAINT records_pkey PRIMARY KEY (recordid, tenantid),
    CONSTRAINT records_sequence_key UNIQUE (sequence)
,
    CONSTRAINT records_lastupdate_fkey FOREIGN KEY (lastupdate)
        REFERENCES public.events (eventid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT records_tenantid_fkey FOREIGN KEY (tenantid)
        REFERENCES public.tenants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.records
    OWNER to postgres;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.records TO client;

GRANT ALL ON TABLE public.records TO postgres;

-- Index: records_sourcetag_idx

-- DROP INDEX public.records_sourcetag_idx;

CREATE INDEX records_sourcetag_idx
    ON public.records USING btree
    (sourcetag COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Table: public.recordaspects

CREATE TABLE public.recordaspects
(
    recordid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    aspectid character varying(100) COLLATE pg_catalog."default" NOT NULL,
    lastupdate bigint NOT NULL,
    data jsonb NOT NULL,
    tenantid bigint NOT NULL,
    CONSTRAINT recordaspects_pkey PRIMARY KEY (recordid, tenantid, aspectid),
    CONSTRAINT recordaspects_aspectid_fkey FOREIGN KEY (aspectid)
        REFERENCES public.aspects (aspectid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT recordaspects_lastupdate_fkey FOREIGN KEY (lastupdate)
        REFERENCES public.events (eventid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT recordaspects_recordid_tenantid_fkey FOREIGN KEY (recordid, tenantid)
        REFERENCES public.records (recordid, tenantid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT recordaspects_tenantid_fkey FOREIGN KEY (tenantid)
        REFERENCES public.tenants (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.recordaspects
    OWNER to postgres;

GRANT ALL ON TABLE public.recordaspects TO postgres;

GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public.recordaspects TO client;

-- Index: recordaspects_aspectid_idx

-- DROP INDEX public.recordaspects_aspectid_idx;

CREATE INDEX recordaspects_aspectid_idx
    ON public.recordaspects USING btree
    (aspectid COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: recordaspects_id_idx

-- DROP INDEX public.recordaspects_id_idx;

CREATE INDEX recordaspects_id_idx
    ON public.recordaspects USING btree
    ((data ->> 'id'::text) COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: recordaspects_recordid_idx

-- DROP INDEX public.recordaspects_recordid_idx;

CREATE INDEX recordaspects_recordid_idx
    ON public.recordaspects USING btree
    (recordid COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: recordsaspects_data_distributions_gin_idx

-- DROP INDEX public.recordsaspects_data_distributions_gin_idx;

CREATE INDEX recordsaspects_data_distributions_gin_idx
    ON public.recordaspects USING gin
    ((data -> 'distributions'::text))
    TABLESPACE pg_default;

