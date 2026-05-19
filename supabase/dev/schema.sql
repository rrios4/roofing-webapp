


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."ensure_single_default_account"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- If setting this account as default, unset all other defaults for this provider
  IF NEW.is_default = TRUE THEN
    UPDATE connected_accounts 
    SET is_default = FALSE, updated_at = NOW()
    WHERE user_id = NEW.user_id 
      AND provider = NEW.provider 
      AND id != COALESCE(NEW.id, gen_random_uuid());
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."ensure_single_default_account"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."f_delfunc"("_name" "text", OUT "functions_dropped" integer) RETURNS integer
    LANGUAGE "plpgsql"
    AS $$
DECLARE
   _sql text;
BEGIN
   SELECT count(*)::int
        , 'DROP FUNCTION ' || string_agg(oid::regprocedure::text, '; DROP FUNCTION ')
   FROM   pg_catalog.pg_proc
   WHERE  proname = _name
   AND    pg_function_is_visible(oid)  -- restrict to current search_path
   INTO   functions_dropped, _sql;     -- count only returned if subsequent DROPs succeed

   IF functions_dropped > 0 THEN       -- only if function(s) found
     EXECUTE _sql;
   END IF;
END
$$;


ALTER FUNCTION "public"."f_delfunc"("_name" "text", OUT "functions_dropped" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_month_revenue_with_percentage_change"() RETURNS TABLE("monthly_revenue" double precision, "percentage_change" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
WITH current_month_revenue AS (
    SELECT COALESCE(sum(amount), 0) as monthly_revenue
    FROM invoice_payment
    WHERE date_received >= date_trunc('month', CURRENT_DATE)
)
, last_month_revenue AS (
    SELECT COALESCE(sum(amount), 0) as last_month_revenue
    FROM invoice_payment
    WHERE date_received >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
    AND date_received < date_trunc('month', CURRENT_DATE)
)
SELECT 
    current_month_revenue.monthly_revenue,
    (current_month_revenue.monthly_revenue / 
    CASE
        WHEN last_month_revenue.last_month_revenue = 0 THEN 1
        ELSE last_month_revenue.last_month_revenue
    END) as percent_change
FROM current_month_revenue, last_month_revenue;

END
$$;


ALTER FUNCTION "public"."get_current_month_revenue_with_percentage_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_current_year_total_revenue_with_percent_change"() RETURNS TABLE("current_year_revenue" double precision, "percent_change" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
WITH current_year_revenue AS (
    SELECT COALESCE(sum(amount), 0) as current_year_revenue
    FROM invoice_payment
    WHERE date_received >= date_trunc('year', CURRENT_DATE)
)
, last_year_revenue AS (
    SELECT COALESCE(sum(amount), 0) as last_year_revenue
    FROM invoice_payment
    WHERE date_received >= date_trunc('year', CURRENT_DATE - INTERVAL '1 year')
    AND date_received < date_trunc('year', CURRENT_DATE)
)
SELECT 
    current_year_revenue.current_year_revenue,
    (current_year_revenue.current_year_revenue - last_year_revenue.last_year_revenue) /
    CASE
        WHEN last_year_revenue.last_year_revenue = 0 THEN 1
        ELSE last_year_revenue.last_year_revenue
    END * 100 as percent_change
FROM current_year_revenue, last_year_revenue;


END
$$;


ALTER FUNCTION "public"."get_current_year_total_revenue_with_percent_change"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_monthly_invoice_revenue_dataset"("year_input" numeric) RETURNS TABLE("month" integer, "month_total" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
WITH months AS (
  SELECT
    generate_series(1, 12) AS month
)
SELECT
  months.month,
  COALESCE(SUM(invoice_payment.amount),0) AS month_total
FROM
  months
  LEFT JOIN invoice_payment ON months.month = EXTRACT(MONTH FROM invoice_payment.date_received)
    AND EXTRACT(YEAR FROM invoice_payment.date_received) = year_input
GROUP BY
  months.month
ORDER BY
  months.month;

END
$$;


ALTER FUNCTION "public"."get_monthly_invoice_revenue_dataset"("year_input" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."max_invoice_number"() RETURNS integer
    LANGUAGE "sql"
    AS $$
  select max(invoice_number) from invoice;
$$;


ALTER FUNCTION "public"."max_invoice_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_connected_accounts_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_connected_accounts_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_invoice_amount_due"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE invoice
    SET amount_due = amount_due + OLD.amount,
    updated_at = current_timestamp
    WHERE invoice_number = OLD.invoice_id;
  ELSE
    UPDATE invoice
    SET amount_due = total - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payment WHERE invoice_id = NEW.invoice_id),
    updated_at = current_timestamp
    WHERE invoice_number = NEW.invoice_id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_invoice_amount_due"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_invoice_amount_due_on_payment"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    UPDATE invoice
    SET amount_due = (total - NEW.amount)
    WHERE invoice_number = NEW.invoice_id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_invoice_amount_due_on_payment"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_invoice_totals"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE invoice
    SET subtotal = subtotal - OLD.amount,
        total = total - OLD.amount,
        amount_due = amount_due - OLD.amount,
        updated_at = current_timestamp
    WHERE invoice_number = OLD.invoice_id;
  ELSE
    UPDATE invoice
    SET subtotal = (SELECT COALESCE(SUM(amount), 0) FROM invoice_line_service WHERE invoice_id = NEW.invoice_id),
        total = (SELECT COALESCE(SUM(amount), 0) FROM invoice_line_service WHERE invoice_id = NEW.invoice_id),
        amount_due = (SELECT COALESCE(SUM(amount), 0) FROM invoice_line_service WHERE invoice_id = NEW.invoice_id) - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payment WHERE invoice_id = NEW.invoice_id),
        updated_at = current_timestamp
    WHERE invoice_number = NEW.invoice_id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_invoice_totals"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_quote_totals"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE quote
    SET subtotal = subtotal - OLD.amount,
        total = total - OLD.amount,
        updated_at = current_timestamp
    WHERE quote_number = OLD.quote_id;
  ELSE
    UPDATE quote
    SET subtotal = (SELECT COALESCE(SUM(amount), 0) FROM quote_line_item WHERE quote_id = NEW.quote_id),
        total = (SELECT COALESCE(SUM(amount), 0) FROM quote_line_item WHERE quote_id = NEW.quote_id),
        updated_at = current_timestamp
    WHERE quote_number = NEW.quote_id;
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_quote_totals"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."connected_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "provider" character varying(20) NOT NULL,
    "account_email" character varying(255) NOT NULL,
    "account_name" character varying(255) NOT NULL,
    "account_id" character varying(255) NOT NULL,
    "access_token" "text" NOT NULL,
    "refresh_token" "text",
    "token_expires_at" timestamp with time zone,
    "scopes" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "connected_accounts_provider_check" CHECK ((("provider")::"text" = ANY ((ARRAY['google'::character varying, 'microsoft'::character varying, 'other'::character varying])::"text"[]))),
    CONSTRAINT "valid_email" CHECK ((("account_email")::"text" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::"text"))
);


ALTER TABLE "public"."connected_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customer" (
    "id" bigint NOT NULL,
    "customer_type_id" bigint NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "street_address" "text",
    "city" "text",
    "zipcode" "text",
    "phone_number" "text",
    "email" "text" NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "company_name" "text",
    "state" "text"
);


ALTER TABLE "public"."customer" OWNER TO "postgres";


COMMENT ON TABLE "public"."customer" IS 'Table that stores all the customers for roofing company';



ALTER TABLE "public"."customer" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."customer_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."customer_type" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customer_type" OWNER TO "postgres";


COMMENT ON TABLE "public"."customer_type" IS 'Table that stores all types of customer the roofing company deals with';



ALTER TABLE "public"."customer_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."customer_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."quote_request" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "service_type_id" bigint,
    "customer_typeID" bigint NOT NULL,
    "firstName" "text",
    "lastName" "text",
    "streetAddress" "text",
    "city" "text",
    "zipcode" "text",
    "email" "text" NOT NULL,
    "custom_service" "text",
    "requested_date" "date",
    "est_request_status_id" bigint DEFAULT '1'::bigint NOT NULL,
    "state" "text",
    "phone_number" "text",
    "updated_at" timestamp with time zone,
    "details" "text"
);


ALTER TABLE "public"."quote_request" OWNER TO "postgres";


COMMENT ON TABLE "public"."quote_request" IS 'Customer request for aa quote based on the service the roofing company offers.';



COMMENT ON COLUMN "public"."quote_request"."phone_number" IS 'The requesters phone number can be used to schedule or confirm a date where roofing company will visit to measure the home to create a quote.';



COMMENT ON COLUMN "public"."quote_request"."updated_at" IS 'When changes are made to the data a date will go along side it =.';



ALTER TABLE "public"."quote_request" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."estimate_request_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."quote_request_status" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."quote_request_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."quote_request_status" IS 'Table that stores all the status for a estimate request submitted by the customer';



ALTER TABLE "public"."quote_request_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."estimate_request_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invoice" (
    "id" bigint NOT NULL,
    "invoice_number" bigint NOT NULL,
    "customer_id" bigint NOT NULL,
    "service_type_id" bigint,
    "invoice_status_id" bigint,
    "invoice_date" "date",
    "issue_date" "date",
    "due_date" "date",
    "subtotal" double precision,
    "total" double precision,
    "sqft_measurement" "text",
    "note" "text",
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "bill_from_street_address" "text" DEFAULT '150 Tallant St'::"text",
    "bill_from_city" "text" DEFAULT 'Houston'::"text",
    "bill_from_zipcode" "text" DEFAULT '77076'::"text",
    "bill_to_street_address" "text",
    "bill_to_city" "text",
    "bill_to_state" "text",
    "bill_to_zipcode" "text",
    "cust_note" "text",
    "bill_from_email" "text",
    "bill_from_state" "text",
    "amount_due" double precision,
    "bill_to" boolean DEFAULT false,
    "converted_from_quote_number" bigint,
    "private_note" "text",
    "public_note" "text"
);


ALTER TABLE "public"."invoice" OWNER TO "postgres";


COMMENT ON TABLE "public"."invoice" IS 'Table that stores all the invoices.';



COMMENT ON COLUMN "public"."invoice"."cust_note" IS 'Note meant to be seen by the customer when we send out invoices to them.';



COMMENT ON COLUMN "public"."invoice"."amount_due" IS 'The purpose of this column is to create a field to have where be used as the total due when we subtract total minus payment.';



COMMENT ON COLUMN "public"."invoice"."bill_to" IS 'Boolean Value to determine if to display custom billing info for customer';



COMMENT ON COLUMN "public"."invoice"."private_note" IS 'This will store internal notes for a invoice that is only visible internally and not the customer when it comes to exporting.';



COMMENT ON COLUMN "public"."invoice"."public_note" IS 'This is a public note that each invoice will have in order to display note to customer.';



ALTER TABLE "public"."invoice" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."invoice_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invoice_line_service" (
    "id" bigint NOT NULL,
    "invoice_id" bigint NOT NULL,
    "service_id" bigint NOT NULL,
    "sq_ft" double precision,
    "qty" bigint NOT NULL,
    "rate" double precision,
    "amount" double precision NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "description" "text",
    "fixed_item" boolean
);


ALTER TABLE "public"."invoice_line_service" OWNER TO "postgres";


COMMENT ON COLUMN "public"."invoice_line_service"."description" IS 'This column describes the service that was done. Such as writing a custom name for it.';



COMMENT ON COLUMN "public"."invoice_line_service"."fixed_item" IS 'True or False flag to determine if to use the rate or the fixed are amount.';



ALTER TABLE "public"."invoice_line_service" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."invoice_line_service_duplicate_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invoice_payment" (
    "id" bigint NOT NULL,
    "invoice_id" bigint,
    "payment_method" "text",
    "amount" double precision,
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "date_received" "date"
);


ALTER TABLE "public"."invoice_payment" OWNER TO "postgres";


COMMENT ON TABLE "public"."invoice_payment" IS 'Table that stores all the payments made to an invoice by the customer';



COMMENT ON COLUMN "public"."invoice_payment"."date_received" IS 'The date when company has received payment for a invoice';



CREATE TABLE IF NOT EXISTS "public"."invoice_status" (
    "id" bigint NOT NULL,
    "name" "text",
    "description" "text",
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."invoice_status" OWNER TO "postgres";


COMMENT ON TABLE "public"."invoice_status" IS 'Table that stores all the status for the invoices.';



ALTER TABLE "public"."invoice_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."invoice_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."invoice_payment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_number" bigint,
    "address" "text" NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "status" "text" NOT NULL,
    "service" bigint,
    "customer" bigint,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


COMMENT ON TABLE "public"."projects" IS 'This stores all the roofing project that we are working on.';



CREATE TABLE IF NOT EXISTS "public"."proposal" (
    "id" bigint NOT NULL,
    "proposal_number" character varying(20) NOT NULL,
    "customer_id" bigint NOT NULL,
    "template_id" bigint NOT NULL,
    "service_id" bigint,
    "quote_id" bigint,
    "proposal_date" "date" NOT NULL,
    "valid_until_date" "date" NOT NULL,
    "status" character varying(20) DEFAULT 'Draft'::character varying NOT NULL,
    "variables_data" "text" NOT NULL,
    "subtotal" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "total" numeric(10,2) DEFAULT 0.00 NOT NULL,
    "notes" "text",
    "sent_at" timestamp with time zone,
    "viewed_at" timestamp with time zone,
    "accepted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "proposal_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['Draft'::character varying, 'Sent'::character varying, 'Viewed'::character varying, 'Accepted'::character varying, 'Declined'::character varying, 'Expired'::character varying])::"text"[])))
);


ALTER TABLE "public"."proposal" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."proposal_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."proposal_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."proposal_id_seq" OWNED BY "public"."proposal"."id";



CREATE TABLE IF NOT EXISTS "public"."proposal_template" (
    "id" bigint NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "service_type" character varying(50) NOT NULL,
    "google_doc_id" character varying(255),
    "template_content" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "variables" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."proposal_template" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."proposal_template_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."proposal_template_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."proposal_template_id_seq" OWNED BY "public"."proposal_template"."id";



CREATE TABLE IF NOT EXISTS "public"."proposal_variable" (
    "id" bigint NOT NULL,
    "template_id" bigint NOT NULL,
    "variable_name" character varying(50) NOT NULL,
    "variable_type" character varying(20) NOT NULL,
    "default_value" character varying(200),
    "required" boolean DEFAULT false NOT NULL,
    "options" "text",
    "description" character varying(200),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "proposal_variable_variable_type_check" CHECK ((("variable_type")::"text" = ANY ((ARRAY['text'::character varying, 'number'::character varying, 'date'::character varying, 'select'::character varying])::"text"[])))
);


ALTER TABLE "public"."proposal_variable" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."proposal_variable_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."proposal_variable_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."proposal_variable_id_seq" OWNED BY "public"."proposal_variable"."id";



CREATE TABLE IF NOT EXISTS "public"."quote" (
    "id" bigint NOT NULL,
    "quote_number" bigint NOT NULL,
    "customer_id" bigint NOT NULL,
    "status_id" bigint NOT NULL,
    "issue_date" "date",
    "expiration_date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "service_id" bigint NOT NULL,
    "subtotal" double precision,
    "total" double precision,
    "invoiced_total" double precision,
    "updated_at" timestamp with time zone,
    "quote_date" "date" NOT NULL,
    "note" "text",
    "measurement_note" "text",
    "cust_note" "text",
    "custom_street_address" "text",
    "custom_city" "text",
    "custom_state" "text",
    "custom_zipcode" "text",
    "custom_address" boolean,
    "converted" boolean DEFAULT false NOT NULL,
    "private_note" "text",
    "public_note" "text"
);


ALTER TABLE "public"."quote" OWNER TO "postgres";


COMMENT ON TABLE "public"."quote" IS 'To manage roofing quotes that we can provide to customers.';



COMMENT ON COLUMN "public"."quote"."measurement_note" IS 'mean to store the metric of the roof and come up with the estimated price to charge for the job.';



COMMENT ON COLUMN "public"."quote"."converted" IS 'This column will be used to determine if a invoice has been converted or not.';



COMMENT ON COLUMN "public"."quote"."private_note" IS 'Note that is only visible internally and not to the customer.';



COMMENT ON COLUMN "public"."quote"."public_note" IS 'Note that is only visible externally for the customer to see.';



ALTER TABLE "public"."quote" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quote_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."quote_line_item" (
    "id" bigint NOT NULL,
    "quote_id" bigint NOT NULL,
    "service_id" bigint NOT NULL,
    "qty" bigint NOT NULL,
    "amount" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone,
    "rate" double precision,
    "sq_ft" double precision,
    "description" "text" NOT NULL,
    "fixed_item" boolean DEFAULT true,
    "subtotal" double precision
);


ALTER TABLE "public"."quote_line_item" OWNER TO "postgres";


COMMENT ON TABLE "public"."quote_line_item" IS 'Table that stores the line items for each quote.';



ALTER TABLE "public"."quote_line_item" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quote_item_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."quote_status" (
    "id" bigint NOT NULL,
    "name" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."quote_status" OWNER TO "postgres";


ALTER TABLE "public"."quote_status" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."quote_status_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."service" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "updated_at" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "default_price" "text"
);


ALTER TABLE "public"."service" OWNER TO "postgres";


COMMENT ON TABLE "public"."service" IS 'A list of all the types of services the roofing company can provide to their customers.';



COMMENT ON COLUMN "public"."service"."default_price" IS 'Due to the fact that my services don''t have a set price and requires a quote. We will store a default price for the service such as $300 per sq or $100 per hour. ';



ALTER TABLE "public"."service" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."service_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."proposal" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."proposal_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."proposal_template" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."proposal_template_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."proposal_variable" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."proposal_variable_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."connected_accounts"
    ADD CONSTRAINT "connected_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."connected_accounts"
    ADD CONSTRAINT "connected_accounts_user_id_provider_account_id_key" UNIQUE ("user_id", "provider", "account_id");



ALTER TABLE ONLY "public"."customer"
    ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_type"
    ADD CONSTRAINT "customer_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quote_request"
    ADD CONSTRAINT "estimate_request_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."quote_request"
    ADD CONSTRAINT "estimate_request_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quote_request_status"
    ADD CONSTRAINT "estimate_request_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_converted_from_quote_number_key" UNIQUE ("converted_from_quote_number");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_invoice_number_key" UNIQUE ("invoice_number");



ALTER TABLE ONLY "public"."invoice_line_service"
    ADD CONSTRAINT "invoice_line_service_duplicate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice_status"
    ADD CONSTRAINT "invoice_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice_payment"
    ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proposal"
    ADD CONSTRAINT "proposal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proposal"
    ADD CONSTRAINT "proposal_proposal_number_key" UNIQUE ("proposal_number");



ALTER TABLE ONLY "public"."proposal_template"
    ADD CONSTRAINT "proposal_template_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proposal_variable"
    ADD CONSTRAINT "proposal_variable_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."proposal_variable"
    ADD CONSTRAINT "proposal_variable_template_id_variable_name_key" UNIQUE ("template_id", "variable_name");



ALTER TABLE ONLY "public"."quote_line_item"
    ADD CONSTRAINT "quote_item_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quote"
    ADD CONSTRAINT "quote_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quote"
    ADD CONSTRAINT "quote_quote_number_key" UNIQUE ("quote_number");



ALTER TABLE ONLY "public"."quote_status"
    ADD CONSTRAINT "quote_status_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service"
    ADD CONSTRAINT "service_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."service"
    ADD CONSTRAINT "service_type_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_connected_accounts_is_active" ON "public"."connected_accounts" USING "btree" ("is_active");



CREATE INDEX "idx_connected_accounts_is_default" ON "public"."connected_accounts" USING "btree" ("is_default");



CREATE INDEX "idx_connected_accounts_provider" ON "public"."connected_accounts" USING "btree" ("provider");



CREATE INDEX "idx_connected_accounts_user_id" ON "public"."connected_accounts" USING "btree" ("user_id");



CREATE INDEX "idx_connected_accounts_user_provider" ON "public"."connected_accounts" USING "btree" ("user_id", "provider");



CREATE INDEX "idx_proposal_created_at" ON "public"."proposal" USING "btree" ("created_at");



CREATE INDEX "idx_proposal_customer_id" ON "public"."proposal" USING "btree" ("customer_id");



CREATE INDEX "idx_proposal_proposal_date" ON "public"."proposal" USING "btree" ("proposal_date");



CREATE INDEX "idx_proposal_quote_id" ON "public"."proposal" USING "btree" ("quote_id");



CREATE INDEX "idx_proposal_service_id" ON "public"."proposal" USING "btree" ("service_id");



CREATE INDEX "idx_proposal_status" ON "public"."proposal" USING "btree" ("status");



CREATE INDEX "idx_proposal_template_created_at" ON "public"."proposal_template" USING "btree" ("created_at");



CREATE INDEX "idx_proposal_template_id" ON "public"."proposal" USING "btree" ("template_id");



CREATE INDEX "idx_proposal_template_is_active" ON "public"."proposal_template" USING "btree" ("is_active");



CREATE INDEX "idx_proposal_template_service_type" ON "public"."proposal_template" USING "btree" ("service_type");



CREATE INDEX "idx_proposal_valid_until_date" ON "public"."proposal" USING "btree" ("valid_until_date");



CREATE INDEX "idx_proposal_variable_required" ON "public"."proposal_variable" USING "btree" ("required");



CREATE INDEX "idx_proposal_variable_template_id" ON "public"."proposal_variable" USING "btree" ("template_id");



CREATE INDEX "idx_proposal_variable_type" ON "public"."proposal_variable" USING "btree" ("variable_type");



CREATE OR REPLACE TRIGGER "trigger_ensure_single_default_account" BEFORE INSERT OR UPDATE ON "public"."connected_accounts" FOR EACH ROW EXECUTE FUNCTION "public"."ensure_single_default_account"();



CREATE OR REPLACE TRIGGER "trigger_update_connected_accounts_updated_at" BEFORE UPDATE ON "public"."connected_accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_connected_accounts_updated_at"();



CREATE OR REPLACE TRIGGER "update_amount_due" AFTER INSERT OR DELETE OR UPDATE ON "public"."invoice_payment" FOR EACH ROW EXECUTE FUNCTION "public"."update_invoice_amount_due"();



CREATE OR REPLACE TRIGGER "update_invoice_totals" AFTER INSERT OR DELETE OR UPDATE ON "public"."invoice_line_service" FOR EACH ROW EXECUTE FUNCTION "public"."update_invoice_totals"();



CREATE OR REPLACE TRIGGER "update_proposal_template_updated_at" BEFORE UPDATE ON "public"."proposal_template" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_proposal_updated_at" BEFORE UPDATE ON "public"."proposal" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_proposal_variable_updated_at" BEFORE UPDATE ON "public"."proposal_variable" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_quote_totals" AFTER INSERT OR DELETE OR UPDATE ON "public"."quote_line_item" FOR EACH ROW EXECUTE FUNCTION "public"."update_quote_totals"();



ALTER TABLE ONLY "public"."connected_accounts"
    ADD CONSTRAINT "connected_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."customer"
    ADD CONSTRAINT "customer_customer_type_id_fkey" FOREIGN KEY ("customer_type_id") REFERENCES "public"."customer_type"("id");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_invoice_status_id_fkey" FOREIGN KEY ("invoice_status_id") REFERENCES "public"."invoice_status"("id");



ALTER TABLE ONLY "public"."invoice_line_service"
    ADD CONSTRAINT "invoice_line_service_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("invoice_number");



ALTER TABLE ONLY "public"."invoice_line_service"
    ADD CONSTRAINT "invoice_line_service_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id");



ALTER TABLE ONLY "public"."invoice_payment"
    ADD CONSTRAINT "invoice_payment_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("invoice_number");



ALTER TABLE ONLY "public"."invoice"
    ADD CONSTRAINT "invoice_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "public"."service"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_customer_fkey" FOREIGN KEY ("customer") REFERENCES "public"."customer"("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_service_fkey" FOREIGN KEY ("service") REFERENCES "public"."service"("id");



ALTER TABLE ONLY "public"."proposal"
    ADD CONSTRAINT "proposal_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."proposal"
    ADD CONSTRAINT "proposal_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quote"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."proposal"
    ADD CONSTRAINT "proposal_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."proposal"
    ADD CONSTRAINT "proposal_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."proposal_template"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."proposal_variable"
    ADD CONSTRAINT "proposal_variable_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."proposal_template"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quote"
    ADD CONSTRAINT "quote_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id");



ALTER TABLE ONLY "public"."quote_line_item"
    ADD CONSTRAINT "quote_line_item_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quote"("quote_number");



ALTER TABLE ONLY "public"."quote_line_item"
    ADD CONSTRAINT "quote_line_item_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id");



ALTER TABLE ONLY "public"."quote_request"
    ADD CONSTRAINT "quote_request_customer_typeID_fkey" FOREIGN KEY ("customer_typeID") REFERENCES "public"."customer_type"("id");



ALTER TABLE ONLY "public"."quote_request"
    ADD CONSTRAINT "quote_request_est_request_status_id_fkey" FOREIGN KEY ("est_request_status_id") REFERENCES "public"."quote_request_status"("id");



ALTER TABLE ONLY "public"."quote_request"
    ADD CONSTRAINT "quote_request_service_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "public"."service"("id");



ALTER TABLE ONLY "public"."quote"
    ADD CONSTRAINT "quote_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id");



ALTER TABLE ONLY "public"."quote"
    ADD CONSTRAINT "quote_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."quote_status"("id");



CREATE POLICY "Authenticated users can manage proposal templates" ON "public"."proposal_template" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable all for authenticated users only" ON "public"."customer" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for authenticated users only" ON "public"."customer_type" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for authenticated users only" ON "public"."quote_line_item" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for authenticated users only" ON "public"."quote_request" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for authenticated users only" ON "public"."quote_request_status" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for authenticated users only" ON "public"."quote_status" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations for authenticated users only" ON "public"."service" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations insert for authenticated users only" ON "public"."invoice" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations insert for authenticated users only" ON "public"."invoice_line_service" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations insert for authenticated users only" ON "public"."invoice_payment" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations insert for authenticated users only" ON "public"."invoice_status" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable all operations insert for authenticated users only" ON "public"."quote" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable insert access for all users" ON "public"."quote_request" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."quote_request" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."service" FOR SELECT USING (true);



CREATE POLICY "Users can delete proposals" ON "public"."proposal" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can delete their own connected accounts" ON "public"."connected_accounts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert proposals" ON "public"."proposal" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can insert their own connected accounts" ON "public"."connected_accounts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage proposal variables" ON "public"."proposal_variable" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can update proposals" ON "public"."proposal" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can update their own connected accounts" ON "public"."connected_accounts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view active proposal templates" ON "public"."proposal_template" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Users can view proposal variables" ON "public"."proposal_variable" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can view proposals" ON "public"."proposal" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users can view their own connected accounts" ON "public"."connected_accounts" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."connected_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customer" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customer_type" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_line_service" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_payment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proposal" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proposal_template" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."proposal_variable" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quote" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quote_line_item" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quote_request" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quote_request_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quote_status" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."ensure_single_default_account"() TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_single_default_account"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_single_default_account"() TO "service_role";



GRANT ALL ON FUNCTION "public"."f_delfunc"("_name" "text", OUT "functions_dropped" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."f_delfunc"("_name" "text", OUT "functions_dropped" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."f_delfunc"("_name" "text", OUT "functions_dropped" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_month_revenue_with_percentage_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_month_revenue_with_percentage_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_month_revenue_with_percentage_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_current_year_total_revenue_with_percent_change"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_year_total_revenue_with_percent_change"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_year_total_revenue_with_percent_change"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_monthly_invoice_revenue_dataset"("year_input" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."get_monthly_invoice_revenue_dataset"("year_input" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_monthly_invoice_revenue_dataset"("year_input" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."max_invoice_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."max_invoice_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."max_invoice_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_connected_accounts_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_connected_accounts_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_connected_accounts_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_invoice_amount_due"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_invoice_amount_due"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_invoice_amount_due"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_invoice_amount_due_on_payment"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_invoice_amount_due_on_payment"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_invoice_amount_due_on_payment"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_invoice_totals"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_invoice_totals"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_invoice_totals"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_quote_totals"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_quote_totals"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_quote_totals"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



























GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."connected_accounts" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."connected_accounts" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."connected_accounts" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."customer" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."customer" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."customer" TO "service_role";



GRANT ALL ON SEQUENCE "public"."customer_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."customer_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."customer_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."customer_type" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."customer_type" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."customer_type" TO "service_role";



GRANT ALL ON SEQUENCE "public"."customer_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."customer_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."customer_type_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_request" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_request" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_request" TO "service_role";



GRANT ALL ON SEQUENCE "public"."estimate_request_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estimate_request_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estimate_request_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_request_status" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_request_status" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_request_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."estimate_request_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estimate_request_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estimate_request_status_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice" TO "service_role";



GRANT ALL ON SEQUENCE "public"."invoice_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."invoice_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."invoice_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_line_service" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_line_service" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_line_service" TO "service_role";



GRANT ALL ON SEQUENCE "public"."invoice_line_service_duplicate_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."invoice_line_service_duplicate_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."invoice_line_service_duplicate_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_payment" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_payment" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_payment" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_status" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_status" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."invoice_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."invoice_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."invoice_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."invoice_status_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payment_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."projects" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."projects" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."projects" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal" TO "service_role";



GRANT ALL ON SEQUENCE "public"."proposal_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."proposal_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."proposal_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal_template" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal_template" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal_template" TO "service_role";



GRANT ALL ON SEQUENCE "public"."proposal_template_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."proposal_template_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."proposal_template_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal_variable" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal_variable" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."proposal_variable" TO "service_role";



GRANT ALL ON SEQUENCE "public"."proposal_variable_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."proposal_variable_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."proposal_variable_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quote_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quote_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quote_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_line_item" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_line_item" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_line_item" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quote_item_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quote_item_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quote_item_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_status" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_status" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."quote_status" TO "service_role";



GRANT ALL ON SEQUENCE "public"."quote_status_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."quote_status_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."quote_status_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."service" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."service" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."service" TO "service_role";



GRANT ALL ON SEQUENCE "public"."service_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."service_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."service_type_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";































