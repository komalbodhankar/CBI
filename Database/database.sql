CREATE TABLE IF NOT EXISTS public.buildingpermits
(
    id integer NOT NULL DEFAULT nextval('buildingpermits_id_seq'::regclass),
    "buildPermitId" bigint,
    "permitId" bigint,
    "permitType" character varying(255) COLLATE pg_catalog."default",
    address character varying(255) COLLATE pg_catalog."default",
    zipcode character varying(255) COLLATE pg_catalog."default",
    communityarea bigint,
    latitude double precision,
    longitude double precision,
    totalpaid double precision,
    totalunpaid double precision,
    totalwaived double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT buildingpermits_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.healthhumanservices
(
    "CasesTotal" integer,
    "DeathTotal" character varying(255) COLLATE pg_catalog."default",
    "HospitalizationsTotal" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
)

CREATE TABLE IF NOT EXISTS public.ethnicitycovid19
(
    labreportdate character varying(50) COLLATE pg_catalog."default",
    casestotal character varying(50) COLLATE pg_catalog."default",
    deathstotal character varying(50) COLLATE pg_catalog."default",
    hospitalizationstotal character varying(50) COLLATE pg_catalog."default",
    caseslatinx character varying(50) COLLATE pg_catalog."default",
    casesasiannonlatinx character varying(50) COLLATE pg_catalog."default",
    casesblacknonlatinx character varying(50) COLLATE pg_catalog."default",
    caseswhitenonlatinx character varying(50) COLLATE pg_catalog."default",
    casesothernonlatinx character varying(50) COLLATE pg_catalog."default",
    casesunknownraceeth character varying(50) COLLATE pg_catalog."default",
    deathslatinx character varying(50) COLLATE pg_catalog."default",
    deathsasiannonlatinx character varying(50) COLLATE pg_catalog."default",
    deathsblacknonlatinx character varying(50) COLLATE pg_catalog."default",
    deathswhitenonlatinx character varying(50) COLLATE pg_catalog."default",
    deathsothernonlatinx character varying(50) COLLATE pg_catalog."default",
    deathsunknownraceeth character varying(50) COLLATE pg_catalog."default",
    hospitalizationslatinx character varying(50) COLLATE pg_catalog."default",
    hospitalizationsasiannonlatinx character varying(50) COLLATE pg_catalog."default",
    hospitalizationsblacknonlatinx character varying(50) COLLATE pg_catalog."default",
    hospitalizationswhitenonlatinx character varying(50) COLLATE pg_catalog."default",
    hospitalizationsothernonlatinx character varying(50) COLLATE pg_catalog."default",
    hospitalizationsunknownraceeth character varying(50) COLLATE pg_catalog."default",
    createdat timestamp with time zone NOT NULL,
    updatedat timestamp with time zone NOT NULL
)

CREATE TABLE IF NOT EXISTS public.taxitrips
(
    tripid character varying(500) COLLATE pg_catalog."default",
    taxiid character varying(500) COLLATE pg_catalog."default",
    tripstarttimestamp character varying(500) COLLATE pg_catalog."default",
    tripendtimestamp character varying(500) COLLATE pg_catalog."default",
    tripseconds character varying(500) COLLATE pg_catalog."default",
    tripmiles character varying(500) COLLATE pg_catalog."default",
    pickupcommunityarea character varying(500) COLLATE pg_catalog."default",
    dropoffcommunityarea character varying(500) COLLATE pg_catalog."default",
    fare character varying(500) COLLATE pg_catalog."default",
    tips character varying(500) COLLATE pg_catalog."default",
    tolls character varying(500) COLLATE pg_catalog."default",
    extras character varying(500) COLLATE pg_catalog."default",
    triptotal character varying(500) COLLATE pg_catalog."default",
    paymenttype character varying(500) COLLATE pg_catalog."default",
    company character varying(500) COLLATE pg_catalog."default",
    pickupcentroidlatitude character varying(500) COLLATE pg_catalog."default",
    pickupcentroidlongitude character varying(500) COLLATE pg_catalog."default",
    dropoffcentroidlatitude character varying(500) COLLATE pg_catalog."default",
    dropoffcentroidlongitude character varying(500) COLLATE pg_catalog."default",
    pzipcode character varying(500) COLLATE pg_catalog."default",
    dzipcode character varying(500) COLLATE pg_catalog."default",
    createdat timestamp with time zone NOT NULL,
    updatedat timestamp with time zone NOT NULL
)

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "firstName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "lastName" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "userType" character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
)

CREATE TABLE IF NOT EXISTS public.community_area_zipcode
(
    id integer NOT NULL DEFAULT nextval('community_area_zipcode_id_seq'::regclass),
    "communityAreaNumber" bigint,
    "communityAreaName" character varying(255) COLLATE pg_catalog."default",
    "communityAreaZipCode" character varying(255) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT community_area_zipcode_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.unemployment_data
(
    id integer NOT NULL DEFAULT nextval('unemployment_data_id_seq'::regclass),
    "areaCode" bigint,
    "areaName" character varying(255) COLLATE pg_catalog."default",
    "belowPoverty" double precision,
    "perCapita" double precision,
    "unempRate" double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT unemployment_data_pkey PRIMARY KEY (id)
)
